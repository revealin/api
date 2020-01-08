import EnvironmentService from './environment-service';
import ControllerService from './controller-service';
import ExpressService from './express-service';
import ServerService from './server-service';
import DatabaseService from './database-service';
import AuthenticationService from './authentication-service';
import ConfigurationService from './configuration-service';
import PermissionService from './permission-service';
import WebSocketService from './websocket-service';
import PictureService from './picture-service';
import GeolocationService from './geolocation-service';

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
    private _express: ExpressService;
    private _srv: ServerService;
    private _db: DatabaseService;
    private _controllers: ControllerService;
    private _auth: AuthenticationService;
    private _config: ConfigurationService;
    private _perms: PermissionService;
    private _socket: WebSocketService;
    private _pics: PictureService;
    private _geo: GeolocationService;

    /**
     * Creates a new services container.
     */
    public constructor() {
        this.env; // Automatic load
    }

    public get env() {
        if (!this._env) {
            this._env = new EnvironmentService(this);
            console.log('Loaded environment service');
        }
        return this._env;
    }

    public get express() {
        if (!this._express) {
            this._express = new ExpressService(this);
            console.log('Loaded Express service');
        }
        return this._express;
    }

    public get srv() {
        if (!this._srv) {
            this._srv = new ServerService(this);
            console.log('Loaded server service');
        }
        return this._srv;
    }

    public get db() {
        if (!this._db) {
            this._db = new DatabaseService(this);
            console.log('Loaded database service');
        }
        return this._db;
    }

    public get controllers() {
        if (!this._controllers) {
            this._controllers = new ControllerService(this);
            console.log('Loaded controllers service');
        }
        return this._controllers;
    }

    public get auth() {
        if (!this._auth) {
            this._auth = new AuthenticationService(this);
            console.log('Loaded authentication service');
        }
        return this._auth;
    }

    public get config() {
        if (!this._config) {
            this._config = new ConfigurationService(this);
            console.log('Loaded configuration service');
        }
        return this._config;
    }

    public get perms() {
        if (!this._perms) {
            this._perms = new PermissionService(this);
            console.log('Loaded permissions service');
        }
        return this._perms;
    }

    public get socket() {
        if (!this._socket) {
            this._socket = new WebSocketService(this);
            console.log('Loaded websocket service');
        }
        return this._socket;
    }

    public get pics() {
        if (!this._pics) {
            this._pics = new PictureService(this);
            console.log('Loaded pictures service');
        }
        return this._pics;
    }

    public get geo() {
        if (!this._geo) {
            this._geo = new GeolocationService(this);
            console.log('Loaded geolocation service');
        }
        return this._geo;
    }
}