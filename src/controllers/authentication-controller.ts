import Controller from './controller';
import ServiceContainer from '../services/service-container';
import { Request, Response } from 'express';

/**
 * Authentication controller.
 */
export default class AuthenticationController extends Controller {

    /**
     * Creates a new authentication controller.
     * 
     * @param container Services container
     */
    public constructor(container: ServiceContainer) {
        super(container, '/auth');
        this.signupHandler = this.signupHandler.bind(this);
        this.signinHandler = this.signinHandler.bind(this);
        this.registerEndpoint({ method: 'POST', uri: '/signup', handlers: [this.signupHandler], description: 'Signup / Register' });
        this.registerEndpoint({ method: 'GET', uri: '/signin', handlers: [this.signinHandler], description: 'Signin / Login' });
    }

    /**
     * Signup / Register.
     * 
     * This method is a handler / endpoint :
     * - Method : `POST`
     * - URI : `/signup`
     * 
     * @param req Express request
     * @param res Express response
     * @async
     */
    public async signupHandler(req: Request, res: Response): Promise<any> {
        try {
            const user = await this.container.db.users.create({
                email: req.body.email,
                name: req.body.name,
                password: req.body.password,
                gender: req.body.gender,
                birth: req.body.birth,
                description: req.body.description,
                localization: req.body.localization
            });
            const token = await this.container.auth.encodeToken({ userId: user.id }, process.env.TOKEN_KEY, Number(process.env.TOKEN_EXP));
            return res.status(201).json({ token });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: err.message });
        }
    }

    /**
     * Signin / Login.
     * 
     * This method is a handler / endpoint :
     * - Method : `GET`
     * - URI : `/signin`
     * 
     * @param req Express request
     * @param res Express response
     * @async
     */
    public async signinHandler(req: Request, res: Response): Promise<any> {
        try {
            const user = await this.container.db.users.findOne({ email: req.body.email }, { password: 1 });
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            if (!await this.container.auth.compare(req.body.password, user.password)) {
                return res.status(401).json({ error: 'Invalid password' });
            }
            const token = await this.container.auth.encodeToken({ userId: user.id }, process.env.TOKEN_KEY, Number(process.env.TOKEN_EXP));
            return res.status(200).json({ token });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: err.message });
        }
    }
}