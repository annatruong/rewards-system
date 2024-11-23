import { datastore } from "libs/gcp";
import * as jwt from "libs/auth";
import argon2 from "argon2";

export const login = async ({
  username,
  password,
}: {
  username: string;
  password: string;
}) => {
  try {
    const user = (
      await datastore.query({
        namespace: "admin",
        kind: "users",
        filter: {
          field: "username",
          operator: "=",
          value: username,
        },
      })
    )[0];

    console.log(user);

    if (!user)
      throw new Error(
        "Account does not exists. Please register for an account."
      );
    const matched = await argon2.verify(user.password, password);
    if (!matched) throw new Error("Incorrect password");
    const userData = {
      username: user.username,
      // email: user.email,
      id: user.id,
    };

    const accessToken = await jwt.createToken(userData);
    console.log(accessToken);
    return accessToken;
  } catch (error) {
    if (error instanceof Error) throw new Error(error.message);
    else throw new Error("unknown error");
  }
};
