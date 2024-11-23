import express from "express";
import { authentication, users, rewards } from "controllers";

const router = express.Router();

router.get("/logout", authentication.logout);
router.get("/users", users.getUserProfile);

router.get("/rewards/levels/selection", rewards.getLevelSelection);
router.get("/rewards/levels", rewards.getLevels);
router.get("/rewards", rewards.getRewards);
router.post("/rewards", rewards.addReward);
router.put("/rewards", rewards.editReward);
router.delete("/rewards", rewards.deleteReward);

export default router;
