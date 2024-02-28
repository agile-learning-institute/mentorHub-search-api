import "dotenv/config";
import express from "express";
import { Client } from "@opensearch-project/opensearch";
import env from "./util/validateEnv";

const app = express();

app.get('/', (req, res) =>
{
    res.send('Express + TypeScript Server');
});

export default app;