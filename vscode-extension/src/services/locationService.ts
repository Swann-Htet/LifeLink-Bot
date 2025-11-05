import axios from 'axios';

export class LocationService {
    private ipApiUrl: string = 'http://ip-api.com/json';

    async detectLocation(): Promise<string> {
        try {
            // Try to get location from IP geolocation
            const response = await axios.get(this.ipApiUrl);
            const data = response.data;

            if (data.status === 'success') {
                return data.city || data.regionName || data.country;
            }

            // Fallback to default location
            return 'New York';
        } catch (error) {
            console.error('Failed to detect location:', error);
            return 'New York';
        }
    }

    async getLocationFromCoordinates(latitude: number, longitude: number): Promise<string> {
        try {
            // Use reverse geocoding with WeatherAPI
            return `${latitude},${longitude}`;
        } catch (error) {
            console.error('Failed to get location from coordinates:', error);
            return 'New York';
        }
    }
}
