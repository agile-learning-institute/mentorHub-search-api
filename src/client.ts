import { Client } from "@opensearch-project/opensearch";
import env from "../util/validateEnv";

export const OpensearchClient = new Client({ node: env.CONNECTION_STRING });

export async function Initialize(opensearchClient: Client)
{
    try {
        console.log("Testing connection to OpensearchDB...");
        await opensearchClient.ping();
        console.log("Opensearch server is reachable");
    } catch (error) {
        console.log("Error connecting to opensearch database");
        console.error(error);
    }
}