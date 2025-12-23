import mongoose from "mongoose";

const videoPresentationSchema = new mongoose.Schema({
  abstractNo: { type: Number, required: true, unique: true },
  author: { type: String, required: true },
  title: { type: String, required: true },
  track: { type: String, required: true },
  hall: String,
});

export default mongoose.model("VideoPresentation", videoPresentationSchema);
