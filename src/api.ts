import { getWeatherInfo } from './utils/weather';

export async function searchCities(query: string) {
  if (!query || query.length < 2) return [];
  
  try {
    const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`);
    const data = await res.json();
    return data.results || [];
  } catch (error) {
    console.error("Error searching cities:", error);
    return [];
  }
}

export async function fetchWeather(lat: number, lon: number) {
  try {
    const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`);
    const data = await res.json();
    return {
      current: {
        temperature: data.current.temperature_2m,
        weatherCode: data.current.weather_code,
        windSpeed: data.current.wind_speed_10m,
        time: data.current.time,
      },
      daily: data.daily.time.map((time: string, index: number) => ({
        time,
        weatherCode: data.daily.weather_code[index],
        maxTemp: data.daily.temperature_2m_max[index],
        minTemp: data.daily.temperature_2m_min[index],
      })),
    };
  } catch (error) {
    console.error("Error fetching weather:", error);
    throw error;
  }
}

export async function fetchRecommendations(locationName: string, weatherData: any) {
  try {
    const formattedData = {
      location: locationName,
      current: {
        temperature: weatherData.current.temperature,
        condition: getWeatherInfo(weatherData.current.weatherCode).label,
        windSpeed: weatherData.current.windSpeed,
      },
      daily: weatherData.daily.map((day: any) => ({
        date: new Date(day.time).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }),
        condition: getWeatherInfo(day.weatherCode).label,
        maxTemp: day.maxTemp,
        minTemp: day.minTemp,
      })).slice(0, 7)
    };

    const res = await fetch('/api/recommendations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formattedData),
    });

    if (!res.ok) {
      throw new Error('Failed to fetch recommendations');
    }

    const data = await res.json();
    return data.recommendation;
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    throw error;
  }
}
