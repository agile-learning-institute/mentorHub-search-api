import "dotenv/config";
import env from "../util/validateEnv";
import express from "express";
import { OpensearchClient, Initialize } from "./client";
import QueryBody from "./querybody";
import { collectDefaultMetrics, register } from "prom-client";
import createHttpError from "http-errors";
import { errorHandler } from "./middleware/errorHandler";

const app = express();
const client = OpensearchClient;
Initialize(client);

collectDefaultMetrics({ register });

register.setDefaultLabels({ app: 'opensearch-api' });


app.get('/', (req, res) =>
{
    res.send('Express + TypeScript Server');
});

app.get('/api/search', async (req, res, next) =>
{
    try {
        //check if we recieved the query header
        if (!req.headers.query || typeof req.headers.query !== 'string') {
            throw createHttpError(400, 'Bad Request: Missing or invalid "query" header');
        }
        const queryString = req.headers.query as string;
        //structure the opensearch query
        const queryBody: QueryBody = new QueryBody(queryString, 5, 0);
        //actually use the query
        const searchRes = await client.search({
            index: env.INDEX_NAME,
            body: queryBody
        });
        //respond with opensearch response
        res.status(200).json(searchRes.body);
    }
    catch (error) {
        console.error(error);
        next(error);
    }
});

app.get('/api/health', async (req, res, next) =>
{
    try {
        const metrics = await register.metrics();
        res.status(200);
        res.set('Content-Type', register.contentType);
        res.end(metrics);

    } catch (error) {
        console.error(error);
        next(error);
    }
});

app.use(errorHandler);

export default app;