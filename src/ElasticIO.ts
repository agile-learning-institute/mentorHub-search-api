import { Client } from "@elastic/elasticsearch";
import env from "../util/validateEnv";
import Config from "./config";

export default class ElasticIO
{

    private elasticsearchClient: Client | undefined;

    constructor() { }

    private connectionBody: {
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

    public async initialize(): Promise<Client | undefined>
    {
        try {
            this.elasticsearchClient = new Client(this.connectionBody);
            console.log("Testing connection to ElasticsearchDB...");
            const ping = await this.elasticsearchClient.ping();
            console.log(ping);
            console.log("Elasticsearch server is reachable");
            return this.elasticsearchClient;
        } catch (error) {
            console.error("Error connecting to elasticsearch database");
            console.error(error);
        }
    }

    processResults(hits: import("@elastic/elasticsearch/lib/api/types").SearchHit<unknown>[] | undefined)
    {
        if (!hits) return [];

        hits.sort((a, b) => (b._score ?? 0) - (a._score ?? 0));

        let processedHits = hits.map((hit) => hit._source);

        return processedHits;
    }

    public async search(queryString: string)
    {
        const searchRes = await this.elasticsearchClient?.search({
            index: env.INDEX_NAME,
            body: {
                query: {
                    bool: {
                        should: [
                            {
                                multi_match: {
                                    query: `${queryString}*`,
                                    type: "best_fields",
                                    fields: ["name", "status", "firstName", "lastName"]
                                }
                            },
                            {
                                query_string: {
                                    query: `${queryString}*`,
                                    fields: ["name", "status", "firstName", "lastName"]
                                }
                            }
                        ]
                    }
                }
            }
        });
        return searchRes;
    }

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