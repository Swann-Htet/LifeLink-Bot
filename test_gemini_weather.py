"""
Quick test for Gemini-powered weather recommendations
"""

from weather_service import WeatherAlertService

# Initialize service
print("Initializing Weather Service with Gemini AI...")
service = WeatherAlertService()

# Get weather for New York
print("\n📍 Testing: New York")
weather = service.get_weather("New York")
print(f"Temperature: {weather['temperature']}°F")
print(f"Condition: {weather['condition']}")
print(f"Humidity: {weather['humidity']}%")

# Get AI recommendation
print("\n🤖 AI Recommendation:")
recommendation = service.get_weather_recommendation(weather)
print(recommendation)

# Test another city
print("\n" + "="*50)
print("📍 Testing: London")
weather = service.get_weather("London")
print(f"Temperature: {weather['temperature']}°F")
print(f"Condition: {weather['condition']}")

print("\n🤖 AI Recommendation:")
recommendation = service.get_weather_recommendation(weather)
print(recommendation)

print("\n✓ All tests completed successfully!")
