import Presentation from "../models/Presentation.js";
import PresentationAssessment from "../models/PresentationAssessment.js";

// GET single presentation with assessment
export const getSinglePresentation = async (req, res) => {
    try {
        const { abstractNo } = req.params;

        const pres = await Presentation.findOne({ abstractNo });
        if (!pres) return res.status(404).json({ message: "Presentation not found" });

        const assessment = await PresentationAssessment.findOne({ abstractId: pres._id })
            .populate("judgeId", "email");

        res.json({
            ...pres.toObject(),
            isJudged: Boolean(assessment),
            assessment: assessment || null
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching presentation" });
    }
};


// SUBMIT presentation assessment
export const submitPresentationAssessment = async (req, res) => {
    try {
        const { abstractNo, scores, comments } = req.body;
        const judgeId = req.admin._id;

        const pres = await Presentation.findOne({ abstractNo });
        if (!pres) return res.status(404).json({ message: "Presentation not found" });

        // Prevent multiple assessments
        const exists = await PresentationAssessment.findOne({ abstractId: pres._id });
        if (exists) {
            return res.status(400).json({ message: "Assessment already exists. Use update." });
        }

        const assessment = await PresentationAssessment.create({
            abstractId: pres._id,
            judgeId,
            scores,
            comments
        });

        res.json({
            message: "Assessment submitted successfully",
            assessment
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to submit assessment" });
    }
};


// UPDATE assessment
export const updatePresentationAssessment = async (req, res) => {
    try {
        const { abstractNo } = req.params;
        const { scores, comments } = req.body;

        const pres = await Presentation.findOne({ abstractNo });
        if (!pres) return res.status(404).json({ message: "Presentation not found" });

        const updated = await PresentationAssessment.findOneAndUpdate(
            { abstractId: pres._id },
            { scores, comments, updatedAt: new Date() },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ message: "Assessment not found" });
        }

        res.json({
            message: "Assessment updated successfully",
            assessment: updated
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to update assessment" });
    }
};
