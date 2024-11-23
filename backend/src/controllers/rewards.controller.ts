import { Request, Response } from "express";
import { rewards } from "services";

export const getLevelSelection = async (req: Request, res: Response) => {
  try {
    const levelSelection = await rewards.getLevelSelection();
    res.send(levelSelection);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    } else {
      res.status(500).send("Unknown error");
    }
  }
};

export const getLevels = async (req: Request, res: Response) => {
  try {
    const levels = await rewards.getLevels();
    res.send(levels);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    } else {
      res.status(500).send("Unknown error");
    }
  }
};

export const getRewards = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const rewardsData = await rewards.getRewards(userId);
    res.send(rewardsData);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    } else {
      res.status(500).send("Unknown error");
    }
  }
};

export const addReward = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const { reward } = req.body;
    const rewardId = await rewards.addReward({ userId, reward });
    res.send(rewardId);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    } else {
      res.status(500).send("Unknown error");
    }
  }
};

export const editReward = async (req: Request, res: Response) => {
  try {
    const { reward, id } = req.body;
    const rewardId = await rewards.editReward({ id, reward });
    res.send(rewardId);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    } else {
      res.status(500).send("Unknown error");
    }
  }
};

export const deleteReward = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const results = await rewards.deleteReward(id);
    res.send(results);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    } else {
      res.status(500).send("Unknown error");
    }
  }
};
