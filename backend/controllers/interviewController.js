// src/controllers/interviewController.js

import interviewService from "../services/interviewService.js";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import InterviewHistory from "../models/interviewModel.js";

// ✅ PDF Extract Function
async function extractPDF(buffer) {
  // Convert Buffer -> Uint8Array
  const data = new Uint8Array(buffer);

  const pdf = await pdfjsLib.getDocument({
    data,
  }).promise;

  let text = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();

    const strings = content.items
      .map((item) => item.str)
      .filter(Boolean);

    text += strings.join(" ") + "\n";
  }

  return text.trim();
}

class InterviewController {
  // ✅ Upload Resume
  async uploadResume(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: "No file uploaded",
        });
      }

      const dataBuffer = req.file.buffer;
      let text = "";

      if (req.file.mimetype === "application/pdf") {
        text = await extractPDF(dataBuffer);
      } else {
        text = dataBuffer.toString("utf8");
      }

      res.status(200).json({
        success: true,
        text,
      });
    } catch (err) {
      console.error("Upload Resume Error:", err);

      res.status(500).json({
        success: false,
        error: err.message,
      });
    }
  }

  // ✅ Extract Resume Data using AI
  async extractResume(req, res) {
    try {
      const { resumeText } = req.body;

      if (!resumeText) {
        return res.status(400).json({
          success: false,
          error: "Resume text required",
        });
      }

      const messages = [
        {
          role: "system",
          content: `
Extract structured data from resume.

Return strictly JSON:

{
  "role": "string",
  "experience": "string",
  "projects": ["project1", "project2"],
  "skills": ["skill1", "skill2"]
}
`,
        },
        {
          role: "user",
          content: resumeText,
        },
      ];

      const aiResponse = await interviewService.chat(messages, true);

      if (!aiResponse.success) {
        return res.status(500).json(aiResponse);
      }

      const parsed = JSON.parse(aiResponse.message);

      res.json({
        success: true,
        data: parsed,
      });
    } catch (err) {
      console.error("Extract Resume Error:", err);

      res.status(500).json({
        success: false,
        error: err.message,
      });
    }
  }

  // ✅ Generate Questions
  async generateQuestions(req, res) {
    try {
      const {
        role,
        experience,
        mode,
        projectText,
        skillsText,
        safeResume,
      } = req.body;

      const userPrompt = `
Role: ${role || "Software Engineer"}
Experience: ${experience || "2 years"}
Interview Mode: ${mode || "Technical"}
Projects: ${projectText || "None"}
Skills: ${skillsText || "JavaScript, React, Node.js"}
Resume: ${safeResume || "Not provided"}
`;

      const messages = [
        {
          role: "system",
          content: `
You are a real human interviewer conducting a professional interview.

Generate exactly 5 interview questions.

Rules:
- 15 to 25 words each
- One question per line
- No numbering
- No explanation
`,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ];

      const aiResponse = await interviewService.chat(messages, false);

      if (!aiResponse.success) {
        return res.status(500).json(aiResponse);
      }

      const questions = aiResponse.message
        .split("\n")
        .map((q) => q.trim())
        .filter(Boolean);

      res.json({
        success: true,
        questions,
      });
    } catch (err) {
      console.error("Generate Questions Error:", err);

      res.status(500).json({
        success: false,
        error: err.message,
      });
    }
  }

  // ✅ Submit Answer
  async submitAnswer(req, res) {
    try {
      const { question, answer } = req.body;

      if (!question || !answer) {
        return res.status(400).json({
          success: false,
          error: "Question and answer required",
        });
      }

      const messages = [
        {
          role: "system",
          content: `
Evaluate answer and return JSON:

{
  "confidence": number,
  "communication": number,
  "correctness": number,
  "finalScore": number,
  "feedback": "short feedback"
}
`,
        },
        {
          role: "user",
          content: `Question: ${question}\nAnswer: ${answer}`,
        },
      ];

      const aiResponse = await interviewService.chat(messages, true);

      if (!aiResponse.success) {
        return res.status(500).json(aiResponse);
      }

      const parsed = JSON.parse(aiResponse.message);

      res.json({
        success: true,
        data: parsed,
      });
    } catch (err) {
      console.error("Submit Answer Error:", err);

      res.status(500).json({
        success: false,
        error: err.message,
      });
    }
  }

  // ✅ Analyze Resume for ATS
  async analyzeResume(req, res) {
    try {
      const { resumeText, targetRole } = req.body;

      if (!resumeText) {
        return res.status(400).json({
          success: false,
          error: "Resume text required",
        });
      }

      const roleContext = targetRole ? `The candidate is specifically applying for a ${targetRole} role. Evaluate ATS matching based on this role.` : `Evaluate this resume as a general professional resume.`;

      const messages = [
        {
          role: "system",
          content: `
You are an elite Silicon Valley recruiter and an advanced ATS (Applicant Tracking System) algorithm.
Analyze the provided resume deeply. ${roleContext}

Return purely and strictly a single JSON object. No markdown formatting, no comments, just valid JSON.
Use this exact schema:

{
  "overallScore": number (out of 100),
  "summary": "High-level professional executive summary of the resume's quality",
  "categoryScores": {
    "impact": number (out of 100, evaluates action verbs and quantified results),
    "skills": number (out of 100, relevance and depth of skills),
    "formatting": number (out of 100, inferred structure, section clarity),
    "communication": number (out of 100, clarity, brevity, lack of grammar issues)
  },
  "strengths": [
    "Specific string explaining a strength",
    "Specific string explaining a strength"
  ],
  "criticalImprovements": [
    {
      "issue": "String stating what is wrong",
      "suggestion": "String stating how to fix it"
    }
  ],
  "missingKeywords": ["string", "string"],
  "formatFeedback": "Feedback on how the sections are organized (or missing sections like Education or Projects).",
  "actionVerbsAdvice": "Feedback on their use of strong action verbs.",
  "grammarAndTypos": ["List of potential grammar issues or simply 'No major issues detected'"]
}
`,
        },
        {
          role: "user",
          content: `Here is the parsed resume text:\n\n${resumeText}`,
        },
      ];

      const aiResponse = await interviewService.chat(messages, true);

      if (!aiResponse.success) {
        return res.status(500).json(aiResponse);
      }

      const parsed = JSON.parse(aiResponse.message);

      res.json({
        success: true,
        data: parsed,
      });
    } catch (err) {
      console.error("Analyze Resume Error:", err);
      res.status(500).json({
        success: false,
        error: err.message,
      });
    }
  }

  // ✅ Generate AI Quiz
  async generateQuiz(req, res) {
    try {
      const { topic, difficulty = "Medium", numQuestions = 5 } = req.body;

      if (!topic) {
        return res.status(400).json({ success: false, error: "Topic is required" });
      }

      const messages = [
        {
          role: "system",
          content: `
You are an expert educational AI. 
Generate a multiple-choice quiz about the given topic.
Strictly return a JSON array containing ${numQuestions} question objects.
No markdown, no outside text, exactly valid JSON.

Schema per object:
{
  "question": "string",
  "options": ["string", "string", "string", "string"],
  "correctAnswer": "string (must match one option exactly)",
  "explanation": "string explaining why it is correct"
}
`,
        },
        {
          role: "user",
          content: `Topic: ${topic}\nDifficulty: ${difficulty}\nNumber of Questions: ${numQuestions}`,
        },
      ];

      const aiResponse = await interviewService.chat(messages, true);

      if (!aiResponse.success) {
        return res.status(500).json(aiResponse);
      }

      const parsed = JSON.parse(aiResponse.message);

      res.json({
        success: true,
        data: parsed,
      });
    } catch (err) {
      console.error("Generate Quiz Error:", err);
      res.status(500).json({
        success: false,
        error: err.message,
      });
    }
  }
  // ✅ Save Interview History
  async saveHistory(req, res) {
    try {
      const { userId, role, experience, difficulty, feedbackList, avgScore, cheatWarnings } = req.body;

      if (!userId) {
        return res.status(400).json({ success: false, error: "User ID is required" });
      }

      const history = new InterviewHistory({
        userId,
        role,
        experience,
        difficulty,
        feedbackList,
        avgScore,
        cheatWarnings
      });

      await history.save();

      res.status(201).json({ success: true, data: history });
    } catch (err) {
      console.error("Save History Error:", err);
      res.status(500).json({ success: false, error: err.message });
    }
  }

  // ✅ Get Interview History
  async getHistory(req, res) {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({ success: false, error: "User ID is required" });
      }

      const history = await InterviewHistory.find({ userId }).sort({ createdAt: -1 }).limit(20);

      res.status(200).json({ success: true, data: history });
    } catch (err) {
      console.error("Get History Error:", err);
      res.status(500).json({ success: false, error: err.message });
    }
  }
  // ✅ Delete Interview History
  async deleteHistory(req, res) {
    try {
      const { id } = req.params;
      await InterviewHistory.findByIdAndDelete(id);
      res.json({ success: true });
    } catch (err) {
      console.error("Delete History Error:", err);
      res.status(500).json({ success: false, error: err.message });
    }
  }
}

export default new InterviewController();