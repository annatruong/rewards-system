import { formatISO } from "date-fns";
import { datastore } from "libs/gcp";
import * as jwt from "libs/auth";
import argon2 from "argon2";

interface registerData {
  profileName: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface UserDatabaseData {
  first_name: string;
  last_name: string;
  profile_name: string;
  email: string;
  password: string;
  created_at: string;
  id?: number | string;
}

export const registerUser = async ({
  profileName,
  firstName,
  lastName,
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
      first_name: firstName,
      last_name: lastName,
      profile_name: profileName,
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
      firstName,
      lastName,
      profileName,
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
