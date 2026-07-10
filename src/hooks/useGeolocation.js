import { useState, useEffect } from 'react'
import { LEEDS_CENTER } from '../utils/constants'

export function useGeolocation() {
  const [position, setPosition] = useState(LEEDS_CENTER)
  const [granted, setGranted] = useState(false)

  useEffect(() => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setGranted(true)
      },
      () => setPosition(LEEDS_CENTER)
    )
  }, [])

  return { position, granted }
}
