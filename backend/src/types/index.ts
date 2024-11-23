export type registerData = {
  username: string;
  email: string;
  password: string;
};

export type UserDatabaseData = {
  username: string;
  email: string;
  password: string;
  created_at: string;
  id?: number | string;
};

export type UserData = {
  username: string;
  id?: number | string;
};
export type rewardData = {
  name: string;
  level: string;
  created_at?: string;
  user_id?: number;
};

interface Filter {
  field: string;
  operator: "=" | "<" | "<=" | ">" | ">=";
  value: any;
}

export type DatastoreParams = {
  namespace: string;
  kind: string;
  id?: string | number;
  filter?: Filter;
  entity?: object;
};
