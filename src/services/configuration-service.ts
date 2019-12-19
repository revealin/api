import * as fs from 'fs';
import Service from './service';
import ServiceContainer from './service-container';

export default class ConfigurationService extends Service {

    public constructor(container: ServiceContainer) {
        super(container);
    }

    /**
     * Loads a configuration file.
     * 
     * @param path Path to configuration file
     * @param type Configuration type
     * @async
     */
    public async load<T>(path: string, type: 'JSON'): Promise<T> {
        return new Promise((resolve, reject) => {
            fs.readFile(path, 'utf-8', (err, data) => {
                if (err) {
                    return reject(err);
                }
                switch (type) {
                    case 'JSON': return resolve(JSON.parse(data));
                    default: return reject(new ConfigurationError(`Configuration type "${type}" is not supported`));
                }
            });
        });
    }

    /**
     * Loads a configuration file synchronously.
     * 
     * @param path Path to configuration file
     * @param type Configuration type
     */
    public loadSync<T>(path: string, type: 'JSON'): T {
        switch (type) {
            case 'JSON': return <T> JSON.parse(fs.readFileSync(path, 'utf-8'));
            default: throw new ConfigurationError(`Configuration type "${type}" is not supported`);
        }
    }
}

/**
 * Configuration error class.
 */
export class ConfigurationError extends Error {

    /**
     * Creates a new configuration error.
     * 
     * @param msg Error message
     */
    public constructor(msg: string) {
        super(msg);
    }
}