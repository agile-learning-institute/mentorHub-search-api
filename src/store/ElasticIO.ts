import { Client } from "@elastic/elasticsearch";
import { exit } from "process";
import config from "../config/Config";
import IndexCard from "../interfaces/IndexCard";

export default class ElasticIO {
    private elasticsearchClient?: Client;

    constructor() { 
    }

    public async connect() {
        try {
            this.elasticsearchClient = new Client(JSON.parse(config.getConnectionString()));
            console.log("Connected", JSON.stringify(await this.elasticsearchClient.ping()));
        } catch (error) {
            console.error("Error connecting to elasticsearch database", JSON.stringify(error));
            exit(1);    // FAIL FAST
        }
    }

    public async disconnect() {
        await this.elasticsearchClient?.close();
    }
    
    public async search(query: string | string[] | undefined): Promise<IndexCard[]> {
        let result: IndexCard[] = [];

        return result;
    }
}
/*    private connectionBody: {
        node: string;
        auth: {
            username: string;
            password: string;
        };
        tls: {
            ca: string;
            rejectUnauthorized: boolean;
        };
    } = {
            node: env.CONNECTION_STRING,
            auth: {
                username: env.ELASTICSEARCH_USERNAME,
                password: env.ELASTICSEARCH_PASS,
            },
            tls: {
                ca: '',
                rejectUnauthorized: false
            }
        };


    public async disconnect(config: Config): Promise<void>
    {
        try {
            if (this.elasticsearchClient) {
                const dbName = config.databaseName;
                await this.elasticsearchClient.close();
                console.info(`Database ${dbName} disconnected via Client`);
            } else {
                console.error("Trying to disconnect nonexistent connection");
            }
        } catch (error) {
            console.error("An error occurred while disconnecting:", error);
        }
    }
}
    */