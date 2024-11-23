import { formatISO } from "date-fns";
import { datastore } from "libs/gcp";
import { rewardData } from "types";

export const getLevelSelection = async () => {
  try {
    return ["Big", "Medium", "Small", "Random"];
  } catch (error) {
    console.log(error);
    if (error instanceof Error) throw new Error(error.message);
    else throw new Error("unknown error");
  }
};

export const getLevels = async () => {
  try {
    return ["Big", "Medium", "Small"];
  } catch (error) {
    console.log(error);
    if (error instanceof Error) throw new Error(error.message);
    else throw new Error("unknown error");
  }
};

export const getRewards = async (userId: string) => {
  try {
    const rewards = await datastore.query({
      namespace: "goals",
      kind: "rewards",
      filter: { field: "user_id", operator: "=", value: parseInt(userId) },
    });
    return rewards;
  } catch (error) {
    console.log(error);
    if (error instanceof Error) throw new Error(error.message);
    else throw new Error("unknown error");
  }
};

export const addReward = async ({
  userId,
  reward,
}: {
  userId: string;
  reward: rewardData;
}) => {
  try {
    reward.created_at = formatISO(new Date());
    reward.user_id = parseInt(userId);

    const id = await datastore.save({
      namespace: "goals",
      kind: "rewards",
      entity: reward,
    });

    return id;
  } catch (error) {
    console.log(error);
    if (error instanceof Error) throw new Error(error.message);
    else throw new Error("unknown error");
  }
};

export const editReward = async ({
  id,
  reward,
}: {
  id: string;
  reward: rewardData;
}) => {
  try {
    const resultId = await datastore.save({
      namespace: "goals",
      kind: "rewards",
      id: parseInt(id),
      entity: reward,
    });

    return resultId;
  } catch (error) {
    console.log(error);
    if (error instanceof Error) throw new Error(error.message);
    else throw new Error("unknown error");
  }
};

export const deleteReward = async (id: string) => {
  try {
    const resultId = await datastore.remove({
      namespace: "goals",
      kind: "rewards",
      id: parseInt(id),
    });

    return resultId;
  } catch (error) {
    console.log(error);
    if (error instanceof Error) throw new Error(error.message);
    else throw new Error("unknown error");
  }
};
