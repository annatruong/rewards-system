import { Request, Response } from "express";
import { authentication } from "services";

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    if (!password || !username) {
      res.status(400).send("Please enter your email and password to login");
    }

    // create token
    const accessToken = await authentication.login({ username, password });

    // set token in cookie
    res.cookie("access_token", accessToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: true,
    });

    res.send("Login successful!");
  } catch (error) {
    if (error instanceof Error) {
      res.status(401).send(error.message);
    } else {
      res.status(500).send("Unknown error");
    }
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("access_token");
    res.send("Logout successful");
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    } else {
      res.status(500).send("Unknown error");
    }
  }
};
