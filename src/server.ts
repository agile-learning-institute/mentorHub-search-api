import express from 'express';
import http from 'http';
import {Config, ConfigController} from '@agile-learning-institute/mentorhub-ts-api-utils';
import SearchController from './controllers/SearchController';
import promBundle from 'express-prom-bundle'; 
import ElasticIO from './store/ElasticIO';
import e from 'express';

export class Server {
    private server?: http.Server;
    private elastic: ElasticIO;
    private config: Config;

    constructor() {
        this.config = Config.getInstance();
        this.elastic = new ElasticIO(this.config.ELASTIC_CLIENT_OPTIONS);
        this.elastic.connect();
    }

    public async serve() {
        // Initialize express app
        const app = express();
        app.use(express.json());

        // Apply Prometheus monitoring middleware
        const metricsMiddleware = promBundle({
            includeMethod: true,
            metricsPath: '/api/health'
        });
        app.use(metricsMiddleware);

        // Create controllers, inject dependencies
        const searchController = new SearchController(this.elastic);
        const configController = new ConfigController();

        // Map routes to controllers
        app.get('/api/search/', (req, res) => searchController.getIndexCards(req, res));
        app.get('/api/config/', (req, res) => configController.getConfig(req, res));

        // Start Server
        const port = this.config.SEARCH_API_PORT;
        this.server = app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });

        // Register exit handler
        console.log("Registering Exit Handler");
        process.on('exit', () => this.onExitHandler());
        process.on('SIGTERM', () => this.onExitHandler());
        process.on('SIGINT', () => this.onExitHandler());
        process.on('SIGUSR1', () => this.onExitHandler());
        process.on('SIGUSR2', () => this.onExitHandler());
        process.on('uncaughtException', () => this.onExitHandler());
    }

    private async onExitHandler() {
        console.log('Server is shutting down...');
        if (this.server) {
            this.server.close(() => {
                console.log('HTTP server closed.');
            });
        }
        await this.elastic.disconnect();
        console.log('Elastic connection closed.');
        process.exit();
    }
}

// Start the server
(async () => {
    const server = new Server();
    await server.serve();
})();
