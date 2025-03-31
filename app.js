const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const apiRoutes = require('./routes/api');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// API Routes
app.use('/api', apiRoutes);

// Connect to MongoDB
const connectDB = require('./config/db');
connectDB();

// Start Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
