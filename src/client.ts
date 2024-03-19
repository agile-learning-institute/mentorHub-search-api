import { Client } from "@opensearch-project/opensearch";
import env from "../util/validateEnv";

export async function Initialize()
{
    try {
        const opensearchClient = new Client({ node: env.CONNECTION_STRING });
        console.log("Testing connection to OpensearchDB...");
        await opensearchClient.ping();
        console.log("Opensearch server is reachable");
        return opensearchClient;
    } catch (error) {
        console.log("Error connecting to opensearch database");
        console.error(error);
    }
}