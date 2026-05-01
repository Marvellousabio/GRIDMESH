import axios from 'axios';

/**
 * AI Service for GridMesh demand prediction
 */

/**
 * Fetch current weather data from Open-Meteo API
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {Object} Weather data or null if error
 */
export const fetchWeather = async (lat, lng) => {
  try {
    const response = await axios.get('https://api.open-meteo.com/v1/forecast', {
      params: {
        latitude: lat,
        longitude: lng,
        current_weather: true,
      },
      timeout: 5000, // 5 second timeout
    });

    return response.data.current_weather;
  } catch (error) {
    console.error('Error fetching weather:', error.message);
    return null;
  }
};

/**
 * Generate demand prediction based on weather and time
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {Date} dateTime - Date and time for prediction (optional, defaults to now)
 * @returns {Object} Prediction result
 */
export const predictDemand = async (lat, lng, dateTime = new Date()) => {
  try {
    // Fetch weather data
    const weather = await fetchWeather(lat, lng);
    
    if (!weather) {
      return {
        demand_score: 50,
        suggested_price_per_kwh: 0.15,
        insight: 'Unable to fetch weather data. Using default values.'
      };
    }

    // Extract weather data
    const { cloudcover } = weather;
    const hour = dateTime.getHours();

    // Base demand score
    let demand_score = 40;

    // Time-based demand (higher at night 18:00-23:00)
    if (hour >= 18 && hour <= 23) {
      demand_score += 30;
    } else if (hour >= 6 && hour <= 12) {
      demand_score += 10; // Morning peak
    }

    // Weather-based demand (higher with cloud cover)
    demand_score += (cloudcover / 10); // Cloud cover 0-100, add up to 10

    // Cap at 100
    demand_score = Math.min(100, Math.max(0, demand_score));

    // Suggested price based on demand
    const basePrice = 0.12;
    const priceIncrease = (demand_score / 100) * 0.08; // Up to +8 cents
    const suggested_price_per_kwh = Math.round((basePrice + priceIncrease) * 100) / 100;

    // Generate insight text
    let insight = `Demand score: ${demand_score}/100. `;
    
    if (hour >= 18 && hour <= 23) {
      insight += 'High demand due to evening hours. ';
    }
    
    if (cloudcover > 50) {
      insight += `Cloud cover at ${cloudcover}% may increase energy needs. `;
    } else {
      insight += `Clear skies (${cloudcover}% cloud cover) suggest lower demand. `;
    }

    insight += `Suggested price: $${suggested_price_per_kwh}/kWh.`;

    return {
      demand_score: Math.round(demand_score),
      suggested_price_per_kwh,
      insight
    };

  } catch (error) {
    console.error('Error in demand prediction:', error);
    return {
      demand_score: 50,
      suggested_price_per_kwh: 0.15,
      insight: 'Error occurred during prediction. Using default values.'
    };
  }
};