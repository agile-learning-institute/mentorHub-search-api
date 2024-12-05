import { Client } from "@elastic/elasticsearch";
import { exit } from "process";
import config from "../config/Config";

export default class ElasticIO {
    private elasticSearchClient: Client;

    constructor(clientOptions: any) {
        this.elasticSearchClient = new Client(clientOptions)
        return;
    }

    public async connect() {
        console.info("Connecting...");
        try {
            console.log("Connected", JSON.stringify(await this.elasticSearchClient.ping()));
        } catch (error) {
            console.error("Error connecting to elasticsearch database", JSON.stringify(config.getConnectionSettings()), JSON.stringify(error));
            exit(1);    // FAIL FAST
        }
    }

    public async disconnect() {
        await this.elasticSearchClient.close();
    }
    
    public async search(query: { query: any; }): Promise<any> {
        return await this.elasticSearchClient.search(query);
    }
}
