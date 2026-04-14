import type { User, Project, Signal, Session } from "@vigil/shared";

const users = new Map<string, User & { passwordHash: string }>();
const usersByEmail = new Map<string, string>();
const projects = new Map<string, Project>();
const projectsByApiKey = new Map<string, string>();
const signals: Signal[] = [];
const sessions = new Map<string, Session>();

let userCounter = 0;
let projectCounter = 0;
let signalCounter = 0;

export function createUser(email: string, name: string, passwordHash: string): User {
  const id = `usr_${++userCounter}`;
  const user = { id, email, name, passwordHash, createdAt: Date.now() };
  users.set(id, user);
  usersByEmail.set(email, id);
  return { id, email, name, createdAt: user.createdAt };
}

export function getUserByEmail(email: string): (User & { passwordHash: string }) | undefined {
  const id = usersByEmail.get(email);
  return id ? users.get(id) : undefined;
}

export function getUserById(id: string): User | undefined {
  const u = users.get(id);
  if (!u) return undefined;
  return { id: u.id, email: u.email, name: u.name, createdAt: u.createdAt };
}

export function createProject(userId: string, name: string, domain: string): Project {
  const id = `prj_${++projectCounter}`;
  const apiKey = `vgl_${randomHex(24)}`;
  const project: Project = { id, userId, name, domain, apiKey, createdAt: Date.now() };
  projects.set(id, project);
  projectsByApiKey.set(apiKey, id);
  return project;
}

export function getProjectsByUser(userId: string): Project[] {
  return Array.from(projects.values()).filter((p) => p.userId === userId).sort((a, b) => b.createdAt - a.createdAt);
}

export function getProjectById(id: string): Project | undefined {
  return projects.get(id);
}

export function getProjectByApiKey(apiKey: string): Project | undefined {
  const id = projectsByApiKey.get(apiKey);
  return id ? projects.get(id) : undefined;
}

export function addSignal(projectId: string, sessionId: string, data: Omit<Signal, "id" | "projectId" | "sessionId">): Signal {
  const id = `sig_${++signalCounter}`;
  const signal: Signal = { ...data, id, projectId, sessionId };
  signals.push(signal);

  let session = sessions.get(sessionId);
  if (!session) {
    session = { id: sessionId, projectId, url: data.url, startedAt: data.timestamp, lastSignalAt: data.timestamp, signalCount: 0 };
    sessions.set(sessionId, session);
  }
  session.lastSignalAt = data.timestamp;
  session.signalCount++;

  return signal;
}

export function getSignalsByProject(projectId: string, limit = 100): Signal[] {
  return signals.filter((s) => s.projectId === projectId).sort((a, b) => b.timestamp - a.timestamp).slice(0, limit);
}

export function getSignalsBySession(sessionId: string): Signal[] {
  return signals.filter((s) => s.sessionId === sessionId).sort((a, b) => b.timestamp - a.timestamp);
}

export function getSessionsByProject(projectId: string): Session[] {
  return Array.from(sessions.values()).filter((s) => s.projectId === projectId).sort((a, b) => b.lastSignalAt - a.lastSignalAt);
}

function randomHex(length: number): string {
  const chars = "abcdef0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}
