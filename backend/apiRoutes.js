const express = require('express');
const axios = require('axios');

const router = express.Router();

// Get User Data
router.get('/me', async (req, res) => {
    const accessToken = req.session.accessToken;
    if (!accessToken) return res.status(401).send('Unauthorized');

    try {
        const response = await axios.get('https://api.spotify.com/v1/me', {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching user data:', error.response?.data || error);
        res.status(500).send('Failed to fetch user data');
    }
});

module.exports = router;
