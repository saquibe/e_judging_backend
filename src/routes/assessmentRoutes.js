import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  // ePoster
  getSingleEposter,
  submitEposterAssessment,
  updateEposterAssessment,
  // Paper Presentation
  getSinglePaperPresentation,
  submitPaperPresentationAssessment,
  updatePaperPresentationAssessment,
  // Video Presentation
  getSingleVideoPresentation,
  submitVideoPresentationAssessment,
  updateVideoPresentationAssessment,
} from "../controllers/assessmentController.js";

const router = express.Router();

// ePoster Presentation routes
router.get("/eposter/:abstractNo", protect, getSingleEposter);
router.post("/eposter/assess", protect, submitEposterAssessment);
router.put("/eposter/assess/:abstractNo", protect, updateEposterAssessment);

// Paper Presentation routes
router.get(
  "/paper-presentation/:abstractNo",
  protect,
  getSinglePaperPresentation
);
router.post(
  "/paper-presentation/assess",
  protect,
  submitPaperPresentationAssessment
);
router.put(
  "/paper-presentation/assess/:abstractNo",
  protect,
  updatePaperPresentationAssessment
);

// Video Presentation routes
router.get(
  "/video-presentation/:abstractNo",
  protect,
  getSingleVideoPresentation
);
router.post(
  "/video-presentation/assess",
  protect,
  submitVideoPresentationAssessment
);
router.put(
  "/video-presentation/assess/:abstractNo",
  protect,
  updateVideoPresentationAssessment
);

export default router;
