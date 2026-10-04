const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = 3001; // Using 3001 to avoid conflict with the v1 server if it's running
const DB_FILE = fs.existsSync(path.join(__dirname, '../database.json'))
    ? path.join(__dirname, '../database.json')
    : path.join(__dirname, 'database.json');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../')));

// Supabase credentials
const DEFAULT_URL = 'https://vbscjdjzisdyohurjsro.supabase.co';
const DEFAULT_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZic2NqZGp6aXNkeW9odXJqc3JvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc2MjcwMjAsImV4cCI6MjEwMzIwMzAyMH0.c3iLIPXleuclBgy0B9Qe8U9kIyVHgOyNLLbbI_jpkr4';

const envUrl = process.env.SUPABASE_URL ? process.env.SUPABASE_URL.trim().replace(/^["']|["']$/g, '') : '';
const envKey = process.env.SUPABASE_ANON_KEY ? process.env.SUPABASE_ANON_KEY.trim().replace(/^["']|["']$/g, '') : '';

const supabaseUrl = (envUrl && envUrl.startsWith('https://')) ? envUrl : DEFAULT_URL;
// A valid JWT has 3 dot-separated segments
const supabaseKey = (envKey && envKey.split('.').length === 3) ? envKey : DEFAULT_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

// Memory storage for Multer (we will upload the buffer directly to Supabase)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Helper to read/write DB with safety
const readDB = () => {
    try {
        if (fs.existsSync(DB_FILE)) {
            return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
        }
    } catch (e) {
        console.error("readDB error:", e);
    }
    return { locations: [] };
};

const writeDB = (data) => {
    try {
        fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
    } catch (e) {
        console.error("writeDB error:", e);
    }
};

const { translateText, translateArray, autoTranslateScreenPayload } = require('./translate');

// Hardcoded admin credentials matching df-virtual-cards
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'DFAdmin2026!';

// --- API ROUTES ---

// 0. Authentication Endpoint
app.post('/api/auth', async (req, res) => {
    try {
        const { username, password } = req.body || {};
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
            return res.json({
                success: true,
                message: 'Login successful',
                user: { username: 'admin', name: 'Admin', role: 'admin' },
                token: 'df-admin-token-' + Date.now()
            });
        }

        // Check regular user in Supabase if exists in 'users' table
        try {
            const { data: user, error } = await supabase
                .from('users')
                .select('*')
                .eq('username', username)
                .single();

            if (user && !error) {
                const { password_hash, ...userWithoutPassword } = user;
                return res.json({
                    success: true,
                    message: 'Login successful',
                    user: userWithoutPassword,
                    token: 'df-user-token-' + Date.now()
                });
            }
        } catch (e) {
            // Supabase users table fallback
        }

        return res.status(401).json({ error: 'Invalid username or password' });
    } catch (err) {
        console.error('Auth error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// 1. Get all screens (locations)
app.get('/api/locations', async (req, res) => {
    try {
        const { data, error } = await supabase.from('locations').select('*');
        if (error) throw error;
        if (data && data.length > 0) {
            return res.json(data);
        }
    } catch (err) {
        console.warn('Supabase fetch failed or paused, falling back to database.json:', err.message || err);
    }
    const db = readDB();
    res.json(db.locations || []);
});

// 2. Get specific screen
app.get('/api/locations/:id', async (req, res) => {
    try {
        const { data, error } = await supabase.from('locations').select('*').eq('id', req.params.id).single();
        if (error) throw error;
        if (data) return res.json(data);
    } catch (err) {
        console.warn('Supabase single fetch failed, falling back to database.json:', err.message || err);
    }
    const db = readDB();
    const found = (db.locations || []).find(l => l.id === req.params.id);
    if (found) return res.json(found);
    res.status(404).json({ error: "Location not found" });
});

// 3. Create new screen (with automatic English -> Latvian translation fallback)
app.post('/api/locations', async (req, res) => {
    try {
        const translatedPayload = await autoTranslateScreenPayload(req.body);
        let created = translatedPayload;
        try {
            const { data, error } = await supabase.from('locations').insert([translatedPayload]).select();
            if (!error && data && data[0]) created = data[0];
        } catch (e) {
            console.warn('Supabase insert skipped (offline):', e.message || e);
        }
        // Always persist to local DB
        const db = readDB();
        db.locations = db.locations || [];
        const idx = db.locations.findIndex(l => l.id === created.id);
        if (idx >= 0) db.locations[idx] = created;
        else db.locations.push(created);
        writeDB(db);

        res.json({ success: true, location: created });
    } catch (err) {
        console.error("Error creating location:", err);
        res.status(500).json({ error: err.message });
    }
});

// 4. Update specific screen (with automatic English -> Latvian translation fallback)
app.put('/api/locations/:id', async (req, res) => {
    try {
        const translatedPayload = await autoTranslateScreenPayload(req.body);
        let updated = translatedPayload;
        try {
            const { data, error } = await supabase.from('locations').update(translatedPayload).eq('id', req.params.id).select();
            if (!error && data && data[0]) updated = data[0];
        } catch (e) {
            console.warn('Supabase update skipped (offline):', e.message || e);
        }
        // Always persist to local DB
        const db = readDB();
        db.locations = db.locations || [];
        const idx = db.locations.findIndex(l => l.id === req.params.id);
        if (idx >= 0) {
            db.locations[idx] = { ...db.locations[idx], ...updated };
            updated = db.locations[idx];
        } else {
            db.locations.push(updated);
        }
        writeDB(db);

        res.json({ success: true, location: updated });
    } catch (err) {
        console.error("Error updating location:", err);
        res.status(500).json({ error: err.message });
    }
});

// 5. Delete specific screen
app.delete('/api/locations/:id', async (req, res) => {
    try {
        await supabase.from('locations').delete().eq('id', req.params.id);
    } catch (e) {}
    const db = readDB();
    db.locations = (db.locations || []).filter(l => l.id !== req.params.id);
    writeDB(db);
    res.json({ success: true });
});

// 5b. On-demand translation endpoint
app.post('/api/translate', async (req, res) => {
    try {
        const { text, arr, from = 'en', to = 'lv' } = req.body;
        if (Array.isArray(arr)) {
            const translatedArr = await translateArray(arr, from, to);
            return res.json({ success: true, translated: translatedArr });
        } else if (typeof text === 'string') {
            const translated = await translateText(text, from, to);
            return res.json({ success: true, translated });
        }
        res.status(400).json({ error: "Please provide 'text' string or 'arr' array to translate." });
    } catch (err) {
        console.error("Translate endpoint error:", err);
        res.status(500).json({ error: err.message });
    }
});

// 6. Upload image (Local Disk + Supabase Storage Sync)
app.post('/api/upload', upload.single('image'), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    try {
        const fileExt = path.extname(req.file.originalname) || '.jpg';
        const fileName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${fileExt}`;
        const filePath = `uploads/${fileName}`;

        // 1. Save to local disk in /uploads folder
        const uploadsDir = path.join(__dirname, '../uploads');
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }
        const localFilePath = path.join(uploadsDir, fileName);
        fs.writeFileSync(localFilePath, req.file.buffer);

        let finalUrl = `/uploads/${fileName}`;

        // 2. Attempt remote Supabase Storage upload
        try {
            const { data, error } = await supabase.storage
                .from('images')
                .upload(filePath, req.file.buffer, {
                    contentType: req.file.mimetype || 'image/jpeg',
                    cacheControl: '3600',
                    upsert: false
                });

            if (!error) {
                const { data: publicUrlData } = supabase.storage
                    .from('images')
                    .getPublicUrl(filePath);
                if (publicUrlData && publicUrlData.publicUrl) {
                    finalUrl = publicUrlData.publicUrl;
                }
            } else {
                console.warn("Supabase storage sync skipped:", error.message);
            }
        } catch (sbErr) {
            console.warn("Supabase storage connection skipped:", sbErr.message);
        }

        res.json({ url: finalUrl, localUrl: `/uploads/${fileName}`, fileName });

    } catch (err) {
        console.error("Upload exception:", err);
        res.status(500).json({ error: 'Internal Server Error during upload: ' + err.message });
    }
});

// --- RENDERER ROUTE ---

app.get('/view/:id', async (req, res) => {
    let location = null;
    try {
        const { data, error } = await supabase.from('locations').select('*').eq('id', req.params.id).single();
        if (!error && data) location = data;
    } catch (e) {}

    if (!location) {
        const db = readDB();
        location = (db.locations || []).find(l => l.id === req.params.id);
    }
    
    if (!location) {
        return res.status(404).send("<h1>Screen not found</h1>");
    }

    const templateName = location.template || 'designfactory';
    const templatePath = path.join(__dirname, '../templates', `${templateName}.html`);
    
    if (!fs.existsSync(templatePath)) {
        return res.status(404).send("<h1>Template not found</h1>");
    }

    res.sendFile(templatePath);
});

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Portal Server is running on http://localhost:${PORT}`);
    });
}

module.exports = app;
