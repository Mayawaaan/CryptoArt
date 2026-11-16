import { useEffect, useMemo, useRef, useState } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"
import currencies from "../../data/coinSymbols.js"
import { useTheme } from "../../hooks/useThemeTokens"

function createStudioEnvTexture(tokens) {
  const canvas = document.createElement("canvas")
  canvas.width = 256
  canvas.height = 128
  const ctx = canvas.getContext("2d")

  const baseBg = tokens.background
  const keyLight = tokens.sceneLightKey
  const fillLight = tokens.sceneLightFill
  const accent = tokens.interactive

  const bgGrad = ctx.createLinearGradient(0, 0, 0, 128)
  bgGrad.addColorStop(0, keyLight)
  bgGrad.addColorStop(0.42, fillLight)
  bgGrad.addColorStop(0.55, baseBg)
  bgGrad.addColorStop(1, accent)
  ctx.fillStyle = bgGrad
  ctx.fillRect(0, 0, 256, 128)

  // Soft studio highlight panels for metallic specular streaks
  ctx.fillStyle = keyLight
  ctx.globalAlpha = 0.85
  ctx.fillRect(36, 16, 68, 22)
  ctx.fillRect(160, 22, 54, 18)

  ctx.fillStyle = accent
  ctx.globalAlpha = 0.55
  ctx.fillRect(92, 86, 80, 16)
  ctx.globalAlpha = 1

  const texture = new THREE.CanvasTexture(canvas)
  texture.mapping = THREE.EquirectangularReflectionMapping
  texture.colorSpace = THREE.SRGBColorSpace
  texture.needsUpdate = true
  return texture
}

function createCoinFaceTexture(symbol, tokens) {
  const size = 512
  const canvas = document.createElement("canvas")
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext("2d")

  const faceColor = tokens.sceneMetal
  const rimColor = tokens.sceneRim
  const engravingColor = tokens.sceneEngraving

  // Brushed radial gradient coin surface
  const grad = ctx.createRadialGradient(210, 190, 30, 256, 256, 256)
  grad.addColorStop(0, rimColor)
  grad.addColorStop(0.65, faceColor)
  grad.addColorStop(1, engravingColor)
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, size, size)

  // Minted inner ring
  ctx.strokeStyle = engravingColor
  ctx.globalAlpha = 0.55
  ctx.lineWidth = 10
  ctx.beginPath()
  ctx.arc(256, 256, 212, 0, Math.PI * 2)
  ctx.stroke()

  ctx.strokeStyle = rimColor
  ctx.globalAlpha = 0.45
  ctx.lineWidth = 4
  ctx.beginPath()
  ctx.arc(256, 256, 196, 0, Math.PI * 2)
  ctx.stroke()

  // Engraved center currency symbol
  ctx.globalAlpha = 0.92
  ctx.fillStyle = engravingColor
  ctx.font = "700 240px ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif"
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ctx.fillText(symbol, 256, 266)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4
  texture.needsUpdate = true
  return texture
}

function StudioEnvironment({ tokens }) {
  const { scene } = useThree()

  useEffect(() => {
    const texture = createStudioEnvTexture(tokens)
    const previousEnv = scene.environment
    scene.environment = texture

    return () => {
      scene.environment = previousEnv
      texture.dispose()
    }
  }, [scene, tokens])

  return null
}

function ResponsiveCamera() {
  const { camera, size } = useThree()

  useEffect(() => {
    const aspect = size.width / Math.max(size.height, 1)
    const scale = aspect < 0.9 ? 1.25 : aspect < 1.15 ? 1.1 : 1.0
    camera.position.set(-2.4 * scale, 0.7 * scale, 8.2 * scale)
    camera.lookAt(0, 0, 0)
    camera.updateProjectionMatrix()
  }, [camera, size.width, size.height])

  return null
}

