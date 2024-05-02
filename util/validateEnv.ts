import { cleanEnv, makeValidator } from "envalid";
import { port, str, num } from "envalid";

const connectionStringValidator = makeValidator((value: string | undefined) =>
{
    if (value === undefined) {
        return `${process.env.ELASTICSEARCH_PROTOCOL}://$${process.env.ELASTICSEARCH_HOST}:${process.env.ELASTICSEARCH_PORT}`;
    }
    return value;
});

export default cleanEnv(process.env, {
    API_PORT: port(),
    ELASTICSEARCH_HOST: str(),
    ELASTICSEARCH_PROTOCOL: str(),
    ELASTICSEARCH_PORT: port(),
    INDEX_NAME: str(),
    CONNECTION_STRING: connectionStringValidator(),
    CONNECTION_TIMEOUT: num()
});
