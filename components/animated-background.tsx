"use client"

import { useEffect, useRef } from "react"

interface AnimatedBackgroundProps {
  weatherCondition?: string
}

export default function AnimatedBackground({ weatherCondition = "clear" }: AnimatedBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas to full screen
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Background colors based on weather condition
    const getBackgroundColors = () => {
      switch (weatherCondition?.toLowerCase()) {
        case "clear":
          return {
            start: "#4A90E2",
            end: "#87CEEB",
          }
        case "clouds":
          return {
            start: "#7B8C9D",
            end: "#A9B7C6",
          }
        case "rain":
        case "drizzle":
          return {
            start: "#2C3E50",
            end: "#5D6D7E",
          }
        case "snow":
          return {
            start: "#BDC3C7",
            end: "#ECF0F1",
          }
        case "thunderstorm":
          return {
            start: "#1C2833",
            end: "#34495E",
          }
        default:
          return {
            start: "#4A90E2",
            end: "#87CEEB",
          }
      }
    }

    // Create gradient background
    const drawBackground = () => {
      const { start, end } = getBackgroundColors()
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      gradient.addColorStop(0, start)
      gradient.addColorStop(1, end)
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    // Create particles based on weather
    const particles: any[] = []

    const createParticles = () => {
      particles.length = 0

      const particleCount =
        weatherCondition?.toLowerCase() === "snow" ? 100 : weatherCondition?.toLowerCase() === "rain" ? 200 : 50

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size:
            weatherCondition?.toLowerCase() === "snow"
              ? Math.random() * 5 + 1
              : weatherCondition?.toLowerCase() === "rain"
                ? Math.random() * 2 + 1
                : Math.random() * 3 + 1,
          speedX: weatherCondition?.toLowerCase() === "clouds" ? Math.random() * 1 - 0.5 : 0,
          speedY:
            weatherCondition?.toLowerCase() === "snow"
              ? Math.random() * 1 + 0.5
              : weatherCondition?.toLowerCase() === "rain"
                ? Math.random() * 7 + 5
                : Math.random() * 0.5 + 0.1,
        })
      }
    }

    const drawParticles = () => {
      particles.forEach((p) => {
        ctx.beginPath()

        if (weatherCondition?.toLowerCase() === "rain" || weatherCondition?.toLowerCase() === "drizzle") {
          ctx.strokeStyle = "rgba(255, 255, 255, 0.7)"
          ctx.lineWidth = p.size / 2
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(p.x, p.y + p.size * 3)
          ctx.stroke()
        } else if (weatherCondition?.toLowerCase() === "snow") {
          ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fill()
        } else {
          // Clouds or default
          ctx.fillStyle = "rgba(255, 255, 255, 0.3)"
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fill()
        }

        // Update position
        p.x += p.speedX
        p.y += p.speedY

        // Reset if out of bounds
        if (p.y > canvas.height) {
          p.y = -10
          p.x = Math.random() * canvas.width
        }

        if (p.x > canvas.width) {
          p.x = 0
        } else if (p.x < 0) {
          p.x = canvas.width
        }
      })
    }

    // Create moving clouds
    const clouds: any[] = []

    const createClouds = () => {
      clouds.length = 0

      const cloudCount = 5

      for (let i = 0; i < cloudCount; i++) {
        clouds.push({
          x: Math.random() * canvas.width,
          y: (Math.random() * canvas.height) / 2,
          width: Math.random() * 200 + 100,
          height: Math.random() * 60 + 40,
          speed: Math.random() * 0.5 + 0.1,
        })
      }
    }

    const drawClouds = () => {
      if (weatherCondition?.toLowerCase() !== "clear") {
        clouds.forEach((cloud) => {
          ctx.fillStyle = "rgba(255, 255, 255, 0.3)"
          ctx.beginPath()
          ctx.ellipse(cloud.x, cloud.y, cloud.width / 2, cloud.height / 2, 0, 0, Math.PI * 2)
          ctx.fill()

          // Move cloud
          cloud.x += cloud.speed

          // Reset if out of bounds
          if (cloud.x - cloud.width > canvas.width) {
            cloud.x = -cloud.width
            cloud.y = (Math.random() * canvas.height) / 2
          }
        })
      }
    }

    // Initialize
    createParticles()
    createClouds()

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      drawBackground()
      drawClouds()
      drawParticles()
      requestAnimationFrame(animate)
    }

    animate()

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [weatherCondition])

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10" />
}

