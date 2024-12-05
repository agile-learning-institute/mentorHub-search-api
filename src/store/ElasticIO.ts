import { Client } from "@elastic/elasticsearch";
import { exit } from "process";
import config from "../config/Config";
import IndexCard from "../controllers/Token";

export default class ElasticIO {
    private elasticsearchClient?: Client;

    constructor() { 
    }

    public async connect() {
        try {
            this.elasticsearchClient = new Client(config.getConnectionSettings());
            console.log("Connected", JSON.stringify(await this.elasticsearchClient.ping()));
        } catch (error) {
            console.error("Error connecting to elasticsearch database", JSON.stringify(config.getConnectionSettings()), JSON.stringify(error));
            exit(1);    // FAIL FAST
        }
    }

    public async disconnect() {
        await this.elasticsearchClient?.close();
    }
    
    public async search(query: { query: any; }): Promise<any> {
        return await this.elasticsearchClient?.search(query);
    }
}
