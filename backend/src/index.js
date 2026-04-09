const express = require('express');
const cors = require('cors');
const dataService = require('./dataService');

const fs = require('fs');
const path = require('path');
const app = express();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS']
}));
app.use(express.json());

const INSIGHTS_PATH = path.join(__dirname, 'insights.json');

// Helper to read/write insights
const getInsights = () => {
    try {
        if (!fs.existsSync(INSIGHTS_PATH)) return { note: '' };
        return JSON.parse(fs.readFileSync(INSIGHTS_PATH, 'utf8'));
    } catch (e) {
        return { note: '' };
    }
};

const saveInsights = (data) => {
    fs.writeFileSync(INSIGHTS_PATH, JSON.stringify(data, null, 2));
};

app.get('/api/insights', (req, res) => {
    res.json(getInsights());
});

app.post('/api/insights', (req, res) => {
    const { note } = req.body;
    saveInsights({ note });
    res.json({ success: true });
});

app.delete('/api/insights', (req, res) => {
    const { password } = req.query;
    if (password !== '1234') {
        return res.status(401).json({ error: 'Senha incorreta' });
    }
    saveInsights({ note: '' });
    res.json({ success: true });
});

// Refresh in background every 1 hour (optional)
setInterval(() => {
    dataService.refreshData();
}, 60 * 60 * 1000);

app.get('/api/data/source1', async (req, res) => {
    try {
        const data = await dataService.getSource1();
        res.json(data);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.get('/api/data/source2', async (req, res) => {
    try {
        const data = await dataService.getSource2();
        res.json(data);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, async () => {
    console.log(`Backend is running on port ${PORT}`);
    // Pre-fetch data on start
    await dataService.refreshData();
});
