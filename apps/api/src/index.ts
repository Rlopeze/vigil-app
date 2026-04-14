import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { authRouter } from "./routes/auth.js";
import { projectsRouter } from "./routes/projects.js";
import { ingestRouter } from "./routes/ingest.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:3003" }));
app.use(express.json());

// Serve the tracker snippet as a static JS file
app.use("/t", express.static(path.join(__dirname, "../public")));

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: Date.now() });
});

// Routes
app.use("/api/auth", authRouter);
app.use("/api/projects", projectsRouter);
app.use("/api/ingest", ingestRouter);

app.listen(PORT, () => {
  console.log(`[vigil-api] running on http://localhost:${PORT}`);
});
