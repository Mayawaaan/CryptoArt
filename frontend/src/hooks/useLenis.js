import { useContext } from "react"
import { LenisContext } from "../context/lenisContextObject"

export const useLenis = () => useContext(LenisContext)
