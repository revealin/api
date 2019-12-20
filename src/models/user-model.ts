import Attributes from './model';
import { Document, Mongoose, Model, Schema } from 'mongoose';
import ServiceContainer from '../services/service-container';

/**
 * User attributes interface.
 */
export interface UserAttributes extends Attributes {
    email: string;
    name: string;
    password: string;
    role: string;
    gender: 'male' | 'female';
    birth: Date;
    description: string;
    banned: boolean;
    localization: {
        lat: number;
        lon: number;
    }
    likes: UserInstance[];
    nopes: UserInstance[];
    reveals: UserInstance[];
    reports: [{
        reporter: UserInstance;
        reason: string;
    }];
    pictures: [{
        base64: string;
        order: number;
    }];
}

/**
 * User instance interface.
 */
export interface UserInstance extends UserAttributes, Document {}

/**
 * Creates the user model.
 * 
 * @param container Services container
 * @param mongoose Mongoose instance
 * @returns User model
 */
export default function createModel(container: ServiceContainer, mongoose: Mongoose): Model<UserInstance> {
    return mongoose.model('User', createSchema(container), 'users');
}

/**
 * Creates the user schema.
 * 
 * @param container Services container
 * @returns User schema
 */
function createSchema(container: ServiceContainer) {
    const roles = Object.keys(container.config.permissions);

    const schema = new Schema({
        email: {
            type: Schema.Types.String,
            required: [true, 'Email is required'],
            unique: true,
            match: [/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Invalid user email']
        },
        name: {
            type: Schema.Types.String,
            required: [true, 'User name is required'],
            minlength: [3, 'Name is too small, it\'s length must be between 3 and 30 characters'],
            maxlength: [30, 'Name is too long, it\'s length must be between 3 and 30 characters']
        },
        role: {
            type: Schema.Types.String,
            enum: roles,
            default: roles.find(role => container.config.permissions[role].default)
        },
        password: {
            type: Schema.Types.String,
            required: [true, 'User password is required'],
            minlength: [8, 'Password is too small, it\'s length must be greater than 8 characters'],
            select: false
        },
        gender: {
            type: Schema.Types.String,
            required: [true, 'Gender is required'],
            enum: ['male', 'female']
        },
        birth: {
            type: Schema.Types.Date,
            required: [true, 'Birth date is required'],
            max: [() => {
                const now = new Date();
                return new Date(now.getFullYear() - 18, now.getMonth(), now.getDate());
            }, 'Age is too small, it must be greater than 18']
        },
        description: {
            type: Schema.Types.String,
            required: [true, 'Description is required'],
            maxlength: [500, 'Description is too long, it\'s length must be smaller than 1000 characters']
        },
        banned: {
            type: Schema.Types.Boolean,
            default: false
        },
        localization: {
            type: createLocalizationSchema(),
            required: [true, 'Localization is required']
        },
        likes: [{
            type: Schema.Types.ObjectId,
            ref: 'User',
            default: []
        }],
        nopes: [{
            type: Schema.Types.ObjectId,
            ref: 'User',
            default: []
        }],
        reveals: [{
            type: Schema.Types.ObjectId,
            ref: 'User',
            default: []
        }],
        reports: [{
            type: createReportSchema(),
            default: []
        }],
        pictures: [{
            type: createPictureSchema(),
            default: []
        }]
    }, {
        timestamps: true
    });

    // Password hash validation
    schema.pre('validate', async function(this: UserInstance, next) {
        if (this.password !== undefined) { // Validates the password only if filled
            try {
                this.password = await container.auth.hash(this.password, Number(process.env.HASH_SALT));
                return next();
            } catch (err) {
                console.error(err);
                return next(err);
            }
        }
    });
    
    return schema;
}

/**
 * Creates the localization sub-schema.
 * 
 * @returns Localization sub-schema
 */
function createLocalizationSchema() {
    const schema = new Schema({
        lat: {
            type: Schema.Types.Number,
            required: [true, 'Latitude is required']
        },
        lon: {
            type: Schema.Types.Number,
            required: [true, 'Longitude is required']
        }
    }, {
        _id: false
    });

    return schema;
}

/**
 * Creates the report sub-schema.
 * 
 * @returns Report sub-schema
 */
function createReportSchema() {
    const schema = new Schema({
        reporter: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Reporter is required']
        },
        reason: {
            type: Schema.Types.String,
            required: [true, 'Reason is required']
        }
    }, {
        _id: false
    });

    return schema;
}

/**
 * Creates the picture sub-schema.
 * 
 * @returns Picture sub-schema
 */
function createPictureSchema() {
    const schema = new Schema({
        base64: {
            type: Schema.Types.String,
            required: [true, 'Base64 is required']
        },
        order: {
            type: Schema.Types.Number,
            required: [true, 'Order is required']
        }
    });

    return schema;
}