import Eposter from "../models/Eposter.js";
import PaperPresentation from "../models/PaperPresentation.js";
import VideoPresentation from "../models/VideoPresentation.js";
import EposterAssessment from "../models/EposterAssessment.js";
import PaperPresentationAssessment from "../models/PaperPresentationAssessment.js";
import VideoPresentationAssessment from "../models/VideoPresentationAssessment.js";

export const calculateResults = async (req, res) => {
  try {
    const { type } = req.query; // 'ePoster Presentation', 'Paper Presentation', 'Video Presentation', or undefined for all

    let results = [];

    if (!type || type === "ePoster Presentation") {
      const eposterResults = await calculateEposterResults();
      results = [...results, ...eposterResults];
    }

    if (!type || type === "Paper Presentation") {
      const paperResults = await calculatePaperPresentationResults();
      results = [...results, ...paperResults];
    }

    if (!type || type === "Video Presentation") {
      const videoResults = await calculateVideoPresentationResults();
      results = [...results, ...videoResults];
    }

    // Sort by average score (descending)
    results.sort((a, b) => b.averageScore - a.averageScore);

    res.json({
      success: true,
      total: results.length,
      data: results,
    });
  } catch (err) {
    console.error("Calculation error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to calculate results",
    });
  }
};

const calculateEposterResults = async () => {
  const eposters = await Eposter.find();

  const results = await Promise.all(
    eposters.map(async (eposter) => {
      const assessments = await EposterAssessment.find({
        abstractId: eposter._id,
      });

      if (assessments.length === 0) {
        return null;
      }

      // Calculate total score for each judge
      const judgeTotals = assessments.map((assessment) => {
        const scores = assessment.scores;
        return Object.values(scores).reduce((sum, score) => sum + score, 0);
      });

      // Calculate category totals and averages
      const categoryTotals = assessments.reduce((acc, assessment) => {
        const scores = assessment.scores;
        Object.keys(scores).forEach((key) => {
          acc[key] = (acc[key] || 0) + scores[key];
        });
        return acc;
      }, {});

      const categoryAverages = {};
      Object.keys(categoryTotals).forEach((key) => {
        categoryAverages[key] = parseFloat(
          (categoryTotals[key] / assessments.length).toFixed(2)
        );
      });

      const totalScore = judgeTotals.reduce((sum, total) => sum + total, 0);
      const averageScore = parseFloat(
        (totalScore / assessments.length).toFixed(2)
      );

      return {
        id: eposter._id.toString(),
        abstractNo: eposter.abstractNo,
        author: eposter.author,
        title: eposter.title,
        track: eposter.track,
        type: "ePoster Presentation",
        totalJudges: assessments.length,
        averageScore,
        totalScore,
        categoryScores: categoryAverages,
      };
    })
  );

  return results.filter((r) => r !== null);
};

const calculatePaperPresentationResults = async () => {
  const paperPresentations = await PaperPresentation.find();

  const results = await Promise.all(
    paperPresentations.map(async (paper) => {
      const assessments = await PaperPresentationAssessment.find({
        abstractId: paper._id,
      });

      if (assessments.length === 0) {
        return null;
      }

      const judgeTotals = assessments.map((assessment) => {
        const scores = assessment.scores;
        return Object.values(scores).reduce((sum, score) => sum + score, 0);
      });

      const categoryTotals = assessments.reduce((acc, assessment) => {
        const scores = assessment.scores;
        Object.keys(scores).forEach((key) => {
          acc[key] = (acc[key] || 0) + scores[key];
        });
        return acc;
      }, {});

      const categoryAverages = {};
      Object.keys(categoryTotals).forEach((key) => {
        categoryAverages[key] = parseFloat(
          (categoryTotals[key] / assessments.length).toFixed(2)
        );
      });

      const totalScore = judgeTotals.reduce((sum, total) => sum + total, 0);
      const averageScore = parseFloat(
        (totalScore / assessments.length).toFixed(2)
      );

      return {
        id: paper._id.toString(),
        abstractNo: paper.abstractNo,
        author: paper.author,
        title: paper.title,
        track: paper.track,
        hall: paper.hall,
        type: "Paper Presentation",
        totalJudges: assessments.length,
        averageScore,
        totalScore,
        categoryScores: categoryAverages,
      };
    })
  );

  return results.filter((r) => r !== null);
};

