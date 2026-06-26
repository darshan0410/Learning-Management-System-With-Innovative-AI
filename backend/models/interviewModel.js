import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  feedback: { type: String, required: true },
  confidence: { type: Number },
  communication: { type: Number },
  correctness: { type: Number },
  finalScore: { type: Number }
});

const interviewHistorySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    role: { type: String },
    experience: { type: String },
    difficulty: { type: String },
    feedbackList: [feedbackSchema],
    avgScore: { type: String },
    cheatWarnings: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model("InterviewHistory", interviewHistorySchema);
