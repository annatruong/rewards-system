import { Request, Response } from "express";
import { users } from "services";

export const registerUser = async (req: Request, res: Response) => {
  const { profileName, firstName, lastName, email, password, confirmPassword } =
    req.body;
  if (password !== confirmPassword) {
    res.status(400).send("Passwords do not match");
  }
  try {
    // create token
    const accessToken = await users.registerUser({
      profileName,
      firstName,
      lastName,
      email,
      password,
    });

    // set token in cookie
    res.cookie("access_token", accessToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: true,
    });

    res.send("Registration successful!");
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    } else {
      res.status(500).send("Unknown error");
    }
  }
};

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    if (!userId) throw new Error("Missing required parameter");
    const userData = await users.getUserProfile(userId);
    res.send(userData);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    } else {
      res.status(500).send("Unknown error");
    }
  }
};
