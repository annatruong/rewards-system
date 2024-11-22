import { Request, Response, NextFunction } from "express";
import { verify, JwtPayload } from "jsonwebtoken";
import { UserData } from "../types";
import { secrets } from "libs/gcp";

interface IJwtPayload extends JwtPayload {
  userData: UserData;
}

export async function checkAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const accessToken = req.cookies["access_token"];
    if (!accessToken) throw new Error("No access token found");

    const jwtSecret = await secrets.get("jwt-secret");

    if (!jwtSecret) {
      throw new Error("missing auth required parameter");
    }

    const validToken = verify(accessToken, jwtSecret) as IJwtPayload;
    if (!validToken) throw new Error("Invalid access token");

    req.user = validToken.userData;
    return next();
  } catch (error) {
    if (error instanceof Error) {
      res.status(401).send(error.message);
    } else {
      res.status(500).send("Unknown error");
    }
  }
}
