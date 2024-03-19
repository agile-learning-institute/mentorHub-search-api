import app from "./app";
import env from "../util/validateEnv";

const port: number = env.API_PORT;

app.listen(port, () =>
{
    console.log(`Server is running on port ${port}`);
});