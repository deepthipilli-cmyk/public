import { 
  Sun, 
  Cloud, 
  CloudRain, 
  CloudLightning, 
  CloudSnow, 
  CloudDrizzle, 
  CloudFog, 
  CloudSun,
  type LucideIcon
} from 'lucide-react';

export function getWeatherInfo(code: number): { label: string; icon: LucideIcon; color: string } {
  // WMO Weather interpretation codes (WW)
  if (code === 0) {
    return { label: 'Clear sky', icon: Sun, color: 'text-amber-500' };
  }
  if (code === 1) {
    return { label: 'Mainly clear', icon: CloudSun, color: 'text-amber-400' };
  }
  if (code === 2) {
    return { label: 'Partly cloudy', icon: CloudSun, color: 'text-gray-400' };
  }
  if (code === 3) {
    return { label: 'Overcast', icon: Cloud, color: 'text-gray-500' };
  }
  if (code === 45 || code === 48) {
    return { label: 'Fog', icon: CloudFog, color: 'text-gray-400' };
  }
  if (code === 51 || code === 53 || code === 55 || code === 56 || code === 57) {
    return { label: 'Drizzle', icon: CloudDrizzle, color: 'text-blue-400' };
  }
  if (code === 61 || code === 63 || code === 65 || code === 66 || code === 67) {
    return { label: 'Rain', icon: CloudRain, color: 'text-blue-500' };
  }
  if (code === 71 || code === 73 || code === 75 || code === 77) {
    return { label: 'Snow', icon: CloudSnow, color: 'text-sky-300' };
  }
  if (code === 80 || code === 81 || code === 82) {
    return { label: 'Rain showers', icon: CloudRain, color: 'text-blue-600' };
  }
  if (code === 85 || code === 86) {
    return { label: 'Snow showers', icon: CloudSnow, color: 'text-sky-400' };
  }
  if (code === 95 || code === 96 || code === 99) {
    return { label: 'Thunderstorm', icon: CloudLightning, color: 'text-purple-500' };
  }
  
  return { label: 'Unknown', icon: Cloud, color: 'text-gray-400' };
}
