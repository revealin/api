import Controller from './controller';
import ServiceContainer from '../services/service-container';
import { Request, Response } from 'express';

/**
 * Messages controller.
 */
export default class MessageController extends Controller {

    /**
     * Creates a new messages controller.
     * 
     * @param container Services container
     */
    public constructor(container: ServiceContainer) {
        super(container, '/messages');
        this.getAllHandler = this.getAllHandler.bind(this);
        this.getSpecificHandler = this.getSpecificHandler.bind(this);
        this.createHandler = this.createHandler.bind(this);
        this.modifyHandler = this.modifyHandler.bind(this);
        this.updateHandler = this.updateHandler.bind(this);
        this.deleteHandler = this.deleteHandler.bind(this);
        this.registerEndpoint({ method: 'GET', uri: '/', handlers: [this.getAllHandler], description: 'Gets all messages' });
        this.registerEndpoint({ method: 'GET', uri: '/:id', handlers: [this.getSpecificHandler], description: 'Gets a specific message' });
        this.registerEndpoint({ method: 'POST', uri: '/', handlers: [this.createHandler], description: 'Creates a new message' });
        this.registerEndpoint({ method: 'PUT', uri: '/:id', handlers: [this.modifyHandler], description: 'Modifies a message' });
        this.registerEndpoint({ method: 'PATCH', uri: '/:id', handlers: [this.updateHandler], description: 'Updates a message' });
        this.registerEndpoint({ method: 'DELETE', uri: '/:id', handlers: [this.deleteHandler], description: 'Deletes a message' });
    }

    /**
     * Gets all messages.
     * 
     * This method is a handler / endpoint :
     * - Method : `GET`
     * - URI : `/`
     * 
     * @param req Express request
     * @param res Express response
     * @async
     */
    public async getAllHandler(req: Request, res: Response): Promise<any> {
        try {
            const messages = await this.container.db.messages.find().populate('sender').populate('receiver');
            return res.status(200).json(messages);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: err.message });
        }
    }

    /**
     * Gets a specific message.
     * 
     * This method is a handler / endpoint :
     * - Method : `GET`
     * - URI : `/:id`
     * 
     * @param req Express request
     * @param res Express response
     * @async
     */
    public async getSpecificHandler(req: Request, res: Response): Promise<any> {
        try {
            const message = await this.container.db.messages.findById(req.params.id).populate('sender').populate('receiver');
            if (!message) {
                return res.status(404).json({ error: 'Message not found' });
            }
            return res.status(200).json(message);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: err.message });
        }
    }

    /**
     * Creates a new message.
     * 
     * This method is a handler / endpoint :
     * - Method : `POST`
     * - URI : `/`
     * 
     * @param req Express request
     * @param res Express response
     * @async
     */
    public async createHandler(req: Request, res: Response): Promise<any> {
        try {
            const message = await this.container.db.messages.create({
                sender: req.body.sender,
                receiver: req.body.receiver,
                content: req.body.content
            });
            return res.status(201).json({ id: message.id });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: err.message });
        }
    }

    /**
     * Modifies a message.
     * 
     * This method is a handler / endpoint :
     * - Method : `PUT`
     * - URI : `/:id`
     * 
     * @param req Express request
     * @param res Express response
     * @async
     */
    public async modifyHandler(req: Request, res: Response): Promise<any> {
        try {
            const message = await this.container.db.messages.findById(req.params.id);
            if (!message) {
                return res.status(404).json({ error: 'Message not found' });
            }
            message.sender = req.body.sender;
            message.receiver = req.body.receiver;
            message.content = req.body.content;
            await message.save();
            return res.status(200).json();
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: err.message });
        }
    }

    /**
     * Updates a message.
     * 
     * This method is a handler / endpoint :
     * - Method : `PATCH`
     * - URI : `/:id`
     * 
     * @param req Express request
     * @param res Express response
     * @async
     */
    public async updateHandler(req: Request, res: Response): Promise<any> {
        try {
            const message = await this.container.db.messages.findById(req.params.id);
            if (!message) {
                return res.status(404).json({ error: 'Message not found' });
            }
            if (req.body.sender) {
                message.sender = req.body.sender;
            }
            if (req.body.receiver) {
                message.receiver = req.body.receiver;
            }
            if (req.body.content) {
                message.content = req.body.content;
            }
            await message.save();
            return res.status(200).json();
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: err.message });
        }
    }

    /**
     * Deletes a message.
     * 
     * This method is a handler / endpoint :
     * - Method : `DELETE`
     * - URI : `/:id`
     * 
     * @param req Express request
     * @param res Express response
     * @async
     */
    public async deleteHandler(req: Request, res: Response): Promise<any> {
        try {
            const message = await this.container.db.messages.findByIdAndDelete(req.params.id);
            if (!message) {
                return res.status(404).json({ error: 'Message not found' });
            }
            return res.status(204).json();
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: err.message });
        }
    }
}