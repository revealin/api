import Service from './service';
import ServiceContainer from './service-container';

/**
 * Geolocation service class.
 * 
 * This service contains useful methods for geolocation.
 */
export default class GeolocationService extends Service {

    /**
     * Creates a new geolocation service.
     * 
     * @param container Services container
     */
    public constructor(container: ServiceContainer) {
        super(container);
    }

    /**
     * Gets the distance between two positions.
     * 
     * @param lat1 Latitude for position 1
     * @param lon1 Longitude for position 1
     * @param lat2 Latitude for position 2
     * @param lon2 Longitude for position 2
     * @returns Distance between these two positions in meters
     */
    public distance(lat1: number, lon1: number, lat2: number, lon2: number): number {
        const earthRadius = 6371000;
        const dLat = this.degToRad(lat2 - lat1);
        const dLon = this.degToRad(lon2 - lon1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(this.degToRad(lat1)) * Math.cos(this.degToRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const dist = earthRadius * c;
        return dist;
    }

    /**
     * Converts degrees to radians.
     * 
     * @param value Value in degrees to convert
     * @returns Value converted in radians
     */
    private degToRad(value: number): number {
        return value * Math.PI / 180; 
    }
}