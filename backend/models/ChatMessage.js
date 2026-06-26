// src/models/ChatMessage.js

import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true
    },

    sessionId: {
      type: String,
      required: true,
      index: true
    },

    role: {
      type: String,
      enum: ["user", "assistant", "system"],
      required: true,
    },

    content: {
      type: String,
      required: true,
      trim: true
    },

    metadata: {
      model: { type: String },
      tokens: { type: Number },
      responseTime: { type: Number } // optional performance tracking
    },
  },
  {
    timestamps: true,
  }
);

chatMessageSchema.index({ userId: 1, sessionId: 1, createdAt: -1 });

export default mongoose.model("ChatMessage", chatMessageSchema);