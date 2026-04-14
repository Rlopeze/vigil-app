import { Router } from "express";
import type { IngestPayload } from "@vigil/shared";
import { getProjectByApiKey, addSignal } from "../store.js";

export const ingestRouter = Router();

ingestRouter.post("/", (req, res) => {
  const apiKey = req.headers["x-api-key"] as string;

  if (!apiKey) {
    res.status(401).json({ error: "Missing x-api-key header" });
    return;
  }

  const project = getProjectByApiKey(apiKey);
  if (!project) {
    res.status(401).json({ error: "Invalid API key" });
    return;
  }

  const body = req.body as IngestPayload;

  if (!body.type || !body.sessionId) {
    res.status(400).json({ error: "type and sessionId are required" });
    return;
  }

  const signal = addSignal(project.id, body.sessionId, {
    type: body.type,
    label: body.label || body.type,
    detail: body.detail || "",
    element: body.element || "",
    url: body.url || "",
    timestamp: body.timestamp || Date.now(),
    x: body.x || 0,
    y: body.y || 0,
  });

  res.status(201).json({ id: signal.id });
});
