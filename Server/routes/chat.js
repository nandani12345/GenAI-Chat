import express from "express";
import fs from "fs";
import path from "path";
import { sanitize } from "../utils/sanitize.js";
import { baseSystem } from "../prompts/system.js"; // import baseSystem

const router = express.Router();
const promptsDir = path.join(process.cwd(), "prompts");

// Build prompt based on persona, user message, and response type
function buildPrompt(
  personaData,
  userMsg,
  responseType = "text",
  language = "javascript"
) {
  let typeInstruction = "";

  if (responseType === "code") {
    typeInstruction = `
Provide ONLY the code as a code block.
Use the requested language: ${language}.
Use proper formatting, indentation, and comments for readability.
Do NOT add explanations or extra text.
`;
  } else {
    typeInstruction = "Provide a concise, clear text response.";
  }

  return `${baseSystem}
Name: ${personaData.name}
Style: ${personaData.style}
Diction hints: ${personaData.diction.join(", ")}
Do: ${personaData.dos.join(", ")}
Don't: ${personaData.donts.join(", ")}

Response type: ${responseType}
Instruction: ${typeInstruction}

User: ${userMsg}

Persona Response:`;
}

router.post("/", async (req, res) => {
  try {
    const { persona, message, responseType, language } = req.body || {};

    // Validate persona
    if (!["hitesh", "piyush"].includes(persona)) {
      return res.status(400).json({ error: "Invalid persona" });
    }

    // Validate message
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required" });
    }

    // Load persona JSON
    const personaPath = path.join(promptsDir, `${persona}.json`);
    if (!fs.existsSync(personaPath)) {
      return res.status(404).json({ error: "Persona file not found" });
    }
    const personaJson = JSON.parse(fs.readFileSync(personaPath, "utf-8"));

    // Build prompt
    const prompt = buildPrompt(
      personaJson,
      sanitize(message),
      responseType || "text",
      language || "javascript"
    );

    // Call Gemini API
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
    const resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    });

    const data = await resp.json();

    if (!resp.ok) {
      return res.status(500).json({ error: "Gemini API error", details: data });
    }

    // Extract and clean AI reply
    const reply = (
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, mujhe response nahi mila."
    ).trim();

    res.json({ reply });
  } catch (err) {
    console.error("Chat route error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
