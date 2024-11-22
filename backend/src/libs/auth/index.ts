import { sign } from "jsonwebtoken";
import { UserData } from "types";
import { secrets } from "libs/gcp";

async function createToken(userData: UserData) {
  try {
    const jwtSecret = await secrets.get("jwt-secret");

    if (!jwtSecret) {
      throw new Error("missing auth required parameter");
    }

    const accessToken = sign({ userData }, jwtSecret, { expiresIn: "30d" });
    return accessToken;
  } catch (error) {
    console.log(error);
    if (error instanceof Error) throw new Error(error.message);
    else throw new Error("unknown error");
  }
}

export { createToken };
