"""
Test Weather Alert Service
Run this to see the weather alert functionality in action
"""

from weather_service import WeatherAlertService
import time

def test_weather_service():
    """Test the weather alert service"""
    print("=" * 70)
    print("LIFELINK WEATHER ALERT SERVICE - TEST")
    print("=" * 70)
    print()
    
    # Initialize service
    print("Initializing weather service...")
    service = WeatherAlertService()
    print("✓ Service initialized\n")
    
    # Test different locations
    test_locations = [
        "New York",
        "London",
        "Tokyo",
        "Seattle"
    ]
    
    for location in test_locations:
        print("=" * 70)
        print(f"Testing: {location}")
        print("=" * 70)
        
        # Get weather alert
        alert = service.get_weather_alert(location)
        
        if alert['success']:
            print(alert['message'])
            print()
            
            # Display raw data
            print("Raw Weather Data:")
            print(f"  - Temperature: {alert['weather']['temperature']}°F")
            print(f"  - Condition: {alert['weather']['condition']}")
            print(f"  - Humidity: {alert['weather']['humidity']}%")
            print(f"  - Wind: {alert['weather']['wind_speed']} mph")
            
            if alert['weather'].get('is_mock'):
                print("  ⚠️  Note: Using mock data (no API key configured)")
        else:
            print(f"❌ Error: {alert.get('error')}")
        
        print()
        time.sleep(1)  # Small delay between requests
    
    print("=" * 70)
    print("TEST COMPLETE")
    print("=" * 70)
    print()
    print("Weather data is now using WeatherAPI.com!")
    print("Default API key is already configured.")
    print()
    print("To use your own API key:")
    print("1. Sign up for free API key at: https://www.weatherapi.com/my/")
    print("2. Add to .env file: WEATHERAPI_KEY=your_key_here")
    print("3. Free tier: 1,000,000 calls/month")
    print()

if __name__ == "__main__":
    test_weather_service()
