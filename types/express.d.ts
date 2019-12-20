import { TokenData } from '../src/services/authentication-service';
import { UserInstance } from '../src/models/user-model';

declare module 'express' {

    export interface Response {
        locals: {
            tokenData: TokenData;
            user: UserInstance;
        }
    }
}