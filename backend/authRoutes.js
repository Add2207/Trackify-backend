const express = require('express');
const axios = require('axios');
const pool = require('../config/db');
require('dotenv').config();

const router = express.Router();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

// Spotify Authorization
router.get('/login', (req, res) => {
    const scope = 'user-read-playback-state user-read-recently-played user-top-read';
    const params = new URLSearchParams({
        client_id: CLIENT_ID,
        response_type: 'code',
        redirect_uri: REDIRECT_URI,
        scope: scope
    }).toString();

    res.redirect(`https://accounts.spotify.com/authorize?${params}`);
});

// Callback Route
router.get('/callback', async (req, res) => {
    const code = req.query.code;
    const tokenUrl = 'https://accounts.spotify.com/api/token';

    try {
        const response = await axios.post(
            tokenUrl,
            new URLSearchParams({
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: REDIRECT_URI,
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET
            }).toString(),
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );

        const { access_token, refresh_token, expires_in } = response.data;

        // Store token in session or database
        req.session.accessToken = access_token;

        res.redirect(`http://localhost:3000?access_token=${access_token}`);
    } catch (error) {
        console.error('Error getting token:', error.response?.data || error);
        res.status(500).send('Authentication failed');
    }
});

module.exports = router;
