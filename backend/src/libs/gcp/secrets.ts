import { SecretManagerServiceClient } from "@google-cloud/secret-manager";
const projectId = process.env.PROJECTID;

// Instantiates a client
const client = new SecretManagerServiceClient();

const get = async (id: string) => {
  const name = `projects/${projectId}/secrets/${id}/versions/latest`;
  try {
    const [accessResponse] = await client.accessSecretVersion({ name });
    const responsePayload = accessResponse?.payload?.data?.toString();
    if (!responsePayload) throw new Error("Secret not found");
    return responsePayload;
  } catch (error) {
    if (error instanceof Error) throw new Error(error.message);
    else throw new Error("unknown error");
  }
};

export default {
  get,
};
