import { useEffect, useState } from "react"
import AboutUsDesktop from "./AboutUsDesktop"
import AboutUsMobile from "./AboutUsMobile"

const AboutUs = () => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkScreen() // initial check
    window.addEventListener("resize", checkScreen)

    return () => window.removeEventListener("resize", checkScreen)
  }, [])

  return isMobile ? <AboutUsMobile /> : <AboutUsDesktop />
}

export default AboutUs