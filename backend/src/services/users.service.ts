import { formatISO } from "date-fns";
import { datastore } from "libs/gcp";
import * as jwt from "libs/auth";
import argon2 from "argon2";
import { registerData, UserDatabaseData } from "types";

export const registerUser = async ({
  username,
  email,
  password,
}: registerData) => {
  try {
    // check if user already exists in database
    const userExists = (
      await datastore.query({
        namespace: "admin",
        kind: "users",
        filter: { field: "email", operator: "=", value: email },
      })
    )[0];

    if (userExists)
      throw new Error("An account with the email address already exists.");

    // hash password
    const hashedPassword = await argon2.hash(password);

    // save user data to database
    const userDatabaseData: UserDatabaseData = {
      username: username,
      email,
      password: hashedPassword,
      created_at: formatISO(new Date()),
    };

    const userId = await datastore.save({
      namespace: "admin",
      kind: "users",
      entity: userDatabaseData,
    });

    const userData = {
      username,
      email,
      id: userId,
    };

    const accessToken = await jwt.createToken(userData);
    return accessToken;
  } catch (error) {
    console.log(error);
    if (error instanceof Error) throw new Error(error.message);
    else throw new Error("unknown error");
  }
};

export const getUserProfile = async (userId: any) => {
  try {
    const userData = await datastore.get({
      namespace: "admin",
      kind: "users",
      id: userId,
    });
    return userData;
  } catch (error) {
    console.log(error);
    if (error instanceof Error) throw new Error(error.message);
    else throw new Error("unknown error");
  }
};
