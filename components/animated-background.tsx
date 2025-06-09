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

    // Resize canvas to fill window
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    const lowerCond = weatherCondition.toLowerCase()

    // Background colors based on weather condition
    const getBackgroundColors = () => {
      switch (lowerCond) {
        case "clear":
          return { start: "#4A90E2", end: "#87CEEB" }
        case "clouds":
          return { start: "#7B8C9D", end: "#A9B7C6" }
        case "rain":
        case "drizzle":
          return { start: "#2C3E50", end: "#5D6D7E" }
        case "snow":
          return { start: "#BDC3C7", end: "#ECF0F1" }
        case "thunderstorm":
          return { start: "#1C2833", end: "#34495E" }
        default:
          return { start: "#4A90E2", end: "#87CEEB" } // default clear sky
      }
    }

    // Draw gradient background
    const drawBackground = () => {
      const { start, end } = getBackgroundColors()
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      gradient.addColorStop(0, start)
      gradient.addColorStop(1, end)
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    // Particle system
    const particles: any[] = []

    const createParticles = () => {
      particles.length = 0

      // Determine number of particles based on weather
      const particleCount =
        lowerCond === "snow" ? 100
          : (lowerCond === "rain" || lowerCond === "drizzle") ? 200
          : 0 // No particles for clear or clouds

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size:
            lowerCond === "snow"
              ? Math.random() * 5 + 1
              : (lowerCond === "rain" || lowerCond === "drizzle")
                ? Math.random() * 2 + 1
                : 0,
          speedX: lowerCond === "clouds" ? Math.random() * 1 - 0.5 : 0,
          speedY:
            lowerCond === "snow"
              ? Math.random() * 1 + 0.5
              : (lowerCond === "rain" || lowerCond === "drizzle")
                ? Math.random() * 7 + 5
                : 0,
        })
      }
    }

    const drawParticles = () => {
      particles.forEach((p) => {
        ctx.beginPath()

        if (lowerCond === "rain" || lowerCond === "drizzle") {
          ctx.strokeStyle = "rgba(255, 255, 255, 0.7)"
          ctx.lineWidth = p.size / 2
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(p.x, p.y + p.size * 3)
          ctx.stroke()
        } else if (lowerCond === "snow") {
          ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
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

    // Clouds system for non-clear weather
    const clouds: any[] = []

    const createClouds = () => {
      clouds.length = 0
      if (lowerCond === "clear") return // no clouds for clear

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
      if (lowerCond === "clear") return

      clouds.forEach((cloud) => {
        ctx.fillStyle = "rgba(255, 255, 255, 0.3)"
        ctx.beginPath()
        ctx.ellipse(cloud.x, cloud.y, cloud.width / 2, cloud.height / 2, 0, 0, Math.PI * 2)
        ctx.fill()

        cloud.x += cloud.speed
        if (cloud.x - cloud.width > canvas.width) {
          cloud.x = -cloud.width
          cloud.y = (Math.random() * canvas.height) / 2
        }
      })
    }

    // Initialize particles and clouds
    createParticles()
    createClouds()

    // Animate loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      drawBackground()
      drawClouds()
      drawParticles()
      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [weatherCondition])

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10" />
}
