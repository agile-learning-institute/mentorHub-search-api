import { Client } from "@elastic/elasticsearch";
import ElasticIO from "./ElasticIO";
import env from "../util/validateEnv";
import Config from "./config";
import { SearchHit } from "@elastic/elasticsearch/lib/api/types";

//Mock the Client
jest.mock("@elastic/elasticsearch");

//Mock the env vars
jest.mock("../util/validateEnv", () => ({
    __esModule: true,
    default: jest.fn().mockReturnValue({}),
}));

const mockConfig = {
    databaseName: "mockedDBName"
} as Config;

describe("ElasticIO", () =>
{
    let elasticIO: ElasticIO;

    beforeEach(() =>
    {
        elasticIO = new ElasticIO();
    });

    afterEach(() =>
    {
        jest.clearAllMocks();
    });

    describe("Initialize", () =>
    {
        it("should initialize Elasticsearch client with correct connection parameters", async () =>
        {
            await elasticIO.initialize();
            expect(Client).toHaveBeenCalledWith({
                node: env.CONNECTION_STRING,
                auth: {
                    username: env.ELASTICSEARCH_PASS,
                    password: env.ELASTICSEARCH_USERNAME
                },
                tls: {
                    ca: "",
                    rejectUnauthorized: false
                }
            });
        });
        it("should return initialized client", async () =>
        {
            const result = await elasticIO.initialize();
            expect(result).toBeDefined();
        });
        it("should log error of connection fails", async () =>
        {
            (Client as jest.Mock).mockImplementationOnce(() =>
            {
                throw new Error("Connection error");
            });
            const consoleErrorSpy = jest.spyOn(console, "error");
            await elasticIO.initialize();
            expect(consoleErrorSpy).toHaveBeenCalledWith("Error connecting to elasticsearch database");
        });
    });

    describe("processResults", () =>
    {
        it("should return an empty array when hits is undefined", () =>
        {
            const result = elasticIO.processResults(undefined);
            expect(result).toEqual([]);
        });
        it("should return an empty array when hits is an empty array", () =>
        {
            const result = elasticIO.processResults([]);
            expect(result).toEqual([]);
        });
        it("should sort the search results by _score in descending order and return their _source properties", () =>
        {
            const hits: SearchHit<unknown>[] = [
                { _score: 1, _source: { id: 1, name: "Item 1" } } as SearchHit<unknown>,
                { _score: 3, _source: { id: 3, name: "Item 3" } } as SearchHit<unknown>,
                { _score: 2, _source: { id: 2, name: "Item 2" } } as SearchHit<unknown>,
            ];

            const result = elasticIO.processResults(hits);

            expect(result).toEqual([
                { id: 3, name: "Item 3" },
                { id: 2, name: "Item 2" },
                { id: 1, name: "Item 1" },
            ]);
        });
    });

    describe("search", () =>
    {
        it("should should call elasticsearchClient.search with the correct parameters", async () =>
        {
            const mockClient = {
                search: jest.fn().mockResolvedValue({
                    hits: {
                        hits: [
                            { _source: { name: "Junior Jobs", status: "Active", ID: { "$oid": "bb00" } } },
                            { _source: { name: "Michael Smith", status: "Active", ID: { "$oid": "bb01" } } },
                        ]
                    }
                })
            };

            elasticIO["elasticsearchClient"] = mockClient as unknown as Client;

            const queryString = 'active';
            const searchRes = await elasticIO.search(queryString);

            expect(mockClient.search).toHaveBeenCalledWith({
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
            if (searchRes) {
                searchRes.hits.hits.forEach(result =>
                {
                    expect(result._source).toEqual(
                        expect.objectContaining({
                            ID: expect.any(Object),
                            name: expect.any(String),
                            status: expect.any(String),
                        })
                    );
                });
            }
        });
    });

    describe("disconnect", () =>
    {
        it("should close Elasticsearch client connection if client is defined", async () =>
        {
            elasticIO["elasticsearchClient"] = {
                close: jest.fn().mockResolvedValue(undefined)
            } as unknown as Client;

            await elasticIO.disconnect(mockConfig);
            expect(elasticIO["elasticsearchClient"]!.close).toHaveBeenCalled();
        });

        it("should not close client if client is not defined", async () =>
        {
            const consoleWarnSpy = jest.spyOn(console, "error");
            await elasticIO.disconnect(mockConfig);
            expect(consoleWarnSpy).toHaveBeenCalledWith("Trying to disconnect nonexistent connection");
        });
    });

});