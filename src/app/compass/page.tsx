'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

function normalizeAngle(angle: number) {
  return ((angle + 540) % 360) - 180
}

export default function Compass() {
  const [heading, setHeading] = useState(0)
  const [qiblahAngle, setQiblahAngle] = useState<number | null>(null)

  const smoothHeading = useRef(0)

  /* ---------------- Device Orientation (SMOOTHED) ---------------- */
  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.alpha === null) return

      const target = event.alpha
      const delta = normalizeAngle(target - smoothHeading.current)

      smoothHeading.current += delta * 0.15
      setHeading(smoothHeading.current)
    }

    window.addEventListener('deviceorientationabsolute', handleOrientation)
    window.addEventListener('deviceorientation', handleOrientation)

    return () => {
      window.removeEventListener('deviceorientationabsolute', handleOrientation)
      window.removeEventListener('deviceorientation', handleOrientation)
    }
  }, [])

  /* ---------------- Geolocation + Qiblah ---------------- */
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords
      const res = await fetch(
        `https://api.aladhan.com/v1/qibla/${latitude}/${longitude}`
      )
      const data = await res.json()
      setQiblahAngle(data.data.direction)
    })
  }, [])

  /* ---------------- Rotation Logic ---------------- */
  const qiblahRotation =
    qiblahAngle !== null
      ? normalizeAngle(qiblahAngle - heading - 270)
      : 0
  // -270 → icon placed initially on WEST

  return (
    <div className="flex justify-center items-center h-screen bg-black">
      <div className="relative w-72 h-72 rounded-full border-4 border-white">

        {/* 🧭 Compass */}
        <motion.div
          animate={{ rotate: -heading }}
          transition={{ type: 'spring', stiffness: 80, damping: 18 }}
          className="absolute inset-0"
        >
          {/* Directions */}
          <span className="absolute top-2 left-1/2 -translate-x-1/2 text-white">N</span>
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-white">E</span>
          <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-white">S</span>
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-white">W</span>
        </motion.div>

        {/* 🕋 Qiblah Icon (Starts on WEST) */}
        <motion.div
          animate={{ rotate: qiblahRotation }}
          transition={{ type: 'spring', stiffness: 80, damping: 18 }}
          className="absolute inset-0 flex items-center justify-start"
        >
          <div className="ml-2 w-4 h-16 bg-green-500 rounded-full" />
        </motion.div>

      </div>
    </div>
  )
}
