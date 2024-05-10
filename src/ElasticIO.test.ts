import { Client } from "@elastic/elasticsearch";
import ElasticIO from "./ElasticIO";
import env from "../util/validateEnv";
import Config from "./config";

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