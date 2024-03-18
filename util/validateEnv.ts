import { cleanEnv, makeValidator } from "envalid";
import { port, str } from "envalid";

const connectionStringValidator = makeValidator((value: string | undefined) =>
{
    if (value === undefined) {
        return `${process.env.PROTOCOL}://${process.env.AUTH}@${process.env.HOST}:${process.env.OPENSEARCH_PORT}`;
    }
    return value;
});

export default cleanEnv(process.env, {
    PORT: port(),
    HOST: str(),
    PROTOCOL: str(),
    AUTH: str(),
    OPENSEARCH_PORT: port(),
    INDEX_NAME: str(),
    CONNECTION_STRING: connectionStringValidator(),
});