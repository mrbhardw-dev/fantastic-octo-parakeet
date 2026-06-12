import { Sun, Cloud, CloudRain, CloudSnow, CloudLightning, Droplets, Wind } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

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

export default async function WeatherWidget() {
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
        title="Full Kildare forecast on Met Éireann"
        className="inline-flex items-center gap-2.5 rounded-full border border-border bg-card px-4 py-1.5 text-sm shadow-sm hover:border-primary/40 hover:shadow-md transition-all duration-150 cursor-pointer"
        aria-label={`Current weather in Kilcock: ${Math.round(temperature_2m)}°C, ${label}, wind ${Math.round(windspeed_10m)} km/h`}
      >
        <Icon size={15} className="text-primary shrink-0" aria-hidden="true" />
        <span className="font-semibold text-foreground">{Math.round(temperature_2m)}°C</span>
        <span className="text-muted-foreground">{label}</span>
        <span className="hidden sm:inline text-muted-foreground border-l border-border pl-2.5">
          <Wind size={12} className="inline mr-1" aria-hidden="true" />
          {Math.round(windspeed_10m)} km/h
        </span>
      </a>
    )
  } catch {
    return null
  }
}
