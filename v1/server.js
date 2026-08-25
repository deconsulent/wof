const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DB_FILE = path.join(__dirname, 'database.json');

app.use(cors());
app.use(express.json());

// Serve static files (images, css, html)
app.use(express.static(__dirname));

// Helper to read DB
const readDB = () => {
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
};

// Helper to write DB
const writeDB = (data) => {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
};

// API: Get all locations (for Admin panel dropdown)
app.get('/api/locations', (req, res) => {
    const db = readDB();
    const list = db.locations.map(loc => ({ id: loc.id, name: loc.name }));
    res.json(list);
});

// API: Get specific location data (For Kiosk and Admin edit)
app.get('/api/locations/:id', (req, res) => {
    const db = readDB();
    const location = db.locations.find(loc => loc.id === req.params.id);
    if (location) {
        res.json(location);
    } else {
        res.status(404).json({ error: "Location not found" });
    }
});

// API: Update specific location data (For Admin Panel)
app.put('/api/locations/:id', (req, res) => {
    const db = readDB();
    const index = db.locations.findIndex(loc => loc.id === req.params.id);
    
    if (index !== -1) {
        // Update the location
        db.locations[index] = { ...db.locations[index], ...req.body };
        writeDB(db);
        res.json({ success: true, location: db.locations[index] });
    } else {
        res.status(404).json({ error: "Location not found" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
