import urllib.request
import urllib.parse
import json

def fetch_weather(location: str):
    """
    Fetches the current weather for a specified location.
    Uses Open-Meteo's free geocoding and weather APIs.
    """
    try:
        # Step 1: Geocode the location name to get coordinates
        encoded_location = urllib.parse.quote(location)
        geocode_url = f"https://geocoding-api.open-meteo.com/v1/search?name={encoded_location}&count=1&language=en&format=json"
        
        # Fetch geocoding data
        with urllib.request.urlopen(geocode_url) as response:
            geocode_data = json.loads(response.read().decode())
            
        if not geocode_data.get("results"):
            return f"Could not find coordinates for location: {location}"
            
        result = geocode_data["results"][0]
        lat = result["latitude"]
        lon = result["longitude"]
        name = result["name"]
        country = result.get("country", "")
        
        # Step 2: Fetch the weather data using coordinates
        weather_url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current_weather=true"
        
        with urllib.request.urlopen(weather_url) as response:
            weather_data = json.loads(response.read().decode())
            
        current_weather = weather_data.get("current_weather", {})
        temperature = current_weather.get("temperature")
        windspeed = current_weather.get("windspeed")
        
        return f"Weather in {name}, {country}: {temperature}°C, Wind Speed: {windspeed} km/h."
        
    except Exception as e:
        return f"Error fetching weather data: {str(e)}"
