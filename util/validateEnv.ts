import { cleanEnv } from "envalid";
import { port, str } from "envalid";

export default cleanEnv(process.env, {
    PORT: port(),
    HOST: str(),
    PROTOCOL: str(),
    AUTH: str(),
    OPENSEARCH_PORT: port(),
});