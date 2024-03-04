import "dotenv/config";
import express from "express";
import { OpensearchClient, Initialize } from "./client";

const app = express();

const client = OpensearchClient;
Initialize(client);



app.get('/', (req, res) =>
{
    res.send('Express + TypeScript Server');
});

interface queryBody
{
    query: {
        prefix: {
            [key: string]: string | number | undefined;
        };
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
            query: {
                prefix: {
                    name: `${queryString}`,
                }
            },
            size: 5,
            from: 0,
        };
        //actually use the query
        const searchRes = await client.search({
            index: "search-index",
            body: queryBody
        });
        //respond with opensearch response
        res.status(200).json(searchRes);
    }
    catch (error) {
        console.error(error);
    }
});

export default app;