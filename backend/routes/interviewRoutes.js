// src/routes/interviewRoutes.js

import express from "express";
import interviewController from "../controllers/interviewController.js";
import multer from "multer";

const router = express.Router();

// Multer config
const upload = multer({ storage: multer.memoryStorage() });

// ===============================
// INTERVIEW ROUTES
// ===============================

// ✅ Upload Resume File and extract text
router.post("/upload-resume", upload.single("resume"), interviewController.uploadResume);

// ✅ Extract structured data from Resume
router.post("/extract-resume", interviewController.extractResume);

// ✅ Generate 5 interview questions based on prompt
router.post("/generate-questions", interviewController.generateQuestions);

// ✅ Submit an answer and get JSON evaluated scores
router.post("/submit-answer", interviewController.submitAnswer);

// ✅ Analyze a resume for ATS score and feedback
router.post("/analyze-resume", interviewController.analyzeResume);

// ✅ Generate Quiz
router.post("/generate-quiz", interviewController.generateQuiz);

// ✅ Save Interview Session History
router.post("/save-history", interviewController.saveHistory);

// ✅ Get Interview History for a User
router.get("/history/:userId", interviewController.getHistory);

// ✅ Delete Interview History for a User
router.delete("/history/:id", interviewController.deleteHistory);

export default router;