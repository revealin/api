import Service from './service';
import ServiceContainer from './service-container';
import Controller from '../controllers/controller';
import { Application } from 'express';
import AuthenticationController from '../controllers/authentication-controller';
import UserController from '../controllers/user-controller';
import MessageController from '../controllers/message-controller';

/**
 * Controllers service class.
 * 
 * This service manages controllers.
 * 
 * When a controller is created, it must be registered in this service.
 */
export default class ControllerService extends Service {

    private readonly controllers: Controller[];

    /**
     * Creates a new controllers service.
     * 
     * @param container Services container
     */
    public constructor(container: ServiceContainer) {
        super(container);
        this.controllers = [
            new AuthenticationController(container),
            new UserController(container),
            new MessageController(container)
        ];
    }

    /**
     * Register all controllers.
     * 
     * @param app Express application
     */
    public registerControllers(app: Application): void {
        this.controllers.forEach(controller => {
            app.use(controller.rootUri, controller.router);
            console.log(`Registered controller ${controller.constructor.name} - "${controller.rootUri}"`);
            controller.endpoints.forEach(endpoint => {
                const description = (endpoint.description !== undefined) ? ` (${endpoint.description})`: '';
                console.log(`    - ${endpoint.method} "${controller.rootUri}${endpoint.uri}"${description}`);
            });
        });
    }
}