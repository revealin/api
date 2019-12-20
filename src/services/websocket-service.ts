import Service from './service';
import ServiceContainer from './service-container';
import io, { Server, Socket } from 'socket.io';

/**
 * Websocket service class.
 * 
 * This service is used to communicate with websockets.
 */
export default class WebSocketService extends Service {

    public readonly srv: Server;

    /**
     * Creates a new websocket service.
     * 
     * @param container Services container
     */
    public constructor(container: ServiceContainer) {
        super(container);
        this.srv = io(process.env.WEB_SOCKET_PORT);
    }
}