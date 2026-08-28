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

// Helper to read/write DB
const readDB = () => JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
const writeDB = (data) => fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');

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
    const { data, error } = await supabase.from('locations').select('*');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// 2. Get specific screen
app.get('/api/locations/:id', async (req, res) => {
    const { data, error } = await supabase.from('locations').select('*').eq('id', req.params.id).single();
    if (error) return res.status(404).json({ error: "Location not found" });
    res.json(data);
});

// 3. Create new screen (with automatic English -> Latvian translation fallback)
app.post('/api/locations', async (req, res) => {
    try {
        const translatedPayload = await autoTranslateScreenPayload(req.body);
        const { data, error } = await supabase.from('locations').insert([translatedPayload]).select();
        if (error) return res.status(500).json({ error: error.message });
        res.json({ success: true, location: data[0] });
    } catch (err) {
        console.error("Error creating location:", err);
        res.status(500).json({ error: err.message });
    }
});

// 4. Update specific screen (with automatic English -> Latvian translation fallback)
app.put('/api/locations/:id', async (req, res) => {
    try {
        const translatedPayload = await autoTranslateScreenPayload(req.body);
        const { data, error } = await supabase.from('locations').update(translatedPayload).eq('id', req.params.id).select();
        if (error) return res.status(500).json({ error: error.message });
        res.json({ success: true, location: data[0] });
    } catch (err) {
        console.error("Error updating location:", err);
        res.status(500).json({ error: err.message });
    }
});

// 5. Delete specific screen
app.delete('/api/locations/:id', async (req, res) => {
    const { error } = await supabase.from('locations').delete().eq('id', req.params.id);
    if (error) return res.status(500).json({ error: error.message });
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

// 6. Upload image directly to Supabase Storage
app.post('/api/upload', upload.single('image'), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    try {
        const fileExt = path.extname(req.file.originalname);
        const fileName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${fileExt}`;
        const filePath = `uploads/${fileName}`;

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

app.get('/view/:id', async (req, res) => {
    const { data: location, error } = await supabase.from('locations').select('*').eq('id', req.params.id).single();
    
    if (error || !location) {
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
