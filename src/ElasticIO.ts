import { Client } from "@elastic/elasticsearch";
import env from "../util/validateEnv";

export default class ElasticIO {

    constructor() {}

    public async Initialize() {
        try {
            const elasticsearchClient = new Client({ node: env.CONNECTION_STRING });
            console.log("Testing connection to ElasticsearchDB...");
            const ping = await elasticsearchClient.ping();
            console.log(ping);
            console.log("Elasticsearch server is reachable");
            return elasticsearchClient;
        } catch (error) {
            console.log("Error connecting to elasticsearch database");
            console.error(error);
        }
    }

    public async disconnect():Promise<void> {

    }
}