function Coin({ tokens, reducedMotion }) {
  const coinRef = useRef()
  const rotationTracker = useRef(0)
  const ringRef1 = useRef()
  const ringRef2 = useRef()
  const ringRef3 = useRef()
  const ringRef4 = useRef()

  const baseIdleVelocity = reducedMotion ? 0 : 1.1
  const velocity = useRef(baseIdleVelocity)
  const isDragging = useRef(false)
  const previousX = useRef(0)

  const [index, setIndex] = useState(0)

  const currentSymbol = currencies[index].symbol

  const metalColor = useMemo(
    () => new THREE.Color(tokens.sceneMetal),
    [tokens.sceneMetal]
  )
  const rimColor = useMemo(
    () => new THREE.Color(tokens.sceneRim),
    [tokens.sceneRim]
  )

  const faceTexture = useMemo(
    () => createCoinFaceTexture(currentSymbol, tokens),
    [currentSymbol, tokens]
  )

  useEffect(() => {
    return () => {
      faceTexture.dispose()
    }
  }, [faceTexture])

  useEffect(() => {
    if (reducedMotion) {
      velocity.current = 0
    } else if (Math.abs(velocity.current) < 0.25) {
      velocity.current = 1.1
    }
  }, [reducedMotion])

  useFrame((_, delta) => {
    if (!coinRef.current) return
    const safeDelta = Math.min(delta, 0.05)

    coinRef.current.rotation.y += velocity.current * safeDelta
    rotationTracker.current += Math.abs(velocity.current * safeDelta)

    if (ringRef1.current) ringRef1.current.rotation.y += velocity.current * safeDelta * 0.5
    if (ringRef2.current) ringRef2.current.rotation.y += velocity.current * safeDelta * 0.75
    if (ringRef3.current) ringRef3.current.rotation.y += velocity.current * safeDelta * 1.0
    if (ringRef4.current) ringRef4.current.rotation.y += velocity.current * safeDelta * 1.5

    if (rotationTracker.current >= Math.PI * 2) {
      rotationTracker.current = 0
      setIndex((prev) => (prev + 1) % currencies.length)
    }

    if (!isDragging.current) {
      const target = reducedMotion ? 0 : 1.1
      velocity.current += (target - velocity.current) * Math.min(1, safeDelta * 2.5)
    }
  })

  return (
    <group
      ref={coinRef}
      onPointerDown={(e) => {
        e.stopPropagation()
        isDragging.current = true
        previousX.current = e.clientX
      }}
      onPointerUp={() => {
        isDragging.current = false
      }}
      onPointerLeave={() => {
        isDragging.current = false
      }}
      onPointerMove={(e) => {
        if (!isDragging.current) return
        const deltaX = e.clientX - previousX.current
        previousX.current = e.clientX
        velocity.current = THREE.MathUtils.clamp(deltaX * 0.08, -8, 8)
      }}
    >
      {/* Main Coin Rim Cylinder */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.9, 1.9, 0.36, 96, 1]} />
        <meshStandardMaterial
          color={metalColor}
          metalness={0.88}
          roughness={0.28}
          envMapIntensity={1.6}
        />
      </mesh>

      {/* Engraved Front Face */}
      <mesh position={[0, 0, 0.185]}>
        <circleGeometry args={[1.86, 64]} />
        <meshStandardMaterial
          map={faceTexture}
          metalness={0.65}
          roughness={0.32}
          envMapIntensity={1.3}
        />
      </mesh>

      {/* Engraved Back Face */}
      <mesh position={[0, 0, -0.185]} rotation={[0, Math.PI, 0]}>
        <circleGeometry args={[1.86, 64]} />
        <meshStandardMaterial
          map={faceTexture}
          metalness={0.65}
          roughness={0.32}
          envMapIntensity={1.3}
        />
      </mesh>

      {/* Orbital Rings */}
      <mesh ref={ringRef1} rotation={[4, 2, 1]}>
        <torusGeometry args={[2.35, 0.065, 24, 160]} />
        <meshStandardMaterial color={rimColor} metalness={0.92} roughness={0.22} envMapIntensity={1.6} />
      </mesh>

      <mesh ref={ringRef2} rotation={[5, 3, 1]}>
        <torusGeometry args={[2.35, 0.065, 24, 160]} />
        <meshStandardMaterial color={rimColor} metalness={0.92} roughness={0.22} envMapIntensity={1.6} />
      </mesh>

      <mesh ref={ringRef3} rotation={[6, 4, 1]}>
        <torusGeometry args={[2.35, 0.065, 24, 160]} />
        <meshStandardMaterial color={rimColor} metalness={0.92} roughness={0.22} envMapIntensity={1.6} />
      </mesh>

      <mesh ref={ringRef4} rotation={[7, 5, 1]}>
        <torusGeometry args={[2.35, 0.065, 24, 160]} />
        <meshStandardMaterial color={rimColor} metalness={0.92} roughness={0.22} envMapIntensity={1.6} />
      </mesh>
    </group>
  )
}

export default function CurrencyCoinScene() {
  const { tokens } = useTheme()
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return undefined
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    const update = () => setReducedMotion(media.matches)
    update()
    media.addEventListener("change", update)
    return () => media.removeEventListener("change", update)
  }, [])

  if (!tokens.sceneMetal) {
    return <div className="w-full h-full" aria-hidden="true" />
  }

  return (
    <div
      className="w-full h-full relative select-none cursor-grab active:cursor-grabbing"
      aria-label="Interactive 3D currency emblem. Drag horizontally to spin."
    >
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [-2.4, 0.7, 8.2], fov: 38 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ background: "transparent" }}
      >
        <ResponsiveCamera />
        <StudioEnvironment tokens={tokens} />
        <ambientLight intensity={0.9} color={tokens.sceneLightKey} />
        <directionalLight position={[4, 6, 8]} intensity={1.8} color={tokens.sceneLightKey} />
        <directionalLight position={[-6, 3, -5]} intensity={1.3} color={tokens.sceneLightFill} />
        <directionalLight position={[0, -5, 4]} intensity={0.8} color={tokens.interactive} />

        <Coin tokens={tokens} reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  )
}
