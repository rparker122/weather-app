import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Cloud, CloudRain, CloudSnow, Sun, CloudLightning, CloudFog, Wind } from "lucide-react"

interface WeatherData {
  name: string
  main: {
    temp: number
    feels_like: number
    humidity: number
    pressure: number
  }
  weather: {
    main: string
    description: string
  }[]
  wind: {
    speed: number
  }
  sys: {
    country: string
  }
}

interface WeatherDisplayProps {
  weatherData: WeatherData
  isFahrenheit: boolean
}

export default function WeatherDisplay({ weatherData, isFahrenheit }: WeatherDisplayProps) {
  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "clear":
        return <Sun className="h-12 w-12 text-yellow-400" />
      case "clouds":
        return <Cloud className="h-12 w-12 text-gray-400" />
      case "rain":
      case "drizzle":
        return <CloudRain className="h-12 w-12 text-blue-400" />
      case "snow":
        return <CloudSnow className="h-12 w-12 text-white" />
      case "thunderstorm":
        return <CloudLightning className="h-12 w-12 text-yellow-500" />
      case "mist":
      case "fog":
        return <CloudFog className="h-12 w-12 text-gray-300" />
      default:
        return <Wind className="h-12 w-12 text-gray-400" />
    }
  }

  const tempUnit = isFahrenheit ? "°F" : "°C"
  const windSpeedUnit = isFahrenheit ? "mph" : "m/s"

  return (
    <Card className="w-full max-w-md bg-white/20 backdrop-blur-md text-white border-white/30">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>
            {weatherData.name}, {weatherData.sys.country}
          </span>
          <span className="text-3xl font-bold">
            {Math.round(weatherData.main.temp)}
            {tempUnit}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            {getWeatherIcon(weatherData.weather[0].main)}
            <span className="ml-2 capitalize">{weatherData.weather[0].description}</span>
          </div>
          <span>
            Feels like: {Math.round(weatherData.main.feels_like)}
            {tempUnit}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/10 p-3 rounded-lg">
            <p className="text-sm text-white/70">Humidity</p>
            <p className="text-xl font-semibold">{weatherData.main.humidity}%</p>
          </div>
          <div className="bg-white/10 p-3 rounded-lg">
            <p className="text-sm text-white/70">Wind Speed</p>
            <p className="text-xl font-semibold">
              {weatherData.wind.speed} {windSpeedUnit}
            </p>
          </div>
          <div className="bg-white/10 p-3 rounded-lg">
            <p className="text-sm text-white/70">Pressure</p>
            <p className="text-xl font-semibold">{weatherData.main.pressure} hPa</p>
          </div>
          <div className="bg-white/10 p-3 rounded-lg">
            <p className="text-sm text-white/70">Updated</p>
            <p className="text-xl font-semibold">{new Date().toLocaleTimeString()}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

