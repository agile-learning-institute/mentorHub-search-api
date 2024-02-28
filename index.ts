import express from "express";
import { Client } from "@opensearch-project/opensearch";
import * as dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.get('/', (req, res) =>
{
    res.send('Express + TypeScript Server');
});

app.listen(port, () =>
{
    console.log(`Server is running on port ${port}`);
});