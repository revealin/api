import EnvironmentService from './environment-service';

/**
 * Services container class.
 * 
 * The services container is used to access all services in the code, particulary in controllers or in services themselves.
 * A service is loaded when it is accessed for the first time.
 * 
 * When a service is created, it must be registered here.
 */
export default class ServiceContainer {

    private static INSTANCE: ServiceContainer;

    /**
     * Returns the instance of the services container.
     * 
     * @returns Instance of the services container
     */
    public static getInstance(): ServiceContainer {
        if (!ServiceContainer.INSTANCE) {
            ServiceContainer.INSTANCE = new ServiceContainer();
        }
        return ServiceContainer.INSTANCE;
    }

    private _env: EnvironmentService;

    /**
     * Creates a new services container.
     */
    public constructor() {
        this._env; // Automatic load
    }

    public get env() {
        if (!this._env) {
            this._env = new EnvironmentService(this);
            console.log('Loaded environment service');
        }
        return this._env;
    }
}