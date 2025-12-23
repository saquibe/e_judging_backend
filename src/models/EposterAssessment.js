import mongoose from "mongoose";

const eposterAssessmentSchema = new mongoose.Schema({
  abstractId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Eposter",
    required: true,
  },
  judgeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: true,
  },
  scores: {
    originalityOfWork: { type: Number, min: 0, max: 5 },
    aestheticsOfDisplay: { type: Number, min: 0, max: 5 },
    clarityOfDisplay: { type: Number, min: 0, max: 5 },
    clarityOfPresentation: { type: Number, min: 0, max: 5 },
    scientificMethodology: { type: Number, min: 0, max: 5 },
    experimentalDesign: { type: Number, min: 0, max: 5 },
    contributionToKnowledge: { type: Number, min: 0, max: 5 },
    knowledgeContent: { type: Number, min: 0, max: 5 },
    abilityToFaceInterjections: { type: Number, min: 0, max: 5 },
    timeManagement: { type: Number, min: 0, max: 5 },
  },
  comments: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date,
});

// One admin can judge a poster only once
eposterAssessmentSchema.index({ abstractId: 1, judgeId: 1 }, { unique: true });

export default mongoose.model("EposterAssessment", eposterAssessmentSchema);
