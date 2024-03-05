import "dotenv/config";
import express from "express";
import { OpensearchClient, Initialize } from "./client";
import QueryBody from "./querybody";

const app = express();

const client = OpensearchClient;
Initialize(client);



app.get('/', (req, res) =>
{
    res.send('Express + TypeScript Server');
});

app.get('/api/search', async (req, res) =>
{
    try {
        const queryString = req.headers.query as string;
        //structure the opensearch query
        const queryBody: QueryBody = new QueryBody(queryString, 5, 0);
        //actually use the query
        const searchRes = await client.search({
            index: "search-index",
            body: queryBody
        });
        //respond with opensearch response
        res.status(200).json(searchRes.body);
    }
    catch (error) {
        console.error(error);
    }
});

app.get('/api/health', async (req, res) =>
{
    const index = req.query.index as string | undefined;

    try {
        const clusterHealth = await getClusterHealth(index);
        res.status(200).json(clusterHealth);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

async function getClusterHealth(index: string | undefined)
{
    try {
        const response = await client.cluster.health({ index });
        const clusterHealth = response.body;
        console.log('Cluster Health:', clusterHealth);
        return clusterHealth;
    } catch (error) {
        console.error(error);
    }
}


export default app;