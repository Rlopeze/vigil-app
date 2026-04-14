import { Router } from "express";
import { requireAuth, type AuthRequest } from "../middleware/auth.js";
import { createProject, getProjectsByUser, getProjectById, getSignalsByProject, getSessionsByProject } from "../store.js";

export const projectsRouter = Router();

projectsRouter.use(requireAuth);

projectsRouter.post("/", (req: AuthRequest, res) => {
  const { name, domain } = req.body;

  if (!name || !domain) {
    res.status(400).json({ error: "name and domain are required" });
    return;
  }

  const project = createProject(req.userId!, name, domain);
  res.status(201).json(project);
});

projectsRouter.get("/", (req: AuthRequest, res) => {
  const projects = getProjectsByUser(req.userId!);
  res.json(projects);
});

projectsRouter.get("/:id", (req: AuthRequest, res) => {
  const project = getProjectById(req.params.id as string);
  if (!project || project.userId !== req.userId!) {
    res.status(404).json({ error: "Project not found" });
    return;
  }
  res.json(project);
});

projectsRouter.get("/:id/signals", (req: AuthRequest, res) => {
  const project = getProjectById(req.params.id as string);
  if (!project || project.userId !== req.userId!) {
    res.status(404).json({ error: "Project not found" });
    return;
  }

  const limit = parseInt(req.query.limit as string) || 100;
  res.json(getSignalsByProject(project.id, limit));
});

projectsRouter.get("/:id/sessions", (req: AuthRequest, res) => {
  const project = getProjectById(req.params.id as string);
  if (!project || project.userId !== req.userId!) {
    res.status(404).json({ error: "Project not found" });
    return;
  }

  res.json(getSessionsByProject(project.id));
});
