const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    spotifyId: String,
    displayName: String,
    email: String,
    topTracks: Array,
    minutesListened: Number,
});

const User = mongoose.model('User', userSchema);

module.exports = User;
