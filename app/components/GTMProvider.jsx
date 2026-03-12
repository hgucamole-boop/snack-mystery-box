"use client"
import { useEffect } from "react"
import { getGTM } from "@/lib/gtm" // wherever your getGTM lives

// must be wrapped around root of app
export default function GTMProvider({ children }) {
  useEffect(() => {
    getGTM()
  }, [])

  return <>{children}</>
}