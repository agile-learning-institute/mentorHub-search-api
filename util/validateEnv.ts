import { cleanEnv } from "envalid";
import { port, str } from "envalid";

export default cleanEnv(process.env, {
    PORT: port(),
    HOST: str(),
    PROTOCOL: str(),
    AUTH: str(),
    OPENSEARCH_PORT: port(),
    INDEX_NAME: str(),
    CONNECTION_STRING: str()
});

export const CONNECTION_STRING = `${process.env.PROTOCOL}://${process.env.AUTH}@${process.env.HOST}:${process.env.OPENSEARCH_PORT}`;