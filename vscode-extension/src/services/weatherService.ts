import axios from 'axios';

export interface WeatherData {
    location: string;
    country: string;
    temperature: number;
    feels_like: number;
    condition: string;
    description: string;
    humidity: number;
    wind_speed: number;
    timestamp: string;
}

export class WeatherService {
    private apiKey: string;
    private apiUrl: string = 'https://api.openweathermap.org/data/2.5/weather';

    constructor() {
        // Get API key from VS Code configuration or use default
        this.apiKey = '20675ec7b741f24d43880522b9f1e2c9';
    }

    async getWeather(location: string): Promise<WeatherData> {
        try {
            const response = await axios.get(this.apiUrl, {
                params: {
                    q: location,
                    appid: this.apiKey,
                    units: 'imperial'
                }
            });

            const data = response.data;

            return {
                location: data.name,
                country: data.sys.country,
                temperature: Math.round(data.main.temp),
                feels_like: Math.round(data.main.feels_like),
                condition: data.weather[0].main,
                description: data.weather[0].description,
                humidity: data.main.humidity,
                wind_speed: Math.round(data.wind.speed),
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            throw new Error(`Failed to fetch weather: ${error}`);
        }
    }

    async getRecommendations(weather: WeatherData): Promise<string> {
        // Rule-based recommendations
        const recommendations: string[] = [];
        const condition = weather.condition.toLowerCase();
        const temp = weather.temperature;

        // Temperature-based recommendations
        if (temp < 32) {
            recommendations.push('🥶 It\'s freezing! Bundle up with warm layers and don\'t forget gloves and a hat.');
        } else if (temp < 50) {
            recommendations.push('🧥 It\'s chilly outside. Wear a jacket or sweater to stay warm.');
        } else if (temp > 85) {
            recommendations.push('🌡️ It\'s hot! Stay hydrated and wear light, breathable clothing.');
        }

        // Condition-based recommendations
        if (condition.includes('rain') || condition.includes('drizzle')) {
            recommendations.push('☂️ Don\'t forget to bring an umbrella! It\'s rainy outside.');
            recommendations.push('🚗 Drive carefully - roads may be slippery.');
        } else if (condition.includes('snow')) {
            recommendations.push('❄️ Snow alert! Wear waterproof boots and drive extra carefully.');
            recommendations.push('🧤 Don\'t forget warm gloves and a scarf.');
        } else if (condition.includes('storm') || condition.includes('thunder')) {
            recommendations.push('⚡ Severe weather alert! Stay indoors if possible and avoid travel.');
            recommendations.push('📱 Keep your phone charged in case of emergency.');
        } else if (condition.includes('clear') || condition.includes('sunny')) {
            recommendations.push('☀️ Beautiful weather today! Don\'t forget sunscreen if you\'ll be outside.');
        } else if (condition.includes('cloud')) {
            recommendations.push('☁️ Cloudy weather - perfect for outdoor activities without harsh sun.');
        } else if (condition.includes('fog') || condition.includes('mist')) {
            recommendations.push('🌫️ Low visibility due to fog. Drive slowly and use headlights.');
        }

        // Wind-based recommendations
        if (weather.wind_speed > 20) {
            recommendations.push('💨 High winds today! Secure loose objects outside.');
        }

        // Coding tips based on weather
        if (condition.includes('rain') || condition.includes('storm')) {
            recommendations.push('💻 Perfect weather for indoor coding! Make yourself comfortable.');
        } else if (condition.includes('sunny') && temp > 70 && temp < 80) {
            recommendations.push('🌳 Great weather! Consider coding outside or taking breaks for fresh air.');
        }

        return recommendations.join('\n') || 'Have a great day! Stay safe and code on! 💻';
    }
}
