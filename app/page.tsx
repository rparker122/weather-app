"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import WeatherDisplay from "@/components/weather-display"
import AnimatedBackground from "@/components/animated-background"

export default function WeatherApp() {
  const [city, setCity] = useState("London")
  const [searchQuery, setSearchQuery] = useState("")
  const [weatherData, setWeatherData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isFahrenheit, setIsFahrenheit] = useState(false)

  const API_KEY = "ab273f272beefcf20bcefe76b4dc3dce"

  const fetchWeatherData = async (cityName: string) => {
    setLoading(true)
    setError("")
    try {
      const units = isFahrenheit ? "imperial" : "metric"
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=${units}`,
      )
      if (!response.ok) throw new Error("City not found")
      const data = await response.json()
      setWeatherData(data)
    } catch (err) {
      setError("Failed to fetch weather data. Please try another city.")
      setWeatherData(null)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) setCity(searchQuery.trim())
  }

  const toggleTemperatureUnit = () => setIsFahrenheit((prev) => !prev)

  useEffect(() => {
    fetchWeatherData(city)
  }, [city, isFahrenheit])

  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      {/* Pass actual weather condition string to AnimatedBackground */}
      <AnimatedBackground weatherCondition={weatherData?.weather?.[0]?.main} />

      <div className="relative z-10 container mx-auto px-4 py-8 flex flex-col items-center">
        <h1 className="text-4xl font-bold text-white mb-8 mt-10 text-center drop-shadow-lg">
          Weather Forecast
        </h1>

        <form onSubmit={handleSearch} className="w-full max-w-md mb-4 flex gap-2">
          <Input
            type="text"
            placeholder="Enter city name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white/20 backdrop-blur-md text-white placeholder:text-white/70 border-white/30"
          />
          <Button type="submit" variant="secondary" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </form>

        <div className="w-full max-w-md mb-6 flex items-center justify-end">
          <div className="flex items-center space-x-2">
            <Label htmlFor="temperature-toggle" className="text-white">
              °C
            </Label>
            <Switch id="temperature-toggle" checked={isFahrenheit} onCheckedChange={toggleTemperatureUnit} />
            <Label htmlFor="temperature-toggle" className="text-white">
              °F
            </Label>
          </div>
        </div>

        {error && (
          <div className="w-full max-w-md p-4 mb-6 bg-red-500/80 backdrop-blur-md rounded-lg text-white">{error}</div>
        )}

        {loading ? (
          <div className="w-full max-w-md p-8 bg-white/20 backdrop-blur-md rounded-lg flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          </div>
        ) : (
          weatherData && <WeatherDisplay weatherData={weatherData} isFahrenheit={isFahrenheit} />
        )}
      </div>
    </main>
  )
}
