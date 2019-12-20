declare namespace NodeJS {

    export interface ProcessEnv {
        API_PORT: string;
        DB_HOST: string;
        DB_PORT: string;
        DB_NAME: string;
        WEB_SOCKET_PORT: string;
        TOKEN_KEY: string;
        TOKEN_EXP: string;
        HASH_SALT: string;
    }
}