import { useState, useEffect } from "react";
import { SearchBar } from "./components/SearchBar";
import { WeatherCard } from "./components/WeatherCard";
import { ForecastList } from "./components/ForecastList";
import { RecommendationCard } from "./components/RecommendationCard";
import { fetchWeather, fetchRecommendations } from "./api";
import type { WeatherData, GeocodingResult } from "./types";
import { CloudSun } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [city, setCity] = useState<GeocodingResult | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [recommendation, setRecommendation] = useState<string | null>(null);
  
  const [isWeatherLoading, setIsWeatherLoading] = useState(false);
  const [isAILoading, setIsAILoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Default to a default city on mount just to show something nice, or wait for user input.
  // Let's wait for user input.

  const handleSelectCity = async (selectedCity: GeocodingResult) => {
    setCity(selectedCity);
    setError(null);
    setWeatherData(null);
    setRecommendation(null);
    setIsWeatherLoading(true);

    try {
      const wData = await fetchWeather(selectedCity.latitude, selectedCity.longitude);
      setWeatherData(wData);
      setIsWeatherLoading(false);
      
      setIsAILoading(true);
      try {
        const aiRec = await fetchRecommendations(selectedCity.name, wData);
        setRecommendation(aiRec);
      } catch (err) {
        console.error("Failed to fetch AI recommendation:", err);
      } finally {
        setIsAILoading(false);
      }
    } catch (err) {
      console.error("Failed to fetch weather:", err);
      setError("Failed to fetch weather data. Please try again.");
      setIsWeatherLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col p-4 sm:p-8 md:p-12">
      <header className="mb-12 flex flex-col items-center justify-center text-center">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-indigo-600 p-2.5 rounded-2xl shadow-sm">
            <CloudSun size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Weather Intelligence</h1>
        </div>
        
        <SearchBar onSelect={handleSelectCity} />
      </header>

      <main className="flex-1 w-full max-w-4xl mx-auto flex flex-col gap-8">
        {isWeatherLoading && (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <div className="h-8 w-8 border-2 border-slate-200 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
            <p>Fetching weather data...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-center text-sm font-medium">
            {error}
          </div>
        )}

        <AnimatePresence mode="wait">
          {!isWeatherLoading && weatherData && city && (
            <motion.div
              key={city.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-8 w-full"
            >
              <WeatherCard location={city.name} data={weatherData.current} />
              <ForecastList daily={weatherData.daily} />
              <RecommendationCard recommendation={recommendation} isLoading={isAILoading} />
            </motion.div>
          )}
          
          {!isWeatherLoading && !weatherData && !error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 text-slate-400 text-center max-w-sm mx-auto"
            >
              <CloudSun size={48} className="mb-4 text-slate-300" strokeWidth={1} />
              <p className="text-lg text-slate-500">Search for a city above to see the forecast and get AI-powered recommendations.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
