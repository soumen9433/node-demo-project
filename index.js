'use strict';

const express = require('express');
const client = require('prom-client');

// Create Prometheus registry & collect default Node.js metrics
const register = new client.Registry();
client.collectDefaultMetrics({ register });

const PORT = 8080;
const HOST = '0.0.0.0';

const app = express();

// Root endpoint
app.get('/', (req, res) => {
    res.json({ sentence: 'Welcome to the CICD Automation world' });
});

// Prometheus /metrics endpoint
app.get('/metrics', async (req, res) => {
    try {
        res.setHeader('Content-Type', register.contentType);
        res.send(await register.metrics());
    } catch (err) {
        console.error('Metrics error:', err);
        res.status(500).json({ error: 'Failed to fetch metrics' });
    }
});

// ALB health check endpoint
app.get('/ping', (req, res) => {
    res.status(200).json({ message: "pong" });
});

// Error simulation endpoint
app.get('/error', (req, res) => {
    res.status(500).json({ error: "Internal Server Error" });
});

// Start server
app.listen(PORT, HOST, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
});
