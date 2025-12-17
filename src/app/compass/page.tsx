'use client'
import CompassOuter from '@/assets/CompassOuter.svg'
import CompassInner from '@/assets/CompassInner.svg'
import meccaIcon from "@/assets/Qaaba.png"
import CenterLogo from '@/assets/CentreLogo.svg'
import { useEffect, useState } from 'react'
import {motion} from "framer-motion"
import Image from 'next/image'
const Compass = ()=>{
    const [rotation, setRotation] = useState<number>(0)
    useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.alpha !== null) {
        setRotation(event.alpha)
      }
    }
    window.addEventListener('deviceorientation', handleOrientation)

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation)
    }
  }, [])

    return(
        <div className="flex flex-col h-full justify-evenly  mt-2 ">
        {/* Compass */}
        <div className="flex justify-center items-center relative">
          <motion.div
            animate={{ rotate: -rotation }}
            transition={{
              type: 'spring',
              stiffness: 100,
              damping: 10,
            }}
            className="relative w-60 md:w-[300px] h-60 md:h-[300px] "
          >
            <Image
              src={CompassOuter}
              alt="compass outer"
              className="absolute top-1/2 left-1/2 w-64 md:w-76 h-64 md:h-76  -translate-x-1/2 -translate-y-1/2"
            />

            <Image
              src={meccaIcon}
              alt="Qiblah"
              className="absolute top-1/2 -left-6 -translate-y-1/2"
            />

            <Image
              src={CompassInner}
              alt="compass inner"
              className="absolute top-1/2 left-1/2 w-40 md:w-44 h-40 md:h-44 -translate-x-1/2 -translate-y-1/2"
            />
          </motion.div>
          <Image
            src={CenterLogo}
            alt="logo"
            className="absolute top-1/2 left-1/2 w-20 md:w-24 h-20 md:h-24 -translate-x-1/2 -translate-y-1/2"
          />
        </div>

      </div>
    )
}

export default Compass;