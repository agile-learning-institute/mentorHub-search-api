import "dotenv/config";
import express from "express";
import env from "./util/validateEnv";
import { ApiResponse, Client } from "@opensearch-project/opensearch";

const app = express();

const host: string = env.HOST;
const opensearchPort = env.OPENSEARCH_PORT;
const port: number = env.PORT;
const protocol: string = env.PROTOCOL;
const auth: string = env.AUTH;

const client = new Client({ node: protocol + "://" + auth + "@" + host + ":" + opensearchPort });
client.ping().then(() =>
{
    app.listen(port, () =>
    {
        console.log(`Server is running on port ${port}`);
    });
});

app.get('/', (req, res) =>
{
    res.send('Express + TypeScript Server');
});

interface queryBody
{
    name: {
        keyword: string;
    };
    size: number;
    from: number;
}

app.get('/api/search', async (req, res) =>
{
    try {
        const queryString = req.headers.query as string;
        //structure the opensearch query
        const queryBody: queryBody = {
            name: {
                keyword: queryString,
            },
            size: 5,
            from: 0,
        };
        //actually use the query
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const searchRes: ApiResponse<Record<string, any>, unknown> = await client.search({
            index: "search-index",
            body: queryBody,
        });

        //respond with opensearch response
        res.send(`found: ${searchRes}\n`);
    }
    catch (error) {
        console.error(error);
    }
});