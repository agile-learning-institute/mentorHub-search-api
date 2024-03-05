import "dotenv/config";
import express from "express";
import { OpensearchClient, Initialize } from "./client";
import QueryBody from "./querybody";
import { collectDefaultMetrics, register } from "prom-client";
import createError from "http-errors";

const app = express();
const client = OpensearchClient;
Initialize(client);

collectDefaultMetrics({ register });

register.setDefaultLabels({ app: 'opensearch-api' });


app.get('/', (req, res) =>
{
    res.send('Express + TypeScript Server');
});

app.get('/api/search', async (req, res) =>
{
    try {
        if (!req.headers.query || typeof req.headers.query !== 'string') {
            throw createError(400, 'Bad Request: Missing or invalid "query" header');
        }
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
    try {
        const metrics = await register.metrics();
        res.status(200);
        res.set('Content-Type', register.contentType);
        res.end(metrics);

    } catch (error) {
        console.error(error);
        throw createError(500, 'Internal Server Error');
    }
});


export default app;