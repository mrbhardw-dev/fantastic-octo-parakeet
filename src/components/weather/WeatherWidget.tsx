import { Sun, Cloud, CloudRain, CloudSnow, CloudLightning, Droplets, Wind } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface OpenMeteoResponse {
  current: {
    temperature_2m: number
    weathercode: number
    windspeed_10m: number
  }
}

function getWeather(code: number): { label: string; Icon: LucideIcon } {
  if (code === 0)  return { label: 'Clear sky',     Icon: Sun }
  if (code <= 3)   return { label: 'Partly cloudy', Icon: Cloud }
  if (code <= 48)  return { label: 'Foggy',          Icon: Cloud }
  if (code <= 55)  return { label: 'Drizzle',        Icon: Droplets }
  if (code <= 67)  return { label: 'Rain',            Icon: CloudRain }
  if (code <= 77)  return { label: 'Snow',            Icon: CloudSnow }
  if (code <= 82)  return { label: 'Rain showers',   Icon: CloudRain }
  return                  { label: 'Thunderstorm',   Icon: CloudLightning }
}

export default async function WeatherWidget({ className }: { className?: string }) {
  try {
    const res = await fetch(
      'https://api.open-meteo.com/v1/forecast?latitude=53.3956&longitude=-6.7817&current=temperature_2m,weathercode,windspeed_10m&timezone=Europe%2FDublin',
      { next: { revalidate: 1800 } },
    )
    if (!res.ok) return null
    const data: OpenMeteoResponse = await res.json()
    const { temperature_2m, weathercode, windspeed_10m } = data.current
    const { label, Icon } = getWeather(weathercode)

    return (
      <a
        href="https://www.met.ie/forecasts/county-forecast/results?id=KI"
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "bg-white border border-border px-4 py-2.5 rounded-full shadow-sm flex items-center gap-3 animate-float hover:shadow-md transition-shadow cursor-pointer",
          className
        )}
        aria-label={`Weather in Kilcock: ${Math.round(temperature_2m)}°C, ${label}`}
      >
        <Icon size={20} className="text-accent shrink-0" aria-hidden="true" />
        <div className="text-left">
          <p className="text-[10px] font-bold text-muted-foreground leading-none uppercase tracking-widest">Kilcock Now</p>
          <p className="text-sm font-bold text-foreground leading-none mt-1">
            {Math.round(temperature_2m)}°C · {label}
          </p>
        </div>
      </a>
    )
  } catch {
    return null
  }
}
