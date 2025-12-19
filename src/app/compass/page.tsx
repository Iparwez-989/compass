'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function Compass() {
  const [heading, setHeading] = useState(0)
  const [qiblahAngle, setQiblahAngle] = useState<number | null>(null)

  /* ---------------- Device Orientation ---------------- */
  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.alpha !== null) {
        setHeading(event.alpha)
      }
    }

    window.addEventListener('deviceorientationabsolute', handleOrientation)
    window.addEventListener('deviceorientation', handleOrientation)

    return () => {
      window.removeEventListener('deviceorientationabsolute', handleOrientation)
      window.removeEventListener('deviceorientation', handleOrientation)
    }
  }, [])

  /* ---------------- Geolocation + Qiblah API ---------------- */
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
    qiblahAngle !== null ? qiblahAngle - heading : 0

  return (
    <div className="flex justify-center items-center h-screen bg-black">
      <div className="relative w-64 h-64 rounded-full border-4 border-white flex items-center justify-center">

        {/* 🧭 Compass */}
        <motion.div
          animate={{ rotate: -heading }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          className="absolute w-full h-full flex items-center justify-center"
        >
          <span className="absolute top-2 text-white font-bold">N</span>
        </motion.div>

        {/* 🕋 Qiblah Pointer */}
        <motion.div
          animate={{ rotate: qiblahRotation }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          className="absolute w-full h-full flex items-center justify-center"
        >
          <div className="w-1 h-24 bg-green-500 rounded-full" />
        </motion.div>

      </div>
    </div>
  )
}
