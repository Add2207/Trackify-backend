const axios = require('axios');
const querystring = require('querystring');
const User = require('../models/User');

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = process.env.REDIRECT_URI;

// Generate Random String for State
const generateRandomString = (length) => {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

// Spotify Login URL
const login = (req, res) => {
    const state = generateRandomString(16);
    const scope = 'user-read-recently-played user-top-read';

    res.redirect(
        `https://accounts.spotify.com/authorize?${querystring.stringify({
            response_type: 'code',
            client_id,
            scope,
            redirect_uri,
            state,
        })}`
    );
};

// Spotify Callback
const callback = async (req, res) => {
    const code = req.query.code || null;
    const tokenOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
            code,
            redirect_uri,
            grant_type: 'authorization_code',
        },
        headers: {
            Authorization:
                'Basic ' +
                Buffer.from(client_id + ':' + client_secret).toString('base64'),
        },
        json: true,
    };

    try {
        const tokenResponse = await axios.post(tokenOptions.url, querystring.stringify(tokenOptions.form), {
            headers: tokenOptions.headers,
        });

        const access_token = tokenResponse.data.access_token;
        const userResponse = await axios.get('https://api.spotify.com/v1/me', {
            headers: { Authorization: `Bearer ${access_token}` },
        });

        const userId = userResponse.data.id;
        const displayName = userResponse.data.display_name;
        const email = userResponse.data.email;

        const recentTracksResponse = await axios.get(
            'https://api.spotify.com/v1/me/player/recently-played?limit=50',
            { headers: { Authorization: `Bearer ${access_token}` } }
        );

        const totalMinutes = recentTracksResponse.data.items.reduce((acc, item) => acc + item.track.duration_ms, 0) / 60000;

        const topTracksResponse = await axios.get(
            'https://api.spotify.com/v1/me/top/tracks?limit=5',
            { headers: { Authorization: `Bearer ${access_token}` } }
        );

        const topTracks = topTracksResponse.data.items.map((track) => ({
            name: track.name,
            artist: track.artists[0].name,
        }));

        const user = await User.findOneAndUpdate(
            { spotifyId: userId },
            {
                spotifyId: userId,
                displayName,
                email,
                topTracks,
                minutesListened: totalMinutes,
            },
            { upsert: true, new: true }
        );

        res.redirect(`https://yourusername.github.io/Trackify/?userId=${user._id}`);
    } catch (error) {
        console.error('Error:', error);
        res.send('Error during authentication.');
    }
};

// Get User Data
const getUserData = async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
};

module.exports = { login, callback, getUserData };
