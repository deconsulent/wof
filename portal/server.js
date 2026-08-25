const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = 3001; // Using 3001 to avoid conflict with the v1 server if it's running
const DB_FILE = path.join(__dirname, 'database.json');

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Initialize Supabase
const supabaseUrl = 'https://vbscjdjzisdyohurjsro.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZic2NqZGp6aXNkeW9odXJqc3JvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc2MjcwMjAsImV4cCI6MjEwMzIwMzAyMH0.c3iLIPXleuclBgy0B9Qe8U9kIyVHgOyNLLbbI_jpkr4';
const supabase = createClient(supabaseUrl, supabaseKey);

// Memory storage for Multer (we will upload the buffer directly to Supabase)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Helper to read/write DB
const readDB = () => JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
const writeDB = (data) => fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');

// --- API ROUTES ---

// 1. Get all screens (locations)
app.get('/api/locations', (req, res) => {
    res.json(readDB().locations);
});

// 2. Get specific screen
app.get('/api/locations/:id', (req, res) => {
    const db = readDB();
    const location = db.locations.find(loc => loc.id === req.params.id);
    if (location) res.json(location);
    else res.status(404).json({ error: "Location not found" });
});

// 3. Create new screen
app.post('/api/locations', (req, res) => {
    const db = readDB();
    const newLoc = { ...req.body, inductees: [] };
    db.locations.push(newLoc);
    writeDB(db);
    res.json({ success: true, location: newLoc });
});

// 4. Update specific screen
app.put('/api/locations/:id', (req, res) => {
    const db = readDB();
    const index = db.locations.findIndex(loc => loc.id === req.params.id);
    if (index !== -1) {
        db.locations[index] = { ...db.locations[index], ...req.body };
        writeDB(db);
        res.json({ success: true, location: db.locations[index] });
    } else {
        res.status(404).json({ error: "Location not found" });
    }
});

// 5. Delete specific screen
app.delete('/api/locations/:id', (req, res) => {
    const db = readDB();
    db.locations = db.locations.filter(loc => loc.id !== req.params.id);
    writeDB(db);
    res.json({ success: true });
});

// 6. Upload image directly to Supabase Storage
app.post('/api/upload', upload.single('image'), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    try {
        const fileExt = path.extname(req.file.originalname);
        const fileName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${fileExt}`;
        const filePath = `uploads/${fileName}`;

        // Upload to Supabase 'images' bucket
        // Note: Please ensure you have a public bucket named 'images' created in Supabase!
        const { data, error } = await supabase.storage
            .from('images')
            .upload(filePath, req.file.buffer, {
                contentType: req.file.mimetype,
                cacheControl: '3600',
                upsert: false
            });

        if (error) {
            console.error("Supabase Upload Error:", error);
            return res.status(500).json({ error: error.message });
        }

        // Get public URL
        const { data: publicUrlData } = supabase.storage
            .from('images')
            .getPublicUrl(filePath);

        res.json({ url: publicUrlData.publicUrl });

    } catch (err) {
        console.error("Upload exception:", err);
        res.status(500).json({ error: 'Internal Server Error during upload' });
    }
});

// --- RENDERER ROUTE ---

app.get('/view/:id', (req, res) => {
    const db = readDB();
    const location = db.locations.find(loc => loc.id === req.params.id);
    
    if (!location) {
        return res.status(404).send("<h1>Screen not found</h1>");
    }

    const templateName = location.template || 'designfactory';
    const templatePath = path.join(__dirname, 'templates', `${templateName}.html`);
    
    if (!fs.existsSync(templatePath)) {
        return res.status(404).send("<h1>Template not found</h1>");
    }

    res.sendFile(templatePath);
});

app.listen(PORT, () => {
    console.log(`Portal Server is running on http://localhost:${PORT}`);
});
