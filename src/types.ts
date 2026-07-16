export interface WeatherData {
  current: {
    temperature: number;
    weatherCode: number;
    windSpeed: number;
    time: string;
  };
  daily: Array<{
    time: string;
    weatherCode: number;
    maxTemp: number;
    minTemp: number;
  }>;
}

export interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
}
