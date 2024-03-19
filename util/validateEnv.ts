import { cleanEnv, makeValidator } from "envalid";
import { port, str } from "envalid";

const connectionStringValidator = makeValidator((value: string | undefined) => {
    if (value === undefined) {
        return `${process.env.PROTOCOL}://${process.env.AUTH}@${process.env.HOST}:${process.env.OPENSEARCH_PORT}`;
    }
    return value;
});

export default cleanEnv(process.env, {
    API_PORT: port(),
    OPENSEARCH_HOST: str(),
    OPENSEARCH_PROTOCOL: str(),
    OPENSEARCH_AUTH: str(),
    OPENSEARCH_PORT: port(),
    INDEX_NAME: str(),
    CONNECTION_STRING: connectionStringValidator(),
});
