import { Client } from "@opensearch-project/opensearch";
import env from "../util/validateEnv";

const host: string = env.HOST;
const opensearchPort = env.OPENSEARCH_PORT;
const protocol: string = env.PROTOCOL;
const auth: string = env.AUTH;
export const OpensearchClient = new Client({ node: protocol + "://" + auth + "@" + host + ":" + opensearchPort });

export async function Initialize(opensearchClient: Client)
{
    try {
        console.log("Testing connection to OpensearchDB...");
        await opensearchClient.ping();
    } catch (error) {
        console.log("Error connecting to opensearch database");
        console.error(error);
    }
}