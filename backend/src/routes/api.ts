import express from "express";
import { authentication, users } from "controllers";

const router = express.Router();

router.get("/logout", authentication.logout);
router.get("/users", users.getUserProfile);

export default router;
