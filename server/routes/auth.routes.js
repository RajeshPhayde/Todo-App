import express from "express";
import { login, reset, signUp } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signUp);

router.post("/login", login);

router.patch("/reset", reset);

export default router;
