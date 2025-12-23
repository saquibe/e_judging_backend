import Eposter from "../models/Eposter.js";
import PaperPresentation from "../models/PaperPresentation.js";
import VideoPresentation from "../models/VideoPresentation.js";
import EposterAssessment from "../models/EposterAssessment.js";
import PaperPresentationAssessment from "../models/PaperPresentationAssessment.js";
import VideoPresentationAssessment from "../models/VideoPresentationAssessment.js";

// ========== ePoster Presentation Controllers ==========
export const getSingleEposter = async (req, res) => {
  try {
    const { abstractNo } = req.params;
    const judgeId = req.admin._id;

    const eposter = await Eposter.findOne({ abstractNo });
    if (!eposter)
      return res.status(404).json({
        success: false,
        message: "ePoster not found",
      });

    const assessment = await EposterAssessment.findOne({
      abstractId: eposter._id,
      judgeId,
    });

    res.json({
      success: true,
      data: {
        ...eposter.toObject(),
        isJudged: Boolean(assessment),
        assessment: assessment || null,
      },
    });
  } catch (err) {
    console.error("Error fetching ePoster:", err);
    res.status(500).json({
      success: false,
      message: "Error fetching ePoster",
    });
  }
};

export const submitEposterAssessment = async (req, res) => {
  try {
    const { abstractNo, scores, comments } = req.body;
    const judgeId = req.admin._id;

    const eposter = await Eposter.findOne({ abstractNo });
    if (!eposter)
      return res.status(404).json({
        success: false,
        message: "ePoster not found",
      });

    // Check if already assessed by this judge
    const exists = await EposterAssessment.findOne({
      abstractId: eposter._id,
      judgeId,
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "You have already submitted an assessment for this ePoster",
      });
    }

    const assessment = await EposterAssessment.create({
      abstractId: eposter._id,
      judgeId,
      scores,
      comments,
    });

    res.json({
      success: true,
      message: "ePoster assessment submitted successfully",
      data: assessment,
    });
  } catch (err) {
    console.error("Error submitting ePoster assessment:", err);
    res.status(500).json({
      success: false,
      message: "Failed to submit assessment",
    });
  }
};

// ========== Paper Presentation Controllers ==========
export const getSinglePaperPresentation = async (req, res) => {
  try {
    const { abstractNo } = req.params;
    const judgeId = req.admin._id;

    const paper = await PaperPresentation.findOne({ abstractNo });
    if (!paper)
      return res.status(404).json({
        success: false,
        message: "Paper presentation not found",
      });

    const assessment = await PaperPresentationAssessment.findOne({
      abstractId: paper._id,
      judgeId,
    });

    res.json({
      success: true,
      data: {
        ...paper.toObject(),
        isJudged: Boolean(assessment),
        assessment: assessment || null,
      },
    });
  } catch (err) {
    console.error("Error fetching paper presentation:", err);
    res.status(500).json({
      success: false,
      message: "Error fetching paper presentation",
    });
  }
};

export const submitPaperPresentationAssessment = async (req, res) => {
  try {
    const { abstractNo, scores, comments } = req.body;
    const judgeId = req.admin._id;

    const paper = await PaperPresentation.findOne({ abstractNo });
    if (!paper)
      return res.status(404).json({
        success: false,
        message: "Paper presentation not found",
      });

    // Check if already assessed by this judge
    const exists = await PaperPresentationAssessment.findOne({
      abstractId: paper._id,
      judgeId,
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message:
          "You have already submitted an assessment for this paper presentation",
      });
    }

    const assessment = await PaperPresentationAssessment.create({
      abstractId: paper._id,
      judgeId,
      scores,
      comments,
    });

    res.json({
      success: true,
      message: "Paper presentation assessment submitted successfully",
      data: assessment,
    });
  } catch (err) {
    console.error("Error submitting paper presentation assessment:", err);
    res.status(500).json({
      success: false,
      message: "Failed to submit assessment",
    });
  }
};

