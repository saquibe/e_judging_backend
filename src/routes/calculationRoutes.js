// routes/calculationRoutes.js
import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { calculateResults, getAbstractResults } from "../controllers/calculationController.js";

const router = express.Router();

// GET all results with averages
router.get("/results", protect, calculateResults);

// GET results for specific abstract
router.get("/results/:abstractNo", protect, getAbstractResults);

export default router;