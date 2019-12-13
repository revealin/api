import Attributes from './model';
import { UserInstance } from './user-model';
import { Document, Mongoose, Model, Schema } from 'mongoose';
import ServiceContainer from '../services/service-container';

/**
 * Message attributes interface.
 */
export interface MessageAttributes extends Attributes {
    sender: UserInstance;
    receiver: UserInstance;
    content: string;
    read: boolean;
}

/**
 * Message instance interface.
 */
export interface MessageInstance extends MessageAttributes, Document {}

/**
 * Creates the message model.
 * 
 * @param container Services container
 * @param mongoose Mongoose instance
 * @returns Message model
 */
export default function createModel(container: ServiceContainer, mongoose: Mongoose): Model<MessageInstance> {
    return mongoose.model('Message', createSchema(container), 'messages');
}

/**
 * Creates the message schema.
 * 
 * @param container Services container
 * @returns Message schema
 */
function createSchema(container: ServiceContainer) {
    const schema = new Schema({
        sender: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Sender is required']
        },
        receiver: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Receiver is required']
        },
        content: {
            type: Schema.Types.String,
            required: [true, 'Content is required']
        },
        read: {
            type: Schema.Types.Boolean,
            default: false
        }
    });

    return schema;
}