import { Canvas, useFrame } from "@react-three/fiber"
import { Text, Environment } from "@react-three/drei"
import { useRef, useState } from "react"
import currencies from "../../data/coinSymbols.js"

// function Coin() {
//   const coinRef = useRef()
//   const rotationTracker = useRef(0)

//   const velocity = useRef(1.5)
//   const isDragging = useRef(false)
//   const previousX = useRef(0)

//   const [index, setIndex] = useState(0)

//   useFrame((_, delta) => {
//     if (!coinRef.current) return

//     coinRef.current.rotation.y += velocity.current * delta
//     rotationTracker.current += Math.abs(velocity.current * delta)

//     if (rotationTracker.current >= Math.PI * 2) {
//       rotationTracker.current = 0
//       setIndex((prev) => (prev + 1) % currencies.length)
//     }

//     if (!isDragging.current) {
//       velocity.current *= 0.98
//       if (Math.abs(velocity.current) < 1.5) {
//         velocity.current *= 1.5
//       }
//     }
//   })

//   return (
//     <group position={[3.5, 0.5, 0]}>
      
//       {/* Currency Name */}
//       <Text
//         position={[0, 3, 0]}
//         fontSize={0.6}
//         color="white"
//         anchorX="center"
//         anchorY="middle"
//       >
//         {currencies[index].name}
//       </Text>

//       <group
//         ref={coinRef}
//         onPointerDown={(e) => {
//           isDragging.current = true
//           previousX.current = e.clientX
//         }}
//         onPointerUp={() => (isDragging.current = false)}
//         onPointerLeave={() => (isDragging.current = false)}
//         onPointerMove={(e) => {
//           if (!isDragging.current) return
//           const deltaX = e.clientX - previousX.current
//           previousX.current = e.clientX
//           velocity.current = deltaX * 0.05
//         }}
//       >
//         {/* Coin */}
//         <mesh rotation={[Math.PI / 2, 0, 0]}>
//           <cylinderGeometry args={[2, 2, 0.4, 64]} />
//           <meshStandardMaterial
//             color="#87722c"
//             metalness={0.9}
//             roughness={0.25}
//             envMapIntensity={2.5}
//           />
//         </mesh>

//         {/* Front Symbol */}
//         <Text
//           position={[0, 0, 0.28]}
//           fontSize={1.4}
//           color="white"
//           anchorX="center"
//           anchorY="middle"
//         >
//           {currencies[index].symbol}
//         </Text>

//         {/* Back Symbol */}
//         <Text
//           position={[0, 0, -0.28]}
//           rotation={[0, Math.PI, 0]}
//           fontSize={1.4}
//           color="white"
//           anchorX="center"
//           anchorY="middle"
//         >
//           {currencies[index].symbol}
//         </Text>
//       </group>
//     </group>
//   )
// }

// function Coin() {
//   const coinRef = useRef()
//   const rotationTracker = useRef(0)
//   const ringRef1 = useRef()
//   const ringRef2 = useRef()
//   const ringRef3 = useRef()
//   const ringRef4 = useRef()
  
//   const velocity = useRef(1.5)
//   const isDragging = useRef(false)
//   const previousX = useRef(0)

//   const [index, setIndex] = useState(0)
//   const [displayIndex, setDisplayIndex] = useState(0)

//   const fade = useRef(1)

//   useFrame((_, delta) => {
//     if (!coinRef.current) return

//     coinRef.current.rotation.y += velocity.current * delta
//     rotationTracker.current += Math.abs(velocity.current * delta)

//     // Smooth fade logic
//     if (fade.current < 1) {
//       fade.current += delta * 2
//       if (fade.current >= 1) {
//         fade.current = 1
//         setDisplayIndex(index)
//       }
//     }
//     if (ringRef1.current) {
//   ringRef1.current.rotation.y += velocity.current * delta * 0.5
// }

// if (ringRef2.current) {
//   ringRef2.current.rotation.y += velocity.current * delta * 0.75

// }

// if (ringRef3.current) {
//   ringRef3.current.rotation.y += velocity.current * delta * 1
// }
// if (ringRef4.current) {
//   ringRef4.current.rotation.y += velocity.current * delta * 1.5

