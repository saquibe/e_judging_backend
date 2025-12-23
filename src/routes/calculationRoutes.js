import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  calculateResults,
  getAbstractResults,
} from "../controllers/calculationController.js";

const router = express.Router();

router.get("/results", protect, calculateResults);
router.get("/results/:abstractNo", protect, getAbstractResults);

export default router;
