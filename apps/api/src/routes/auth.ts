import { Router } from "express";
import bcrypt from "bcryptjs";
import { createUser, getUserByEmail, getUserById } from "../store.js";
import { signToken, requireAuth, type AuthRequest } from "../middleware/auth.js";

export const authRouter = Router();

authRouter.post("/signup", async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    res.status(400).json({ error: "email, password, and name are required" });
    return;
  }

  if (password.length < 6) {
    res.status(400).json({ error: "Password must be at least 6 characters" });
    return;
  }

  if (getUserByEmail(email)) {
    res.status(409).json({ error: "Email already registered" });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = createUser(email, name, passwordHash);
  const token = signToken(user.id);

  res.status(201).json({ token, user });
});

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: "email and password are required" });
    return;
  }

  const user = getUserByEmail(email);
  if (!user) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  const token = signToken(user.id);
  res.json({ token, user: { id: user.id, email: user.email, name: user.name, createdAt: user.createdAt } });
});

authRouter.get("/me", requireAuth, (req: AuthRequest, res) => {
  const user = getUserById(req.userId!);
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  res.json(user);
});