// }



//     if (rotationTracker.current >= Math.PI * 2) {
//       rotationTracker.current = 0
//       fade.current = 0
//       setIndex((prev) => (prev + 1) % currencies.length)
//     }

//     if (!isDragging.current) {
//       velocity.current *= 0.98
//       if (Math.abs(velocity.current) < 1.5) {
//         velocity.current *= 1.5
//       }
//     }
//   })

//   return (
//     <group position={[3.5, 0.5, 0]}>
      
//       {/* Currency Name */}
//       <Text
//         position={[0, 3, 0]}
//         fontSize={0.6}
//         color="white"
//         anchorX="center"
//         anchorY="middle"
//       >
//         {currencies[index].name}
//       </Text>

//       <group
//         ref={coinRef}
//         onPointerDown={(e) => {
//           isDragging.current = true
//           previousX.current = e.clientX
//         }}
//         onPointerUp={() => (isDragging.current = false)}
//         onPointerLeave={() => (isDragging.current = false)}
//         onPointerMove={(e) => {
//           if (!isDragging.current) return
//           const deltaX = e.clientX - previousX.current
//           previousX.current = e.clientX
//           velocity.current = deltaX * 0.05
//         }}
//       >
//         {/* MAIN COIN */}
//         <mesh rotation={[Math.PI / 2, 0, 0]}>
//           <cylinderGeometry args={[2, 2, 0.4, 128,64]} />
//           <meshStandardMaterial
//   color="#9a7f2b"
//   metalness={1}
//   roughness={0.35}
//   envMapIntensity={2}
// />
//         </mesh>

//         {/* RIDGED EDGE (thin torus ring) */}
//         {/* RIDGED EDGE */}
// <mesh ref={ringRef1} rotation={[4, 2, 1]}>
//   <torusGeometry args={[2.5, 0.08, 34, 300]} />
//   <meshStandardMaterial
//     color="#a68a2e"
//     metalness={1}
//     roughness={0.3}
//   />
// </mesh>

// <mesh ref={ringRef2} rotation={[5, 3, 1]}>
//   <torusGeometry args={[2.5, 0.08, 34, 300]} />
//   <meshStandardMaterial
//     color="#a68a2e"
//     metalness={1}
//     roughness={0.3}
//   />
// </mesh>

// <mesh ref={ringRef3} rotation={[6, 4, 1]}>
//   <torusGeometry args={[2.5, 0.08, 34, 300]} />
//   <meshStandardMaterial
//     color="#a68a2e"
//     metalness={1}
//     roughness={0.3}
//   />
// </mesh>
// <mesh ref={ringRef4} rotation={[7, 5, 1]}>
//   <torusGeometry args={[2.5, 0.08, 34, 300]} />
//   <meshStandardMaterial
//     color="#a68a2e"
//     metalness={1}
//     roughness={0.3}
//   />
// </mesh>



//         {/* ENGRAVED FRONT */}
//         <Text
//           position={[0, 0, 0.23]}
//           fontSize={1.4}
//           color="#5e4d1c"
//           anchorX="center"
//           anchorY="middle"
//           fillOpacity={fade.current}
//           depthOffset={-1}
//         >
//           {currencies[displayIndex].symbol}
//         </Text>

//         {/* ENGRAVED BACK */}
//         <Text
//           position={[0, 0, -0.20]}
//           rotation={[0, Math.PI, 0]}
//           fontSize={1.4}
//           color="#5e4d1c"
//           anchorX="center"
//           anchorY="middle"
//           fillOpacity={fade.current}
//           depthOffset={-1}
//         >
//           {currencies[displayIndex].symbol}
//         </Text>
//         {/* ENGRAVED FRONT */}