// ========== Video Presentation Controllers ==========
export const getSingleVideoPresentation = async (req, res) => {
  try {
    const { abstractNo } = req.params;
    const judgeId = req.admin._id;

    const video = await VideoPresentation.findOne({ abstractNo });
    if (!video)
      return res.status(404).json({
        success: false,
        message: "Video presentation not found",
      });

    const assessment = await VideoPresentationAssessment.findOne({
      abstractId: video._id,
      judgeId,
    });

    res.json({
      success: true,
      data: {
        ...video.toObject(),
        isJudged: Boolean(assessment),
        assessment: assessment || null,
      },
    });
  } catch (err) {
    console.error("Error fetching video presentation:", err);
    res.status(500).json({
      success: false,
      message: "Error fetching video presentation",
    });
  }
};

export const submitVideoPresentationAssessment = async (req, res) => {
  try {
    const { abstractNo, scores, comments } = req.body;
    const judgeId = req.admin._id;

    const video = await VideoPresentation.findOne({ abstractNo });
    if (!video)
      return res.status(404).json({
        success: false,
        message: "Video presentation not found",
      });

    // Check if already assessed by this judge
    const exists = await VideoPresentationAssessment.findOne({
      abstractId: video._id,
      judgeId,
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message:
          "You have already submitted an assessment for this video presentation",
      });
    }

    const assessment = await VideoPresentationAssessment.create({
      abstractId: video._id,
      judgeId,
      scores,
      comments,
    });

    res.json({
      success: true,
      message: "Video presentation assessment submitted successfully",
      data: assessment,
    });
  } catch (err) {
    console.error("Error submitting video presentation assessment:", err);
    res.status(500).json({
      success: false,
      message: "Failed to submit assessment",
    });
  }
};

// ========== Update Controllers (for all types) ==========
export const updateEposterAssessment = async (req, res) => {
  try {
    const { abstractNo } = req.params;
    const { scores, comments } = req.body;
    const judgeId = req.admin._id;

    const eposter = await Eposter.findOne({ abstractNo });
    if (!eposter)
      return res.status(404).json({
        success: false,
        message: "ePoster not found",
      });

    const updated = await EposterAssessment.findOneAndUpdate(
      { abstractId: eposter._id, judgeId },
      {
        scores,
        comments,
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Assessment not found for this ePoster",
      });
    }

    res.json({
      success: true,
      message: "ePoster assessment updated successfully",
      data: updated,
    });
  } catch (err) {
    console.error("Error updating ePoster assessment:", err);
    res.status(500).json({
      success: false,
      message: "Failed to update assessment",
    });
  }
};

export const updatePaperPresentationAssessment = async (req, res) => {
  try {
    const { abstractNo } = req.params;
    const { scores, comments } = req.body;
    const judgeId = req.admin._id;

    const paper = await PaperPresentation.findOne({ abstractNo });
    if (!paper)
      return res.status(404).json({
        success: false,
        message: "Paper presentation not found",
      });

    const updated = await PaperPresentationAssessment.findOneAndUpdate(
      { abstractId: paper._id, judgeId },
      {
        scores,
        comments,
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Assessment not found for this paper presentation",
      });
    }

    res.json({
      success: true,
      message: "Paper presentation assessment updated successfully",
      data: updated,
    });
  } catch (err) {
    console.error("Error updating paper presentation assessment:", err);
    res.status(500).json({
      success: false,
      message: "Failed to update assessment",
    });
  }
};

export const updateVideoPresentationAssessment = async (req, res) => {
  try {
    const { abstractNo } = req.params;
    const { scores, comments } = req.body;
    const judgeId = req.admin._id;

    const video = await VideoPresentation.findOne({ abstractNo });
    if (!video)
      return res.status(404).json({
        success: false,
        message: "Video presentation not found",
      });

    const updated = await VideoPresentationAssessment.findOneAndUpdate(
      { abstractId: video._id, judgeId },
      {
        scores,
        comments,
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Assessment not found for this video presentation",
      });
    }

    res.json({
      success: true,
      message: "Video presentation assessment updated successfully",
      data: updated,
    });
  } catch (err) {
    console.error("Error updating video presentation assessment:", err);
    res.status(500).json({
      success: false,
      message: "Failed to update assessment",
    });
  }
};
