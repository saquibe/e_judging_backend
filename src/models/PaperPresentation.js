import mongoose from "mongoose";

const paperPresentationSchema = new mongoose.Schema({
  abstractNo: { type: String, required: true, unique: true },
  author: { type: String, required: true },
  title: { type: String, required: true },
  track: { type: String, required: true },
  hall: String,
  date: String,
  startTime: String,
  endTime: String,
});

export default mongoose.model("PaperPresentation", paperPresentationSchema);
