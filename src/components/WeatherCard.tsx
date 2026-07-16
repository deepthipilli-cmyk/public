import { Wind, Droplets } from "lucide-react";
import { getWeatherInfo } from "../utils/weather";
import { motion } from "motion/react";
import type { WeatherData } from "../types";

interface WeatherCardProps {
  location: string;
  data: WeatherData['current'];
}

export function WeatherCard({ location, data }: WeatherCardProps) {
  const info = getWeatherInfo(data.weatherCode);
  const Icon = info.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center md:items-start justify-between gap-8 w-full max-w-4xl mx-auto"
    >
      <div className="flex flex-col items-center md:items-start text-center md:text-left">
        <h2 className="text-2xl font-semibold text-slate-800 mb-1">{location}</h2>
        <p className="text-slate-500 font-medium mb-6">{info.label}</p>
        <div className="text-7xl font-bold tracking-tighter text-slate-900 mb-4">
          {Math.round(data.temperature)}°
        </div>
      </div>
      
      <div className="flex flex-col items-center justify-center gap-6">
        <Icon size={96} strokeWidth={1} className={`drop-shadow-md ${info.color}`} />
        <div className="flex items-center gap-6 text-slate-500 text-sm font-medium">
          <div className="flex items-center gap-2">
            <Wind size={18} className="text-slate-400" />
            <span>{data.windSpeed} km/h</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
