import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const db = new Database("zeabook.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    vibe TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post("/api/auth/signup", (req, res) => {
    const { username, password } = req.body;
    try {
      const stmt = db.prepare("INSERT INTO users (username, password) VALUES (?, ?)");
      const info = stmt.run(username, password);
      res.json({ id: info.lastInsertRowid, username });
    } catch (err: any) {
      if (err.message.includes("UNIQUE constraint failed")) {
        res.status(400).json({ error: "Username already exists" });
      } else {
        res.status(500).json({ error: "Database error" });
      }
    }
  });

  app.post("/api/auth/login", (req, res) => {
    const { username, password } = req.body;
    const stmt = db.prepare("SELECT id, username FROM users WHERE username = ? AND password = ?");
    const user = stmt.get(username, password);
    if (user) {
      res.json(user);
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });

  app.get("/api/posts", (req, res) => {
    const stmt = db.prepare(`
      SELECT posts.id, posts.content, posts.vibe, posts.created_at, users.username 
      FROM posts 
      JOIN users ON posts.user_id = users.id 
      ORDER BY posts.created_at DESC
    `);
    const posts = stmt.all();
    res.json(posts);
  });

  app.post("/api/posts", (req, res) => {
    const { userId, content, vibe } = req.body;
    const stmt = db.prepare("INSERT INTO posts (user_id, content, vibe) VALUES (?, ?, ?)");
    const info = stmt.run(userId, content, vibe);
    
    const newPostStmt = db.prepare(`
      SELECT posts.id, posts.content, posts.vibe, posts.created_at, users.username 
      FROM posts 
      JOIN users ON posts.user_id = users.id 
      WHERE posts.id = ?
    `);
    const newPost = newPostStmt.get(info.lastInsertRowid);
    res.json(newPost);
  });

  app.post("/api/ai/vibe-check", async (req, res) => {
    const { content } = req.body;
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze the vibe of this social media post in 1-3 words (e.g., "Positive & Energetic", "Melancholy", "Informative"). Post: "${content}"`,
      });
      res.json({ vibe: response.text?.trim() });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to analyze vibe" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
