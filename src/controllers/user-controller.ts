import Controller from './controller';
import ServiceContainer from '../services/service-container';
import { Request, Response } from 'express';
import _ from 'lodash';

/**
 * Users controller.
 */
export default class UserController extends Controller {

    /**
     * Creates a new users controller.
     * 
     * @param container Services container
     */
    public constructor(container: ServiceContainer) {
        super(container, '/users');
        this.getAllHandler = this.getAllHandler.bind(this);
        this.getSpecificHandler = this.getSpecificHandler.bind(this);
        this.modifyHandler = this.modifyHandler.bind(this);
        this.updateHandler = this.updateHandler.bind(this);
        this.deleteHandler = this.deleteHandler.bind(this);
        this.createMessageHandler = this.createMessageHandler.bind(this);
        this.createReportHandler = this.createReportHandler.bind(this);
        this.createPictureHandler = this.createPictureHandler.bind(this);
        this.sortPictureHandler = this.sortPictureHandler.bind(this);
        this.deletePictureHandler = this.deletePictureHandler.bind(this);
        this.registerEndpoint({ method: 'GET', uri: '/', handlers: [this.getAllHandler], description: 'Gets all users' });
        this.registerEndpoint({ method: 'GET', uri: '/:id', handlers: [this.getSpecificHandler], description: 'Gets a specific user' });
        this.registerEndpoint({ method: 'PUT', uri: '/:id', handlers: [this.modifyHandler], description: 'Modifies an user' });
        this.registerEndpoint({ method: 'PATCH', uri: '/:id', handlers: [this.updateHandler], description: 'Updates an user' });
        this.registerEndpoint({ method: 'DELETE', uri: '/:id', handlers: [this.deleteHandler], description: 'Deletes an user' });
        this.registerEndpoint({ method: 'POST', uri: '/:id/messages', handlers: [this.createMessageHandler], description: 'Creates a new message from an user' });
        this.registerEndpoint({ method: 'POST', uri: '/:id/reports', handlers: [this.createReportHandler], description: 'Creates a new report for an user' });
        this.registerEndpoint({ method: 'POST', uri: '/:id/pictures', handlers: [this.createPictureHandler], description: 'Creates a new picture for an user' });
        this.registerEndpoint({ method: 'PATCH', uri: '/:id/pictures/:pictureId', handlers: [this.sortPictureHandler], description: 'Sorts a picture for an user' });
        this.registerEndpoint({ method: 'DELETE', uri: '/:id/pictures/:pictureId', handlers: [this.deletePictureHandler], description: 'Deletes a picture for an user' });
    }

