import mongoose from "mongoose";

const presentationAssessmentSchema = new mongoose.Schema({
    abstractId: { type: mongoose.Schema.Types.ObjectId, ref: "Presentation", required: true },
    judgeId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true },

    scores: {
        researchTopic: Number,
        methods: Number,
        results: Number,
        presentation: Number,
        qa: Number,
        negativeMarks: { type: Number, default: 0 } // optional
    },

    comments: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: Date
});

export default mongoose.model("PresentationAssessment", presentationAssessmentSchema);
