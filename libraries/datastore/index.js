// Imports the Google Cloud client library
const { Datastore, PropertyFilter } = require("@google-cloud/datastore");

// Creates a client
const datastore = new Datastore({ databaseId: "rewards-system" });

async function get({ namespace, kind, fieldName, value }) {
  try {
    const query =
      fieldName && value
        ? datastore.createQuery(namespace, kind).filter(new PropertyFilter(fieldName, "=", value))
        : datastore.createQuery(namespace, kind);
    const [entities] = await datastore.runQuery(query);
    const entitiesWithKey = entities.map((row) => ({
      ...row,
      id: row[datastore.KEY].id,
    }));
    return entitiesWithKey;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function save({ namespace, kind, id, data }) {
  try {
    const key = datastore.key({
      namespace,
      path: id ? [kind, id] : [kind],
    });
    if (id) {
      const [existingData] = await datastore.get(key);
      const finalData = existingData ? { ...existingData, ...data } : data;
      const dataObj = { key, data: finalData };
      await datastore.save(dataObj);
      return id;
    } else {
      const dataObj = {
        key,
        data,
      };
      await datastore.save(dataObj);
      return key.id || key.name;
    }
  } catch (error) {
    throw new Error(error.message);
  }
}

async function del({ namespace, kind, id }) {
  try {
    const key = datastore.key({
      namespace,
      path: [kind, id],
    });
    await datastore.delete(key);
  } catch (error) {
    throw new Error(error.message);
  }
}

module.exports({
  get,
  save,
  delete: del,
});
