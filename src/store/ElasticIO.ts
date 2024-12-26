import { Client } from "@elastic/elasticsearch";
import { exit } from "process";

export default class ElasticIO {
    private elasticSearchClient: Client;
    private clientOptions: any;

    constructor(clientOptions: any) {
        this.clientOptions = clientOptions;
        this.elasticSearchClient = new Client(clientOptions);
        return;
    }

    public async connect() {
        console.info("Connecting...");
        try {
            console.log("Connected", JSON.stringify(await this.elasticSearchClient.ping()));
        } catch (error) {
            console.error("Error connecting to elasticsearch database", JSON.stringify(this.clientOptions), JSON.stringify(error));
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
