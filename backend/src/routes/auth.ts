import express from "express";
import { authentication, users } from "controllers";

const router = express.Router();

router.post("/register", users.registerUser);
router.post("/login", authentication.login);

export default router;
