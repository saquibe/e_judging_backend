import mongoose from "mongoose";

const videoPresentationAssessmentSchema = new mongoose.Schema({
  abstractId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "VideoPresentation",
    required: true,
  },
  judgeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: true,
  },
  scores: {
    scientificImportance: { type: Number, enum: [0, 5, 10, 15, 20] },
    originality: { type: Number, enum: [0, 5, 10, 15, 20] },
    researchLogic: { type: Number, enum: [0, 5, 10, 15, 20] },
    solutionAppropriateness: { type: Number, enum: [0, 5, 10, 15, 20] },
    audienceEngagement: { type: Number, enum: [0, 5, 10, 15, 20] },
    conclusionAbility: { type: Number, enum: [0, 5, 10, 15, 20] },
    attitude: { type: Number, enum: [0, 5, 10, 15, 20] },
    interjectionAbility: { type: Number, enum: [0, 5, 10, 15, 20] },
    productionQuality: { type: Number, enum: [0, 5, 10, 15, 20] },
    timeManagement: { type: Number, enum: [0, 5, 10, 15, 20] },
  },
  comments: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date,
});

// One admin can judge a video presentation only once
videoPresentationAssessmentSchema.index(
  { abstractId: 1, judgeId: 1 },
  { unique: true }
);

export default mongoose.model(
  "VideoPresentationAssessment",
  videoPresentationAssessmentSchema
);
