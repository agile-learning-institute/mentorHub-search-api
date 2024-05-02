import "dotenv/config";
import env from "../util/validateEnv";
import express from "express";
import { Initialize } from "./client";
import { collectDefaultMetrics, register } from "prom-client";
import createHttpError from "http-errors";
import { errorHandler } from "./middleware/errorHandler";
import { Config } from "./config";

const app = express();

collectDefaultMetrics({ register });
register.setDefaultLabels({ app: 'elasticsearch-api' });

app.get('/', (req, res) =>
{
    res.send('Express + TypeScript Server');
});

app.get('/api/search', async (req, res, next) =>
{
    //initialize client
    const client = await Initialize();
    try {
        //check if we recieved the query header
        if (!req.headers.query || typeof req.headers.query !== 'string') {
            throw createHttpError(400, 'Bad Request: Missing or invalid "query" header');
        }
        const queryString = req.headers.query as string;
        const searchRes = await client?.search({
            index: env.INDEX_NAME,
            body: {
                query: {
                    multi_match: {
                        query: queryString,
                        type: "best_fields", // Adjust type based on your requirements
                        fields: ["*"] // Search across all fields
                    }
                }
            }
        });
        //respond with elasticsearch response
        res.status(200).json(searchRes?.hits);
    }
    catch (error) {
        console.error(error);
        next(error);
    }
    finally {
        await client?.close();
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

app.get('/api/config', async (req, res, next) =>
{
    try {
        const config = new Config();
        res.status(200).json(config);
    }
    catch (error) {
        console.error(error);
        next(error);
    }
});

app.use(errorHandler);

export default app;
