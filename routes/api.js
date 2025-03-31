const express = require('express');
const { login, callback, getUserData } = require('../controllers/spotifyController');

const router = express.Router();

router.get('/login', login);
router.get('/callback', callback);
router.get('/user/:id', getUserData);

module.exports = router;
