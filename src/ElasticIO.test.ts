import { Client } from "@elastic/elasticsearch";
import { Initialize } from "./client";

//Mock the Client
jest.mock('@elastic/elasticsearch');

//Mock the env vars
jest.mock('../util/validateEnv', () => ({
    __esModule: true,
    default: jest.fn().mockReturnValue({}),
}));

describe('Initialize function', () =>
{
    it('should return a client instance on successful connection', async () =>
    {
        //Mock the env connection string
        const CONNECTION_STRING = 'https://localhost:9200';

        const mockedClient = new Client({ node: CONNECTION_STRING }) as jest.Mocked<Client>;
        //Mock the ping method of the CLient instance to resolve successfully
        mockedClient.ping.mockResolvedValue(true);



        const client = await Initialize();

        //Assert that the Client constructor was called with the correct arguments
        expect(Client).toHaveBeenCalledWith({
            node: CONNECTION_STRING,
            auth: {
                username: "elastic", // Default Elasticsearch username
                password: "o0=eLmmQbsrdEW89a-Id" // Elasticsearch password
            },
            tls: {
                ca: "",
                rejectUnauthorized: false
            }
        });

        expect(client).toBe(mockedClient);
        //Assert that the ping method was called
        //expect(mockPing).toHaveBeenCalled();

        //Assert that the function returns the mocked client instance
        expect(client).toBeDefined();
    });

    it('should handle connection errors', async () =>
    {
        //Mock the ping emthod of the Client instance to reject w/ an error
        const mockPing = jest.fn().mockRejectedValue(new Error('Connection failed'));

        //Override the ping method
        (Client as jest.Mock).mockImplementation(() => ({
            ping: mockPing
        }));

        const CONNECTION_STRING = 'https://localhost:9200';

        const client = await Initialize();
        //Assert that the Client constructor was called with the correct arguments
        expect(Client).toHaveBeenCalledWith({
            node: CONNECTION_STRING,
            auth: {
                username: "elastic", // Default Elasticsearch username
                password: "o0=eLmmQbsrdEW89a-Id" // Elasticsearch password
            },
            tls: {
                ca: "",
                rejectUnauthorized: false
            }
        });
        //Assert that the ping method was called
        expect(mockPing).toHaveBeenCalled();

        //Assert that the function returns the mocked client instance
        expect(client).toBeUndefined();
    });
});