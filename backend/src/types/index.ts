export type UserData = {
  firstName: string;
  lastName: string;
  profileName: string;
  email: string;
  id?: number | string;
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
