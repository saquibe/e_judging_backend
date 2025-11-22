import express from "express";
import { protect } from "../middlewares/authMiddleware.js";

import {
    getSinglePresentation,
    submitPresentationAssessment,
    updatePresentationAssessment
} from "../controllers/presentationAssessmentController.js";

const router = express.Router();

router.get("/:abstractNo", protect, getSinglePresentation);
router.post("/assess", protect, submitPresentationAssessment);
router.put("/assess/:abstractNo", protect, updatePresentationAssessment);

export default router;
