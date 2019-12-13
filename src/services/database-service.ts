import Service from './service';
import ServiceContainer from './service-container';
import { Mongoose, Model } from 'mongoose';
import createUserModel, { UserInstance } from '../models/user-model';
import createMessageModel, { MessageInstance } from '../models/message-model';

/**
 * Database service class.
 * 
 * This service is used to interact with database(s). Models must be registered in this service.
 */
export default class DatabaseService extends Service {

    private readonly mongoose: Mongoose;
    public readonly users: Model<UserInstance>;
    public readonly messages: Model<MessageInstance>;

    /**
     * Creates a new database service.
     * 
     * @param container Services container
     */
    public constructor(container: ServiceContainer) {
        super(container);
        this.mongoose = this.createMongoose();
        this.users = createUserModel(container, this.mongoose);
        this.messages = createMessageModel(container, this.mongoose);
    }

    /**
     * Connects to a database.
     * 
     * @param host Host
     * @param port Port
     * @param dbName Database name
     * @async
     */
    public async connect(host: string, port: string | number, dbName: string): Promise<void> {
        await this.mongoose.connect(`mongodb://${host}:${port}/${dbName}`, { useNewUrlParser: true });
    }

    /**
     * Disconnects from a database.
     * 
     * @async
     */
    public async disconnect(): Promise<void> {
        await this.mongoose.disconnect();
    }

    /**
     * Creates Mongoose instance.
     * 
     * @returns Mongoose instance
     */
    private createMongoose(): Mongoose {
        const mongoose = new Mongoose();
        mongoose.set('useCreateIndex', true);
        return mongoose;
    }
}