const calculateVideoPresentationResults = async () => {
  const videoPresentations = await VideoPresentation.find();

  const results = await Promise.all(
    videoPresentations.map(async (video) => {
      const assessments = await VideoPresentationAssessment.find({
        abstractId: video._id,
      });

      if (assessments.length === 0) {
        return null;
      }

      const judgeTotals = assessments.map((assessment) => {
        const scores = assessment.scores;
        return Object.values(scores).reduce((sum, score) => sum + score, 0);
      });

      const categoryTotals = assessments.reduce((acc, assessment) => {
        const scores = assessment.scores;
        Object.keys(scores).forEach((key) => {
          acc[key] = (acc[key] || 0) + scores[key];
        });
        return acc;
      }, {});

      const categoryAverages = {};
      Object.keys(categoryTotals).forEach((key) => {
        categoryAverages[key] = parseFloat(
          (categoryTotals[key] / assessments.length).toFixed(2)
        );
      });

      const totalScore = judgeTotals.reduce((sum, total) => sum + total, 0);
      const averageScore = parseFloat(
        (totalScore / assessments.length).toFixed(2)
      );

      return {
        id: video._id.toString(),
        abstractNo: video.abstractNo,
        author: video.author,
        title: video.title,
        track: video.track,
        hall: video.hall,
        type: "Video Presentation",
        totalJudges: assessments.length,
        averageScore,
        totalScore,
        categoryScores: categoryAverages,
      };
    })
  );

  return results.filter((r) => r !== null);
};

export const getAbstractResults = async (req, res) => {
  try {
    const { abstractNo } = req.params;
    const { type } = req.query; // 'ePoster Presentation', 'Paper Presentation', 'Video Presentation'

    let abstract, assessments;

    if (type === "ePoster Presentation") {
      abstract = await Eposter.findOne({ abstractNo });
      if (!abstract)
        return res.status(404).json({ message: "ePoster not found" });

      assessments = await EposterAssessment.find({ abstractId: abstract._id });
    } else if (type === "Paper Presentation") {
      abstract = await PaperPresentation.findOne({ abstractNo });
      if (!abstract)
        return res
          .status(404)
          .json({ message: "Paper presentation not found" });

      assessments = await PaperPresentationAssessment.find({
        abstractId: abstract._id,
      });
    } else if (type === "Video Presentation") {
      abstract = await VideoPresentation.findOne({ abstractNo });
      if (!abstract)
        return res
          .status(404)
          .json({ message: "Video presentation not found" });

      assessments = await VideoPresentationAssessment.find({
        abstractId: abstract._id,
      });
    } else {
      return res.status(400).json({ message: "Type parameter required" });
    }

    if (assessments.length === 0) {
      return res.json({
        abstract,
        totalJudges: 0,
        averageScore: 0,
        message: "No assessments yet",
      });
    }

    // Calculate averages
    const judgeTotals = assessments.map((assessment) => {
      const scores = assessment.scores;
      return Object.values(scores).reduce((sum, score) => sum + score, 0);
    });

    const categoryTotals = assessments.reduce((acc, assessment) => {
      const scores = assessment.scores;
      Object.keys(scores).forEach((key) => {
        acc[key] = (acc[key] || 0) + scores[key];
      });
      return acc;
    }, {});

    const categoryAverages = {};
    Object.keys(categoryTotals).forEach((key) => {
      categoryAverages[key] = parseFloat(
        (categoryTotals[key] / assessments.length).toFixed(2)
      );
    });

    const totalScore = judgeTotals.reduce((sum, total) => sum + total, 0);
    const averageScore = parseFloat(
      (totalScore / assessments.length).toFixed(2)
    );

    res.json({
      success: true,
      data: {
        abstract,
        totalJudges: assessments.length,
        averageScore,
        categoryAverages,
        individualAssessments: assessments,
      },
    });
  } catch (err) {
    console.error("Single abstract results error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to calculate results for abstract",
    });
  }
};