//       </group>
//     </group>
//   )
// }
function Coin() {
  const coinRef = useRef()
  const rotationTracker = useRef(0)
  const ringRef1 = useRef()
  const ringRef2 = useRef()
  const ringRef3 = useRef()
  const ringRef4 = useRef()

  const velocity = useRef(1.5)
  const isDragging = useRef(false)
  const previousX = useRef(0)

  const [index, setIndex] = useState(0)

  useFrame((_, delta) => {
    if (!coinRef.current) return

    coinRef.current.rotation.y += velocity.current * delta
    rotationTracker.current += Math.abs(velocity.current * delta)

    if (ringRef1.current)
      ringRef1.current.rotation.y += velocity.current * delta * 0.5

    if (ringRef2.current)
      ringRef2.current.rotation.y += velocity.current * delta * 0.75

    if (ringRef3.current)
      ringRef3.current.rotation.y += velocity.current * delta * 1

    if (ringRef4.current)
      ringRef4.current.rotation.y += velocity.current * delta * 1.5

    if (rotationTracker.current >= Math.PI * 2) {
      rotationTracker.current = 0
      setIndex((prev) => (prev + 1) % currencies.length)
    }

    if (!isDragging.current) {
      velocity.current *= 0.98
      if (Math.abs(velocity.current) < 1.5) {
        velocity.current *= 1.5
      }
    }
  })

  return (
    <group position={[3.5, 0.5, 0]}>
      {/* Currency Name */}
      <Text
        position={[0, 3, 0]}
        fontSize={0.6}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {currencies[index].name}
      </Text>

      <group
        ref={coinRef}
        onPointerDown={(e) => {
          isDragging.current = true
          previousX.current = e.clientX
        }}
        onPointerUp={() => (isDragging.current = false)}
        onPointerLeave={() => (isDragging.current = false)}
        onPointerMove={(e) => {
          if (!isDragging.current) return
          const deltaX = e.clientX - previousX.current
          previousX.current = e.clientX
          velocity.current = deltaX * 0.05
        }}
      >
        {/* MAIN COIN */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[2, 2, 0.4, 128, 64]} />
          <meshStandardMaterial
            color="#9a7f2b"
            metalness={1}
            roughness={0.35}
            envMapIntensity={2}
          />
        </mesh>

        {/* RINGS */}
        <mesh ref={ringRef1} rotation={[4, 2, 1]}>
          <torusGeometry args={[2.5, 0.08, 34, 300]} />
          <meshStandardMaterial color="#a68a2e" metalness={1} roughness={0.3} />
        </mesh>

        <mesh ref={ringRef2} rotation={[5, 3, 1]}>
          <torusGeometry args={[2.5, 0.08, 34, 300]} />
          <meshStandardMaterial color="#a68a2e" metalness={1} roughness={0.3} />
        </mesh>

        <mesh ref={ringRef3} rotation={[6, 4, 1]}>
          <torusGeometry args={[2.5, 0.08, 34, 300]} />
          <meshStandardMaterial color="#a68a2e" metalness={1} roughness={0.3} />
        </mesh>

        <mesh ref={ringRef4} rotation={[7, 5, 1]}>
          <torusGeometry args={[2.5, 0.08, 34, 300]} />
          <meshStandardMaterial color="#a68a2e" metalness={1} roughness={0.3} />
        </mesh>

        {/* FRONT SYMBOL */}
        <Text
          position={[0, 0, 0.23]}
          fontSize={1.4}
          color="#5e4d1c"
          anchorX="center"
          anchorY="middle"
          depthOffset={-1}
        >
          {currencies[index].symbol}
        </Text>

        {/* BACK SYMBOL */}
        <Text
          position={[0, 0, -0.20]}
          rotation={[0, Math.PI, 0]}
          fontSize={1.4}
          color="#5e4d1c"
          anchorX="center"
          anchorY="middle"
          depthOffset={-1}
        >
          {currencies[index].symbol}
        </Text>
      </group>
    </group>
  )
}
export default function CurrencyCoinScene() {
  const isMobile = window.innerWidth < 768
  return (
    <div className=" h-screen">
      <Canvas
        camera={{
  position: isMobile ? [-5, 4, 0] : [-7, 0, 1],
  fov: isMobile ? 75 : 38
}}
        gl={{ toneMappingExposure: 1.6 }}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[0, 0, 8]} intensity={1.2} />
        <directionalLight position={[5, 5, 5]} intensity={1.8} />
        <directionalLight position={[-5, 3, -5]} intensity={1.5} />
        <Environment preset="studio" environmentIntensity={2} />
        <Coin />
      </Canvas>
    </div>
  )
}