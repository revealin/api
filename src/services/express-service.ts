import Service from './service';
import ServiceContainer from './service-container';
import express from 'express';
import { Server } from 'http';
import helmet from 'helmet';
import cors from 'cors';

/**
 * Express service class.
 * 
 * This service manages the Express application.
 */
export default class ExpressService extends Service {

    private readonly app: express.Application;
    private srv: Server;

    /**
     * Creates a new Express service.
     * 
     * @param container Services container
     */
    public constructor(container: ServiceContainer) {
        super(container);
        this.app = this.createApplication();
    }

    /**
     * Starts Express application.
     * 
     * @param port Listening port
     * @async
     */
    public async start(port: number = 80): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (!this.srv || !this.srv.listening) {
                this.srv = this.app.listen(port, err => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            } else {
                reject(new Error('Server is already started'));
            }
        });
    }

    /**
     * Stops Express application.
     * 
     * @async
     */
    public async stop(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (this.srv && this.srv.listening) {
                this.srv.close(err => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            } else {
                reject(new Error('Server is already stopped'));
            }
        });
    }

    /**
     * Creates express Application.
     * 
     * @returns Express application
     */
    private createApplication(): express.Application {
        const app: express.Application = express();

        // Security
        app.use(express.urlencoded({
            extended: true,
            limit: '50mb'
        }));
        app.use(express.json());
        app.use(helmet());
        app.use(cors());

        // Registering controllers
        this.container.controllers.registerControllers(app);

        // handler used when no endpoint matches
        app.all('*', (req: express.Request, res: express.Response) => {
            return res.status(404).json({ error: `Unknown endpoint ${req.method} ${req.originalUrl}` });
        });
        
        return app;
    }
}