import { getWeatherInfo } from "../utils/weather";
import { motion } from "motion/react";
import type { WeatherData } from "../types";

interface ForecastListProps {
  daily: WeatherData['daily'];
}

export function ForecastList({ daily }: ForecastListProps) {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <h3 className="text-lg font-semibold text-slate-800 mb-4 px-2">7-Day Forecast</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {daily.map((day, i) => {
          const info = getWeatherInfo(day.weatherCode);
          const Icon = info.icon;
          const date = new Date(day.time);
          const isToday = i === 0;

          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              key={day.time}
              className={`flex flex-col items-center p-4 rounded-2xl border ${
                isToday ? 'bg-indigo-50 border-indigo-100' : 'bg-white border-slate-100'
              }`}
            >
              <span className={`text-xs font-medium mb-1 ${isToday ? 'text-indigo-600' : 'text-slate-500'}`}>
                {isToday ? 'Today' : date.toLocaleDateString(undefined, { weekday: 'short' })}
              </span>
              <Icon size={28} strokeWidth={1.5} className={`my-3 ${info.color}`} />
              <div className="flex items-center gap-2 text-sm">
                <span className="font-semibold text-slate-800">{Math.round(day.maxTemp)}°</span>
                <span className="text-slate-400">{Math.round(day.minTemp)}°</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
