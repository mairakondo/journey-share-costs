import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudHail,
  CloudLightning,
  CloudRain,
  CloudRainWind,
  CloudSnow,
  CloudSun,
  Sun,
  type LucideIcon,
} from "lucide-react";

// WMO weather codes (https://open-meteo.com/en/docs), mapped to the
// closest available lucide icon plus a short label.
export function weatherCodeInfo(code: number): { Icon: LucideIcon; label: string } {
  if (code === 0) return { Icon: Sun, label: "Clear" };
  if (code === 1 || code === 2) return { Icon: CloudSun, label: "Partly cloudy" };
  if (code === 3) return { Icon: Cloud, label: "Overcast" };
  if (code === 45 || code === 48) return { Icon: CloudFog, label: "Foggy" };
  if (code >= 51 && code <= 57) return { Icon: CloudDrizzle, label: "Drizzle" };
  if (code === 61 || code === 63 || code === 80) return { Icon: CloudRain, label: "Rain" };
  if (code === 65 || code === 66 || code === 67 || code === 81 || code === 82)
    return { Icon: CloudRainWind, label: "Heavy rain" };
  if (code >= 71 && code <= 77) return { Icon: CloudSnow, label: "Snow" };
  if (code === 85 || code === 86) return { Icon: CloudSnow, label: "Snow showers" };
  if (code === 96 || code === 99) return { Icon: CloudHail, label: "Thunderstorm & hail" };
  if (code === 95) return { Icon: CloudLightning, label: "Thunderstorm" };
  return { Icon: CloudSun, label: "Mixed" };
}
