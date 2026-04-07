import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";
import { initializeApp, cert, getApp, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Firebase Admin
const setupFirebaseAdmin = () => {
  if (getApps().length > 0) return getFirestore();

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (projectId && clientEmail && privateKey) {
    initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
    return getFirestore();
  }
  
  // Fallback or warning if admin is not configured
  console.warn("Firebase Admin not fully configured. AI bindings will be stored via client SDK if possible, or fail.");
  return null;
};

const adminDb = setupFirebaseAdmin();

// API Routes
app.post("/api/ai/unified", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  const results: any = {
    timestamp: new Date(),
    prompt,
    gemini: "",
    openai: "",
  };

  // 1. Google Gemini
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    results.gemini = response.text || "No response from Gemini";
  } catch (err: any) {
    results.gemini = `Error: ${err.message}`;
  }

  // 2. OpenAI
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || "",
    });
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });
    results.openai = completion.choices[0].message.content || "No response from OpenAI";
  } catch (err: any) {
    results.openai = `Error: ${err.message}`;
  }

  // 3. Store in Firestore (if admin is configured)
  if (adminDb) {
    try {
      await adminDb.collection("ai_bindings").add(results);
      console.log("Saved results to Firestore via Admin SDK");
    } catch (err) {
      console.error("Failed to save to Firestore via Admin SDK:", err);
    }
  }

  res.json(results);
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
