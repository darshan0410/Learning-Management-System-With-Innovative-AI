// src/controllers/chatController.js

import ChatMessage from "../models/ChatMessage.js";
import groqService from "../services/groqService.js";
import Course from "../models/courseModel.js";

class ChatController {

  // ===============================
  // SEND MESSAGE
  // ===============================
  async sendMessage(req, res) {
    try {
      const { message, userId, sessionId } = req.body;

      // Validation
      if (!message || !userId || !sessionId) {
        return res.status(400).json({
          success: false,
          error: "message, userId and sessionId are required"
        });
      }

      // Save user message
      await ChatMessage.create({
        userId,
        sessionId,
        role: "user",
        content: message
      });

      // Get last 10 messages
      const recentMessages = await ChatMessage.find({ userId, sessionId })
        .sort({ createdAt: -1 })
        .limit(10)
        .lean();

      const conversationHistory = recentMessages
        .reverse()
        .map(msg => ({
          role: msg.role,
          content: msg.content
        }));

      // Fetch Course Data to inject into Prompt
      const courses = await Course.find({ isPublished: true }).populate("creator", "name");
      const courseContext = courses.map(c => `ID: ${c._id}\nTitle: ${c.title}\nPrice: ₹${c.price || 0}\nLevel: ${c.level || 'All Levels'}\nAuthor: ${c.creator?.name || 'Admin'}\nDescription: ${c.description || c.subTitle || 'A great course.'}`).join('\n\n');

// System Prompt
      const systemPrompt = `
You are an AI Tutor for our e-learning platform. Your goal is to guide students, recommend courses, and assist with their queries.

AVAILABLE COURSES IN DATABASE:
${courseContext ? courseContext : "No published courses available currently."}

STRICT RULE FOR RECOMMENDING COURSES:
1. You MUST ONLY recommend courses that are currently listed in the 'AVAILABLE COURSES IN DATABASE' section above. 
2. NEVER mention or recommend courses from previous conversation history if they are no longer in the AVAILABLE list (they may have been deleted by the admin).
3. When you recommend any course from the available list, you MUST output them in the EXACT following text format so our UI can render them as cards. Do not deviate from this syntax:

1. [Course Title]
- Price: ₹[Price]
- Author: [Author]
- Level: [Level]
- Description: [Short Description]
- Link: /viewcourse/[ID]

If recommending multiple courses, just increment the number.
For general chat and questions, just reply naturally using text and bullet points.

CRITICAL FORMATTING RULES:
- NEVER generate Mermaid.js diagrams or flowcharts (e.g., \`\`\`mermaid).
- NEVER generate or embed Markdown images (e.g., ![alt](url)).
- If there are no courses, simply apologize in plain text. Do NOT use diagrams or images to express this.
`;

      // Call AI Service
      const aiResponse = await groqService.chat([
        { role: "system", content: systemPrompt },
        ...conversationHistory
      ]);

      if (!aiResponse || !aiResponse.success) {
        return res.status(500).json({
          success: false,
          error: aiResponse?.error || "AI response failed"
        });
      }

      const aiMessage = aiResponse.message;

      // Save AI response
      await ChatMessage.create({
        userId,
        sessionId,
        role: "assistant",
        content: aiMessage,
        metadata: {
          model: aiResponse.model || "unknown"
        }
      });

      return res.json({
        success: true,
        data: {
          assistantMessage: {
            content: aiMessage
          }
        }
      });

    } catch (error) {
      console.error("Chat Controller Error:", error);

      return res.status(500).json({
        success: false,
        error: "Internal server error"
      });
    }
  }

  // ===============================
  // GET HISTORY
  // ===============================
  async getHistory(req, res) {
    try {
      const { userId, sessionId } = req.params;
      const limit = parseInt(req.query.limit) || 50;

      const query = { userId };

      if (sessionId) {
        query.sessionId = sessionId;
      }

      const messages = await ChatMessage.find(query)
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();

      return res.json({
        success: true,
        data: messages.reverse()
      });

    } catch (error) {
      console.error("Get History Error:", error);

      return res.status(500).json({
        success: false,
        error: "Failed to fetch chat history"
      });
    }
  }

  // ===============================
  // DELETE SESSION
  // ===============================
  async deleteSession(req, res) {
    try {
      const { userId, sessionId } = req.params;

      await ChatMessage.deleteMany({ userId, sessionId });

      return res.json({
        success: true,
        message: "Session deleted successfully"
      });

    } catch (error) {
      console.error("Delete Session Error:", error);

      return res.status(500).json({
        success: false,
        error: "Failed to delete session"
      });
    }
  }
}

export default new ChatController();