    /**
     * Gets all users.
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
            const users = await this.container.db.users.find();
            return res.status(200).json(users);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: err.message });
        }
    }

    /**
     * Gets a specific user.
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
            const user = await this.container.db.users.findById(req.params.id);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            return res.status(200).json(user);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: err.message });
        }
    }

    /**
     * Modifies an user.
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
            const user = await this.container.db.users.findById(req.params.id);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            user.email = req.body.email;
            user.name = req.body.name;
            user.password = req.body.password;
            user.role = req.body.role;
            user.gender = req.body.gender;
            user.birth = req.body.birth;
            user.description = req.body.description;
            user.banned = req.body.banned;
            user.localization = req.body.localization;
            user.likes = req.body.likes;
            user.nopes = req.body.nopes;
            user.reveals = req.body.reveals;
            await user.save();
            return res.status(200).json();
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: err.message });
        }
    }

    /**
     * Updates an user.
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
            const user = await this.container.db.users.findById(req.params.id);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            if (req.body.email) {
                user.email = req.body.email;
            }
            if (req.body.name) {
                user.name = req.body.name;
            }
            if (req.body.password) {
                user.password = req.body.password;
            }
            if (req.body.role) {
                user.role = req.body.role;
            }
            if (req.body.gender) {
                user.gender = req.body.gender;
            }
            if (req.body.birth) {
                user.birth = req.body.birth;
            }
            if (req.body.description) {
                user.description = req.body.description;
            }
            if (req.body.banned) {
                user.banned = req.body.banned;
            }
            if (req.body.localization) {
                user.localization = req.body.localization;
            }
            if (req.body.likes) {
                user.likes = req.body.likes;
            }
            if (req.body.nopes) {
                user.nopes = req.body.nopes;
            }
            if (req.body.reveals) {
                user.reveals = req.body.reveals;
            }
            await user.save();
            return res.status(200).json();
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: err.message });
        }
    }

    /**
     * Deletes an user.
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
            const user = await this.container.db.users.findByIdAndDelete(req.params.id);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            return res.status(204).json();
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: err.message });
        }
    }

    /**
     * Creates a new message from an user.
     * 
     * This method is a handler / endpoint :
     * - Method : `POST`
     * - URI : `/:id/messages`
     * 
     * @param req Express request
     * @param res Express response
     * @async
     */
    public async createMessageHandler(req: Request, res: Response): Promise<any> {
        try {
            const user = await this.container.db.users.findById(req.params.id);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            const message = await this.container.db.messages.create({
                sender: user.id,
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
     * Creates a new report for an user.
     * 
     * This method is a handler / endpoint :
     * - Method : `POST`
     * - URI : `/:id/reports`
     * 
     * @param req Express request
     * @param res Express response
     * @async
     */
    public async createReportHandler(req: Request, res: Response): Promise<any> {
        try {
            const user = await this.container.db.users.findById(req.params.id);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            user.reports.push({
                reporter: req.body.reporter,
                reason: req.body.reason
            });
            await user.save();
            return res.status(201).json();
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: err.message });
        }
    }

    /**
     * Creates a new picture for an user.
     * 
     * This method is a handler / endpoint :
     * - Method : `POST`
     * - URI : `/:id/pictures`
     * 
     * @param req Express request
     * @param res Express response
     * @async
     */
    public async createPictureHandler(req: Request, res: Response): Promise<any> {
        try {
            const user = await this.container.db.users.findById(req.params.id);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            user.pictures.push({
                base64: req.body.base64,
                order: user.pictures.length
            });
            await user.save();
            return res.status(201).json();
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: err.message });
        }
    }

    /**
     * Sorts a picture for an user.
     * 
     * This method is a handler / endpoint :
     * - Method : `PATCH`
     * - URI : `/:id/pictures/:pictureId`
     * 
     * @param req Express request
     * @param res Express response
     * @async
     */
    public async sortPictureHandler(req: Request, res: Response): Promise<any> {
        try {
            const user = await this.container.db.users.findById(req.params.id);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            const pic = (<any> user.pictures).id(req.params.pictureId);
            if (!pic) {
                return res.status(404).json({ error: 'Picture not found' });
            }
            const order = req.body.order;
            if (order < 0 || order >= user.pictures.length) {
                return res.status(400).json({ error: `Invalid order, it must be between 0 and ${user.pictures.length}` });
            }
            user.pictures.map(otherPic => {
                if (otherPic.order === order) {
                    otherPic.order = pic.order;
                }
            });
            pic.order = order;
            await user.save();
            return res.status(200).json();
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: err.message });
        }
    }

    /**
     * Deletes a picture for an user.
     * 
     * This method is a handler / endpoint :
     * - Method : `DELETE`
     * - URI : `/:id/pictures/:pictureId`
     * 
     * @param req Express request
     * @param res Express response
     * @async
     */
    public async deletePictureHandler(req: Request, res: Response): Promise<any> {
        try {
            const user = await this.container.db.users.findById(req.params.id);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            const pic = (<any> user.pictures).id(req.params.pictureId);
            if (!pic) {
                return res.status(404).json({ error: 'Picture not found' });
            }
            _.remove(user.pictures, currentPic => currentPic === pic);
            user.pictures.filter(anotherPic => anotherPic.order > pic.order).map(anotherPic => {
                anotherPic.order--;
                return anotherPic;
            });
            user.markModified('pictures');
            await user.save();
            return res.status(204).json();
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: err.message });
        }
    }
}