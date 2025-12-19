'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

export default function Compass() {
  const [rotation, setRotation] = useState(0)
  const lastAlpha = useRef<number | null>(null)

  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.alpha === null) return

      const alpha = event.alpha

      if (lastAlpha.current === null) {
        lastAlpha.current = alpha
        return
      }

      let delta = alpha - lastAlpha.current

      // 🔥 Prevent jump at 360 → 0
      if (delta > 180) delta -= 360
      if (delta < -180) delta += 360

      setRotation(prev => prev + delta)
      lastAlpha.current = alpha
    }

    window.addEventListener('deviceorientation', handleOrientation, true)

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation)
    }
  }, [])

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      {/* Compass Container */}
      <div className="relative w-64 h-64">
        
        {/* Rotating Compass Dial */}
        <motion.div
          animate={{ rotate: -rotation }}
          transition={{
            type: 'spring',
            stiffness: 70,
            damping: 18,
          }}
          className="absolute inset-0 rounded-full border-4 border-white"
        >
          {/* Directions */}
          <span className="absolute top-2 left-1/2 -translate-x-1/2 text-white font-bold">N</span>
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-white font-bold">E</span>
          <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-white font-bold">S</span>
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-white font-bold">W</span>
        </motion.div>

        {/* Fixed Needle */}
        <div className="absolute inset-0 flex items-start justify-center">
          <div className="w-1 h-28 bg-red-500 rounded-full mt-4" />
        </div>

        {/* Needle Center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 bg-red-500 rounded-full" />
        </div>

      </div>
    </div>
  )
}
