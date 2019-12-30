import Service from './service';
import ServiceContainer from './service-container';
import io, { Server, Socket } from 'socket.io';
import _ from 'lodash';

/**
 * Websocket service class.
 * 
 * This service is used to communicate with websockets.
 */
export default class WebSocketService extends Service {

    private srv: Server;

    /**
     * Creates a new websocket service.
     * 
     * @param container Services container
     */
    public constructor(container: ServiceContainer) {
        super(container);
    }

    /**
     * Starts the websocket server.
     */
    public start(port: number = 8080): void {
        if (!this.srv) {
            this.srv = io(port);
            this.createEvents();
        }
    }

    /**
     * Stops the websocket server.
     */
    public stop(): void {
        if (this.srv) {
            this.srv.close();
            delete this.srv;
        }
    }

    /**
     * Creates websocket events.
     */
    private createEvents(): void {
        this.srv.on('connect', (socket) => {
            console.log(`Socket connected : ${socket.handshake.address}`);

            // Disconnect event
            socket.on('disconnect', () => {
                socket.leaveAll();
                console.log(`Socket disconnected : ${socket.handshake.address}`);
            });

            // Register event must be called first, it join the socket in all rooms it need (all matches)
            socket.on('register', async userId => {
                try {
                    const receiverIds = await this.container.db.messages.find({
                        sender: userId
                    }).select('receiver').distinct('receiver');
                    const rooms = receiverIds.map(receiverId => this.generateRoomId(userId, receiverId.toString()));
                    socket.join(rooms);
                    console.log(`Registered socket (user ${userId}) with rooms : ${rooms}`);
                } catch (err) {
                    console.error(err);
                }
            });
            
            // Send message event
            socket.on('message', async ({senderId, receiverId, content}: EventDataMessage) => {
                const roomId = this.generateRoomId(senderId, receiverId);
                socket.broadcast.to(roomId).emit('message', content);
                try {
                    await this.container.db.messages.create({
                        sender: senderId,
                        receiver: receiverId,
                        content
                    });
                    console.log(`Sended message from ${senderId} to ${receiverId} (room ${roomId}) : ${content}`);
                } catch (err) {
                    console.error(err);
                }
            });
        });
    }

    /**
     * Generates a room ID.
     * 
     * Users IDs don't need to be ordered, the room ID is always generated with users IDs sorted alphabetical.
     * 
     * @param userId1 User ID n°1
     * @param userId2 User ID n°2
     * @returns Room ID (`userId-userId`)
     */
    private generateRoomId(userId1: string, userId2: string): string {
        if (userId1 === userId2) {
            throw new ChatError('Could not generate a room ID : users IDs are same');
        }
        return userId1 < userId2 ? `${userId1}-${userId2}` : `${userId2}-${userId1}`;
    }
}

/**
 * Data for event "message" (client -> server).
 */
interface EventDataMessage {
    senderId: string;
    receiverId: string;
    content: string;
}

/**
 * Chat error class.
 */
class ChatError extends Error {

    /**
     * Creates a new chat error class.
     * 
     * @param msg Error message
     */
    public constructor(msg: string) {
        super(msg);
    }
}