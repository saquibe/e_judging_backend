import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

import connectDB from './src/config/db.js';

// Routes
import adminRoutes from './src/routes/adminRoutes.js';
import abstractRoutes from './src/routes/abstractRoutes.js';
import eposterAssessmentRoutes from "./src/routes/eposterAssessmentRoutes.js";
import presentationAssessmentRoutes from "./src/routes/presentationAssessmentRoutes.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// DB
connectDB();

// Mount Routes
app.use('/api/admin', adminRoutes);
app.use('/api/abstracts', abstractRoutes);
app.use('/api/eposter', eposterAssessmentRoutes);   // ⭐ Added new assessment routes
app.use('/api/presentation', presentationAssessmentRoutes);

// Test Endpoint
app.get('/', (req, res) => {
    res.send('🎯 ePoster Judging API Running Successfully');
});

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
