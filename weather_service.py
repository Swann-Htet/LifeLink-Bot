"""
Weather Alert Service for LifeLink Chatbot
Provides weather information with AI-powered recommendations
"""

import os
import requests
from datetime import datetime
from dotenv import load_dotenv

# Optional: Google Gemini AI for enhanced recommendations
try:
    import google.generativeai as genai  # type: ignore
    GEMINI_AVAILABLE = True
except ImportError:
    GEMINI_AVAILABLE = False
    genai = None  # type: ignore

load_dotenv()

class WeatherAlertService:
    def __init__(self):
        """Initialize weather service with API keys"""
        # WeatherAPI.com (free tier available)
        self.weather_api_key = os.getenv('WEATHERAPI_KEY', 'cf1c17e3399549eb9a5111316250411')
        self.weather_api_url = "http://api.weatherapi.com/v1/current.json"
        
        # Initialize Gemini for AI recommendations (if available)
        self.gemini_available = False
        if GEMINI_AVAILABLE:
            self.gemini_api_key = os.getenv('GEMINI_API_KEY')
            if self.gemini_api_key:
                try:
                    genai.configure(api_key=self.gemini_api_key)  # type: ignore
                    self.gemini_model = genai.GenerativeModel('gemini-2.0-flash-exp')  # type: ignore
                    self.gemini_available = True
                    print("✓ Weather AI recommendations enabled (Gemini)")
                except Exception as e:
                    print(f"Warning: Gemini for weather recommendations unavailable: {e}")
                    self.gemini_available = False
        else:
            print("ℹ Google Gemini not installed. Using rule-based recommendations.")
    
    def get_weather(self, location="New York"):
        """
        Get current weather for a location
        
        Args:
            location: City name or coordinates
        
        Returns:
            dict: Weather data with conditions and temperature
        """
        try:
            if not self.weather_api_key:
                return self._get_mock_weather(location)
            
            params = {
                'key': self.weather_api_key,
                'q': location,
                'aqi': 'no'  # Air quality index not needed
            }
            
            response = requests.get(self.weather_api_url, params=params, timeout=5)
            response.raise_for_status()
            data = response.json()
            
            return {
                'success': True,
                'location': data['location']['name'],
                'country': data['location']['country'],
                'temperature': round(data['current']['temp_f']),
                'feels_like': round(data['current']['feelslike_f']),
                'condition': data['current']['condition']['text'],
                'description': data['current']['condition']['text'].lower(),
                'humidity': data['current']['humidity'],
                'wind_speed': round(data['current']['wind_mph']),
                'timestamp': datetime.now().isoformat(),
                'is_mock': False
            }
        
        except requests.exceptions.RequestException as e:
            print(f"Weather API error: {e}")
            return self._get_mock_weather(location)
        except Exception as e:
            print(f"Weather service error: {e}")
            return {'success': False, 'error': str(e)}
    
    def _get_mock_weather(self, location):
        """Fallback mock weather data for demo purposes"""
        import random
        conditions = [
            ('Rainy', 'light rain', 65, 80),
            ('Sunny', 'clear sky', 75, 50),
            ('Cloudy', 'overcast clouds', 68, 65),
            ('Snowy', 'light snow', 32, 75),
            ('Stormy', 'thunderstorm', 55, 85),
            ('Foggy', 'mist', 60, 90)
        ]
        
        condition, desc, temp, humidity = random.choice(conditions)
        
        return {
            'success': True,
            'location': location,
            'country': 'US',
            'temperature': temp,
            'feels_like': temp - 2,
            'condition': condition,
            'description': desc,
            'humidity': humidity,
            'wind_speed': random.randint(5, 15),
            'timestamp': datetime.now().isoformat(),
            'is_mock': True
        }
    
    def get_weather_recommendation(self, weather_data):
        """
        Generate AI-powered recommendations based on weather
        
        Args:
            weather_data: Weather information dict
        
        Returns:
            str: AI-generated recommendations
        """
        if not weather_data.get('success'):
            return "Unable to generate recommendations due to weather data error."
        
        condition = weather_data['condition'].lower()
        temp = weather_data['temperature']
        description = weather_data['description']
        humidity = weather_data['humidity']
        wind_speed = weather_data['wind_speed']
        
        # If Gemini is available, get AI recommendations
        if self.gemini_available:
            try:
                prompt = f"""You are a helpful weather assistant. Based on the current weather conditions, provide personalized safety recommendations and tips.

Current Weather:
- Condition: {condition} ({description})
- Temperature: {temp}°F (feels like {weather_data['feels_like']}°F)
- Humidity: {humidity}%
- Wind Speed: {wind_speed} mph
- Location: {weather_data['location']}

Generate 3-4 practical, caring recommendations. Format:
- Start with an emoji
- Be conversational and friendly
- Include specific safety tips
- Mention appropriate clothing/gear
- Keep each tip to 1-2 sentences

Example:
☂️ Don't forget to bring an umbrella! The rain might catch you off guard.
🧥 Wear a waterproof jacket to stay dry and comfortable.
🚗 Drive carefully - roads may be slippery.

Your recommendations:"""
                
                response = self.gemini_model.generate_content(prompt)
                return response.text.strip()
            
            except Exception as e:
                print(f"Gemini recommendation error: {e}")
                return self._get_rule_based_recommendation(weather_data)
        
        else:
            return self._get_rule_based_recommendation(weather_data)
    
    def _get_rule_based_recommendation(self, weather_data):
        """Fallback rule-based recommendations"""
        condition = weather_data['condition'].lower()
        temp = weather_data['temperature']
        
        recommendations = []
        
        # Temperature-based recommendations
        if temp < 32:
            recommendations.append("🥶 It's freezing! Bundle up with warm layers and don't forget gloves and a hat.")
        elif temp < 50:
            recommendations.append("🧥 It's chilly outside. Wear a jacket or sweater to stay warm.")
        elif temp > 85:
            recommendations.append("🌡️ It's hot! Stay hydrated and wear light, breathable clothing.")
        
        # Condition-based recommendations
        if 'rain' in condition or 'drizzle' in condition:
            recommendations.append("☂️ Don't forget to take an umbrella! It's rainy outside.")
            recommendations.append("🚗 Drive carefully - roads may be slippery.")
        elif 'snow' in condition:
            recommendations.append("❄️ Snow alert! Wear waterproof boots and drive extra carefully.")
            recommendations.append("🧤 Don't forget warm gloves and a scarf.")
        elif 'storm' in condition or 'thunder' in condition:
            recommendations.append("⚡ Severe weather alert! Stay indoors if possible and avoid travel.")
            recommendations.append("📱 Keep your phone charged in case of emergency.")
        elif 'clear' in condition or 'sunny' in condition:
            recommendations.append("☀️ Beautiful weather today! Don't forget sunscreen if you'll be outside.")
        elif 'cloud' in condition:
            recommendations.append("☁️ Cloudy weather - perfect for outdoor activities without harsh sun.")
        elif 'fog' in condition or 'mist' in condition:
            recommendations.append("🌫️ Low visibility due to fog. Drive slowly and use headlights.")
        
        # Wind-based recommendations
        if weather_data['wind_speed'] > 20:
            recommendations.append("💨 High winds today! Secure loose objects outside.")
        
        return '\n'.join(recommendations) if recommendations else "Have a great day! Stay safe."
    
    def get_weather_alert(self, location="New York"):
        """
        Get complete weather alert with AI recommendations
        
        Args:
            location: City name
        
        Returns:
            dict: Complete weather alert package
        """
        weather_data = self.get_weather(location)
        
        if not weather_data.get('success'):
            return {
                'success': False,
                'error': weather_data.get('error', 'Unable to fetch weather')
            }
        
        recommendations = self.get_weather_recommendation(weather_data)
        
        # Format the alert message
        alert_message = f"""🌤️ **Weather Alert for {weather_data['location']}, {weather_data['country']}**

**Current Conditions:**
🌡️ Temperature: {weather_data['temperature']}°F (feels like {weather_data['feels_like']}°F)
{self._get_weather_emoji(weather_data['condition'])} Condition: {weather_data['description'].title()}
💧 Humidity: {weather_data['humidity']}%
💨 Wind Speed: {weather_data['wind_speed']} mph

**AI Recommendations:**
{recommendations}

━━━━━━━━━━━━━━━━━━━━━━━━
⏰ Updated: {datetime.now().strftime('%I:%M %p')}
🤖 AI-powered by LifeLink Weather Service"""
        
        return {
            'success': True,
            'message': alert_message,
            'weather': weather_data,
            'recommendations': recommendations
        }
    
    def _get_weather_emoji(self, condition):
        """Get appropriate emoji for weather condition"""
        condition_lower = condition.lower()
        emoji_map = {
            'clear': '☀️',
            'sunny': '☀️',
            'clouds': '☁️',
            'cloudy': '☁️',
            'rain': '🌧️',
            'rainy': '🌧️',
            'drizzle': '🌦️',
            'snow': '❄️',
            'snowy': '❄️',
            'storm': '⛈️',
            'thunderstorm': '⛈️',
            'fog': '🌫️',
            'mist': '🌫️'
        }
        
        for key, emoji in emoji_map.items():
            if key in condition_lower:
                return emoji
        
        return '🌤️'  # Default

if __name__ == "__main__":
    # Test the weather service
    print("Testing Weather Alert Service...")
    print("=" * 60)
    
    service = WeatherAlertService()
    
    # Test with different locations
    locations = ["New York", "London", "Tokyo"]
    
    for location in locations:
        print(f"\n{'='*60}")
        print(f"Testing: {location}")
        print('='*60)
        
        alert = service.get_weather_alert(location)
        
        if alert['success']:
            print(alert['message'])
        else:
            print(f"Error: {alert.get('error')}")
        
        print()
