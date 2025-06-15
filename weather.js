/**
 * Fetches weather data for a given city using Open-Meteo APIs.
 * @param {string} city - The name of the city to look up.
 * @returns {Promise<Object>} A promise resolving to an object with city, temperature (F), and description.
 */
async function getWeatherByCity(city) {
    try {
      // Step 1: Get coordinates from city name using Geocoding API
      const geocodeUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
  
      const geoResponse = await fetch(geocodeUrl);
  
      if (!geoResponse.ok) {
        throw new Error(`Geocoding API error: ${geoResponse.status}`);
      }
  
      const geoData = await geoResponse.json();
  
      if (!geoData.results || geoData.results.length === 0) {
        throw new Error("City not found. Please check the spelling.");
      }
  
      const { latitude, longitude } = geoData.results[0];
  
      // Step 2: Get current weather using the Weather API
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&temperature_unit=fahrenheit`;
  
      const weatherResponse = await fetch(weatherUrl);
  
      if (!weatherResponse.ok) {
        throw new Error(`Weather API error: ${weatherResponse.status}`);
      }
  
      const weatherData = await weatherResponse.json();
  
      const currentWeather = weatherData.current_weather;
  
      return {
        city: geoData.results[0].name,
        temperature: currentWeather.temperature,
        description: getWeatherDescription(currentWeather.weathercode)
      };
  
    } catch (error) {
      console.error("Error fetching weather:", error);
      throw error;
    }
  }
  
  /**
   * Converts weather code to a human-readable description.
   * @param {number} code - Weather code from Open-Meteo
   * @returns {string}
   */
  function getWeatherDescription(code) {
    // Simplified mapping based on Open-Meteo codes
    const descriptions = {
      0: "Clear sky",
      1: "Mainly clear",
      2: "Partly cloudy",
      3: "Overcast",
      45: "Fog",
      48: "Depositing rime fog",
      51: "Light drizzle",
      53: "Moderate drizzle",
      55: "Dense drizzle",
      61: "Slight rain",
      63: "Moderate rain",
      65: "Heavy rain",
      71: "Slight snow fall",
      73: "Moderate snow fall",
      75: "Heavy snow fall",
      80: "Rain showers",
      81: "Heavy rain showers",
      82: "Violent rain showers",
      95: "Thunderstorm"
    };
    return descriptions[code] || "Unknown weather";
  }
  
  /**
   * Function called when user clicks the button in the HTML
   */
  async function fetchAndDisplayWeather() {
    const city = document.getElementById("cityInput").value.trim();
    const resultDiv = document.getElementById("result");
  
    if (!city) {
      resultDiv.innerHTML = "<p>Please enter a city name.</p>";
      return;
    }
  
    resultDiv.innerHTML = '<p class="loading">Loading...</p>';
  
    try {
      const weather = await getWeatherByCity(city);
      resultDiv.innerHTML = `
        <div class="weather-card">
          <h2>${weather.city}</h2>
          <p>🌡 Temperature: ${weather.temperature}°F</p>
          <p>🌤 Condition: ${weather.description}</p>
        </div>
      `;
    } catch (error) {
      resultDiv.innerHTML = `<p class="error-message">${error.message}</p>`;
    }
  } 

//   For testing purposes
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { getWeatherByCity, getWeatherDescription };
  
}