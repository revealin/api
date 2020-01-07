import Service from './service';
import ServiceContainer from './service-container';

/**
 * Pictures service class.
 * 
 * This service contains useful methods for user pictures.
 */
export default class PictureService extends Service {

    /**
     * Creates a new pictures service.
     * 
     * @param container Services container
     */
    public constructor(container: ServiceContainer) {
        super(container);
    }

    /**
     * Gets the size of a picture in base64.
     * 
     * @param base64 Picture in base64
     * @returns Size of picture in bytes
     */
    public size(base64: string): number {
        if (!base64.startsWith('data:image')) {
            throw new PictureError('Malformed base64');
        }
        return Buffer.from(base64.substring(base64.indexOf(',') + 1)).length;
    }
}

/**
 * Pictures error class.
 */
class PictureError extends Error {

    /**
     * Creates a new pictures error.
     * 
     * @param msg Error message
     */
    public constructor(msg: string) {
        super(msg);
    }
}