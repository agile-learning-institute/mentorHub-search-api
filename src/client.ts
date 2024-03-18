import { Client } from "@opensearch-project/opensearch";
import { CONNECTION_STRING } from "../util/validateEnv";

export const OpensearchClient = new Client({ node: CONNECTION_STRING });

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