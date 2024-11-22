import { Datastore, PropertyFilter } from "@google-cloud/datastore";
const datastore = new Datastore({ databaseId: "rewards-system" });
import { DatastoreParams } from "types";

async function get({ namespace, kind }: DatastoreParams) {
  try {
    const query = datastore.createQuery(namespace, kind);
    const [data] = await datastore.runQuery(query);
    if (!data.length) return null;
    return data[0];
  } catch (error) {
    if (error instanceof Error) throw new Error(error.message);
    else throw new Error("unknown error");
  }
}

async function query({ namespace, kind, filter }: DatastoreParams) {
  try {
    const query = filter
      ? datastore
          .createQuery(namespace, kind)
          .filter(
            new PropertyFilter(filter.field, filter.operator, filter.value)
          )
      : datastore.createQuery(namespace, kind);
    const [entities] = await datastore.runQuery(query);
    const entitiesWithKey = entities.map((row) => ({
      ...row,
      id: row[datastore.KEY].id,
    }));
    return entitiesWithKey;
  } catch (error) {
    if (error instanceof Error) throw new Error(error.message);
    else throw new Error("unknown error");
  }
}

async function save({ namespace, kind, id, entity }: DatastoreParams) {
  try {
    const key = datastore.key({
      namespace,
      path: id ? [kind, id] : [kind],
    });
    if (id) {
      const [existingData] = await datastore.get(key);
      const finalData = existingData ? { ...existingData, ...entity } : entity;
      const data = { key, data: finalData };
      await datastore.save(data);
      return id;
    } else {
      const data = {
        key,
        data: entity,
      };
      await datastore.save(data);
      return key.id || key.name;
    }
  } catch (error) {
    if (error instanceof Error) throw new Error(error.message);
    else throw new Error("unknown error");
  }
}

async function remove({
  namespace,
  kind,
  id,
}: {
  namespace: string;
  kind: string;
  id: number;
}) {
  try {
    const key = datastore.key({
      namespace,
      path: [kind, id],
    });
    await datastore.delete(key);
  } catch (error) {
    if (error instanceof Error) throw new Error(error.message);
    else throw new Error("unknown error");
  }
}

export default {
  get,
  save,
  query,
  remove,
};
