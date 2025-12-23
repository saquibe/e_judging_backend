import mongoose from "mongoose";

const paperPresentationAssessmentSchema = new mongoose.Schema({
  abstractId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PaperPresentation",
    required: true,
  },
  judgeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: true,
  },
  scores: {
    evidenceLevel: { type: Number, min: 0, max: 5 },
    researchLogic: { type: Number, min: 0, max: 5 },
    audiovisualMaterial: { type: Number, min: 0, max: 5 },
    setInduction: { type: Number, min: 0, max: 5 },
    presentationContent: { type: Number, min: 0, max: 5 },
    presentationStyle: { type: Number, min: 0, max: 5 },
    punctuality: { type: Number, min: 0, max: 5 },
    conclusionAbility: { type: Number, min: 0, max: 5 },
    attitude: { type: Number, min: 0, max: 5 },
    interjectionAbility: { type: Number, min: 0, max: 5 },
  },
  comments: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date,
});

// One admin can judge a paper presentation only once
paperPresentationAssessmentSchema.index(
  { abstractId: 1, judgeId: 1 },
  { unique: true }
);

export default mongoose.model(
  "PaperPresentationAssessment",
  paperPresentationAssessmentSchema
);
