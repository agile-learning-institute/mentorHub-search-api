import app from "./app";
import env from "../util/validateEnv";
import { Server } from "http";

const port: number = env.API_PORT;

const server: Server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    const timeout = setTimeout(() => {
        console.log('Timeout reached: Closing server forcefully');
        process.exit(1);
    }, env.CONNECTION_TIMEOUT);
    server.close(() => {
        clearTimeout(timeout);
        console.log('HTTP server closed');
    });
});
