import Service from './service';
import ServiceContainer from './service-container';

/**
 * Server service class.
 * 
 * This service allows to start and stop the server (API).
 */
export default class ServerService extends Service {

    /**
     * Creates a new server service.
     * 
     * @param container Services container
     */
    public constructor(container: ServiceContainer) {
        super(container);
    }

    /**
     * Starts the server.
     * 
     * @async
     */
    public async start(): Promise<void> {
        const { API_PORT, DB_HOST, DB_PORT, DB_NAME } = process.env;

        // Starting server
        await this.container.express.start(<any> API_PORT);
        console.log('Server started');

        // Starting websocket
        this.container.socket.start(<any> process.env.WEB_SOCKET_PORT);
        console.log('Websocket started');

        // Connecting to database
        await this.container.db.connect(DB_HOST, DB_PORT, DB_NAME);
        console.log(`Connected to database ${DB_HOST}:${DB_PORT}/${DB_NAME}`);
    }

    /**
     * Stops the server.
     * 
     * @async
     */
    public async stop(): Promise<void> {
        // Stopping server
        await this.container.express.stop();
        console.log('Server stopped');

        // Stopping websocket
        this.container.socket.stop();
        console.log('Websocket stopped');

        // Disconnecting from database
        await this.container.db.disconnect();
        console.log('Disconnected from database');
    }
}