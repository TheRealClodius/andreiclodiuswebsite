import React, { useRef, useMemo, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

interface TemporalLogo3DProps {
  size?: number
  className?: string
}

// Global animation start time that persists across all component lifecycles
const GLOBAL_ANIMATION_START = Date.now()

// Environment map setup component
const EnvironmentMap = React.memo(() => {
  const { scene, gl } = useThree()
  
  useMemo(() => {
    // Create procedural environment map
    const pmremGenerator = new THREE.PMREMGenerator(gl)
    
    // Create a simple gradient environment
    const envMapRenderTarget = pmremGenerator.fromScene(createEnvironmentScene())
    scene.environment = envMapRenderTarget.texture
    
    return () => {
      envMapRenderTarget.dispose()
      pmremGenerator.dispose()
    }
  }, [scene, gl])
  
  return null
})

// Create a procedural environment scene for realistic lighting
const createEnvironmentScene = () => {
  const envScene = new THREE.Scene()
  
  // Sky gradient
  const skyGeometry = new THREE.SphereGeometry(100, 32, 32)
  const skyMaterial = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    uniforms: {
      topColor: { value: new THREE.Color(0x87CEEB) }, // Sky blue
      bottomColor: { value: new THREE.Color(0xFFE4B5) }, // Moccasin
      offset: { value: 30 },
      exponent: { value: 0.6 }
    },
    vertexShader: `
      varying vec3 vWorldPosition;
      void main() {
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPosition.xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 topColor;
      uniform vec3 bottomColor;
      uniform float offset;
      uniform float exponent;
      varying vec3 vWorldPosition;
      void main() {
        float h = normalize(vWorldPosition + offset).y;
        gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
      }
    `
  })
  
  const skyMesh = new THREE.Mesh(skyGeometry, skyMaterial)
  envScene.add(skyMesh)
  
  // Add some bright spots for reflections
  const sunLight = new THREE.DirectionalLight(0xffffff, 5.0)
  sunLight.position.set(50, 100, 50)
  envScene.add(sunLight)
  
  return envScene
}

EnvironmentMap.displayName = 'EnvironmentMap'

// Create realistic procedural textures inspired by A23D-style materials
const createRealisticTexture = (type: 'brushed-metal' | 'chrome' | 'anodized' | 'glass') => {
  const canvas = document.createElement('canvas')
  canvas.width = 2048 // Ultra-high resolution for detail
  canvas.height = 2048
  const ctx = canvas.getContext('2d')!
  
  if (type === 'brushed-metal') {
    // Realistic brushed gold/aluminum base
    const gradient = ctx.createLinearGradient(0, 0, 2048, 2048)
    gradient.addColorStop(0, '#B8B8B8')
    gradient.addColorStop(0.5, '#DDDDDD')
    gradient.addColorStop(1, '#A0A0A0')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 2048, 2048)
    
    // Fine parallel brush strokes (anisotropic)
    for (let i = 0; i < 1200; i++) {
      const y = (i / 1200) * 2048 + (Math.random() - 0.5) * 8
      ctx.beginPath()
      ctx.strokeStyle = `rgba(${Math.random() * 60}, ${Math.random() * 60}, ${Math.random() * 60}, ${0.1 + Math.random() * 0.4})`
      ctx.lineWidth = 0.3 + Math.random() * 2
      ctx.moveTo(0, y)
      ctx.lineTo(2048, y + (Math.random() - 0.5) * 12)
      ctx.stroke()
    }
    
    // Micro-scratches
    for (let i = 0; i < 400; i++) {
      ctx.beginPath()
      ctx.strokeStyle = `rgba(${20 + Math.random() * 40}, ${20 + Math.random() * 40}, ${20 + Math.random() * 40}, ${0.3 + Math.random() * 0.5})`
      ctx.lineWidth = 0.2 + Math.random() * 0.8
      const startY = Math.random() * 2048
      ctx.moveTo(Math.random() * 200, startY)
      ctx.lineTo(1848 + Math.random() * 200, startY + (Math.random() - 0.5) * 20)
      ctx.stroke()
    }
    
  } else if (type === 'chrome') {
    // Chrome base with micro-imperfections
    ctx.fillStyle = '#F0F0F0'
    ctx.fillRect(0, 0, 2048, 2048)
    
    // Fingerprint patterns
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * 2048
      const y = Math.random() * 2048
      ctx.beginPath()
      ctx.arc(x, y, 30 + Math.random() * 50, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(${Math.random() * 30}, ${Math.random() * 30}, ${Math.random() * 30}, 0.08)`
      ctx.fill()
    }
    
    // Micro-scratches and swirl marks
    for (let i = 0; i < 800; i++) {
      ctx.beginPath()
      ctx.strokeStyle = `rgba(${Math.random() * 40}, ${Math.random() * 40}, ${Math.random() * 40}, ${0.05 + Math.random() * 0.15})`
      ctx.lineWidth = 0.1 + Math.random() * 0.5
      const angle = Math.random() * Math.PI * 2
      const length = 10 + Math.random() * 40
      const startX = Math.random() * 2048
      const startY = Math.random() * 2048
      ctx.moveTo(startX, startY)
      ctx.lineTo(startX + Math.cos(angle) * length, startY + Math.sin(angle) * length)
      ctx.stroke()
    }
    
  } else if (type === 'anodized') {
    // Anodized aluminum with oxide patterns
    const gradient = ctx.createRadialGradient(1024, 1024, 0, 1024, 1024, 1024)
    gradient.addColorStop(0, '#C8C8C8')
    gradient.addColorStop(0.7, '#B0B0B0')
    gradient.addColorStop(1, '#909090')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 2048, 2048)
    
    // Oxide grain structure
    for (let i = 0; i < 2000; i++) {
      const x = Math.random() * 2048
      const y = Math.random() * 2048
      const radius = 1 + Math.random() * 4
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(${40 + Math.random() * 80}, ${40 + Math.random() * 80}, ${40 + Math.random() * 80}, ${0.2 + Math.random() * 0.4})`
      ctx.fill()
    }
    
    // Anodizing lines
    for (let i = 0; i < 600; i++) {
      ctx.beginPath()
      ctx.strokeStyle = `rgba(${Math.random() * 50}, ${Math.random() * 50}, ${Math.random() * 50}, ${0.1 + Math.random() * 0.3})`
      ctx.lineWidth = 0.5 + Math.random() * 1.5
      const y = Math.random() * 2048
      ctx.moveTo(0, y)
      ctx.lineTo(2048, y + (Math.random() - 0.5) * 30)
      ctx.stroke()
    }
    
  } else if (type === 'glass') {
    // High-quality glass with realistic imperfections
    ctx.fillStyle = '#F8F8F8'
    ctx.fillRect(0, 0, 2048, 2048)
    
    // Water spots and mineral deposits
    for (let i = 0; i < 150; i++) {
      const x = Math.random() * 2048
      const y = Math.random() * 2048
      const radius = 8 + Math.random() * 25
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(${200 + Math.random() * 55}, ${200 + Math.random() * 55}, ${200 + Math.random() * 55}, 0.15)`
      ctx.fill()
      
      // Ring pattern in spots
      ctx.beginPath()
      ctx.arc(x, y, radius * 0.7, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(${180 + Math.random() * 40}, ${180 + Math.random() * 40}, ${180 + Math.random() * 40}, 0.25)`
      ctx.lineWidth = 0.5
      ctx.stroke()
    }
    
    // Cleaning streaks
    for (let i = 0; i < 200; i++) {
      ctx.beginPath()
      ctx.strokeStyle = `rgba(${220 + Math.random() * 35}, ${220 + Math.random() * 35}, ${220 + Math.random() * 35}, ${0.08 + Math.random() * 0.12})`
      ctx.lineWidth = 2 + Math.random() * 6
      const startY = Math.random() * 2048
      const endY = startY + (Math.random() - 0.5) * 200
      ctx.moveTo(Math.random() * 400, startY)
      ctx.lineTo(1648 + Math.random() * 400, endY)
      ctx.stroke()
    }
  }
  
  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(4, 4) // Balanced repetition for realistic scale
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

// Cache varied realistic textures for performance
const chromeTexture = createRealisticTexture('chrome')
const glassTexture = createRealisticTexture('glass')
const brushedMetalTexture = createRealisticTexture('brushed-metal')
const anodizedTexture = createRealisticTexture('anodized')

// Hypnotically spinning torus with infinite randomized material variations every 8 seconds
const AnimatedShape = React.memo(() => {
  const meshRef = useRef<THREE.Mesh>(null)
  const [materialIndex, setMaterialIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const transitionStartTime = useRef<number>(Date.now())
  
  // Slower, more hypnotic rotation speeds for each axis
  const rotationSpeeds = useRef({
    x: 0.05 + Math.random() * 0.06, // Random between 0.1-0.4 (much slower)
    y: 0.2 + Math.random() * 0.5, // Random between 0.15-0.55
    z: 0 + Math.random() * 0  // Random between 0.08-0.28
  })
  
  // Update material every 7 seconds with smooth transition
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true)
      transitionStartTime.current = Date.now()
      
      // Complete material transition after 2 seconds
      setTimeout(() => {
        setMaterialIndex((prev) => prev + 1) // Infinite progression - always new random materials
        setIsTransitioning(false)
        
        // Randomize rotation speeds after each transition for variety
        rotationSpeeds.current = {
          x: 0.1 + Math.random() * 0.3,
          y: 0.15 + Math.random() * 0.4,
          z: 0.08 + Math.random() * 0.2
        }
      }, 2000) // Full 2 second material transition
      
    }, 8000) // Change material every 8 seconds for more relaxed pace
    
    return () => clearInterval(interval)
  }, [])

  // Generate randomized material configurations with varied textures and transparency
  const generateRandomMaterial = useRef(() => {
    // Random color palette - only high saturation colors
    const colorPalettes = [
      ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'], // Vibrant
      ['#2C3E50', '#E74C3C', '#ECF0F1', '#3498DB', '#9B59B6'], // Bold
      ['#FFD93D', '#6BCF7F', '#4D96FF', '#9013FE', '#FF6EC7'], // Electric
      ['#FF9F43', '#10AC84', '#5F27CD', '#00D2D3', '#FF3838'], // Dynamic
      ['#FF0080', '#00FFFF', '#FF8000', '#8000FF', '#00FF40'], // Neon
      ['#FF3030', '#30FF30', '#3030FF', '#FFFF30', '#FF30FF']  // Pure
    ]
    
    const palette = colorPalettes[Math.floor(Math.random() * colorPalettes.length)]
    const randomColor = palette[Math.floor(Math.random() * palette.length)]
    
    // Random texture selection
    const textures = [chromeTexture, glassTexture, brushedMetalTexture, anodizedTexture]
    const randomTexture = textures[Math.floor(Math.random() * textures.length)]
    
    // Random material type with different transparency behaviors
    const materialTypes = [
      {
        // Metallic materials
        roughness: 0.1 + Math.random() * 0.4, // 0.1-0.5
        metalness: 0.7 + Math.random() * 0.3, // 0.7-1.0
        envMapIntensity: 0.8 + Math.random() * 0.6, // 0.8-1.4
        clearcoat: 0.3 + Math.random() * 0.6, // 0.3-0.9
        clearcoatRoughness: 0.05 + Math.random() * 0.2, // 0.05-0.25
        transmission: 0,
        opacity: 1.0
      },
      {
        // Semi-transparent materials
        roughness: 0.2 + Math.random() * 0.3, // 0.2-0.5
        metalness: 0.1 + Math.random() * 0.4, // 0.1-0.5
        envMapIntensity: 0.9 + Math.random() * 0.5, // 0.9-1.4
        clearcoat: 0.6 + Math.random() * 0.4, // 0.6-1.0
        clearcoatRoughness: 0.1 + Math.random() * 0.15, // 0.1-0.25
        transmission: 0.2 + Math.random() * 0.4, // 0.2-0.6
        thickness: 0.5 + Math.random() * 1.0, // 0.5-1.5
        ior: 1.4 + Math.random() * 0.4, // 1.4-1.8
        opacity: 0.8 + Math.random() * 0.2 // 0.8-1.0
      },
      {
        // Glass-like materials
        roughness: 0.05 + Math.random() * 0.2, // 0.05-0.25
        metalness: 0.0 + Math.random() * 0.2, // 0.0-0.2
        envMapIntensity: 1.0 + Math.random() * 0.5, // 1.0-1.5
        clearcoat: 0.8 + Math.random() * 0.2, // 0.8-1.0
        clearcoatRoughness: 0.05 + Math.random() * 0.1, // 0.05-0.15
        transmission: 0.4 + Math.random() * 0.5, // 0.4-0.9
        thickness: 0.3 + Math.random() * 0.7, // 0.3-1.0
        ior: 1.5 + Math.random() * 0.3, // 1.5-1.8
        opacity: 0.7 + Math.random() * 0.1 // 0.7-1.0
      }
    ]
    
    const materialType = materialTypes[Math.floor(Math.random() * materialTypes.length)]
    
    return {
      color: randomColor,
      normalMap: randomTexture,
      normalScale: 1.0 + Math.random() * 1.5, // 1.0-2.5
      ...materialType
    }
  })

  // Store generated materials for smooth transitions
  const [currentMaterial, setCurrentMaterial] = useState(() => generateRandomMaterial.current())
  const [nextMaterial, setNextMaterial] = useState(() => generateRandomMaterial.current())
  
  // Update materials when materialIndex changes
  useEffect(() => {
    setCurrentMaterial(nextMaterial)
    setNextMaterial(generateRandomMaterial.current())
  }, [materialIndex])

  // Hypnotic spinning animation with smooth material transitions
  useFrame(() => {
    const currentTime = Date.now()
    const elapsedSeconds = (currentTime - GLOBAL_ANIMATION_START) / 1000
    
    // Calculate material transition progress (0 to 1) with smooth easing
    let transitionProgress = 0
    if (isTransitioning) {
      const transitionElapsed = (currentTime - transitionStartTime.current) / 1000
      const linearProgress = Math.min(transitionElapsed / 2.0, 1) // 2 second transition
      
      // Smooth easing curve for material transitions
      transitionProgress = linearProgress < 0.5 
        ? 2 * linearProgress * linearProgress // Ease in
        : 1 - Math.pow(-2 * linearProgress + 2, 2) / 2 // Ease out
    }
    
    // Animate the torus
    if (meshRef.current) {
      // Random multi-axis rotation for hypnotic effect
      meshRef.current.rotation.x += rotationSpeeds.current.x * 0.16 // 60fps normalized
      meshRef.current.rotation.y += rotationSpeeds.current.y * 0.016
      meshRef.current.rotation.z += rotationSpeeds.current.z * 0.016
      
      // Slower, more relaxed breathing scale animation
      const breathe = 1 + Math.sin(elapsedSeconds * 0.3) * 0.04
      meshRef.current.scale.setScalar(breathe)
      
      // Smooth material property interpolation
      const material = meshRef.current.material as THREE.MeshPhysicalMaterial
      if (material) {
        if (isTransitioning) {
          // Interpolate between current and next material properties
          const lerp = (a: number, b: number, t: number) => a + (b - a) * t
          
          // Interpolate color
          const currentColor = new THREE.Color(currentMaterial.color)
          const nextColor = new THREE.Color(nextMaterial.color)
          material.color.lerpColors(currentColor, nextColor, transitionProgress)
          
          // Interpolate material properties
          material.roughness = lerp(currentMaterial.roughness, nextMaterial.roughness, transitionProgress)
          material.metalness = lerp(currentMaterial.metalness, nextMaterial.metalness, transitionProgress)
          material.clearcoat = lerp(currentMaterial.clearcoat, nextMaterial.clearcoat, transitionProgress)
          material.clearcoatRoughness = lerp(currentMaterial.clearcoatRoughness, nextMaterial.clearcoatRoughness, transitionProgress)
          material.envMapIntensity = lerp(currentMaterial.envMapIntensity, nextMaterial.envMapIntensity, transitionProgress)
          
          // Interpolate normal scale
          const currentScale = currentMaterial.normalScale
          const nextScale = nextMaterial.normalScale
          const interpolatedScale = lerp(currentScale, nextScale, transitionProgress)
          material.normalScale.set(interpolatedScale, interpolatedScale)
          
          // Handle transmission and opacity properties
          material.transmission = lerp(currentMaterial.transmission || 0, nextMaterial.transmission || 0, transitionProgress)
          material.thickness = lerp(currentMaterial.thickness || 0, nextMaterial.thickness || 0, transitionProgress)
          material.ior = lerp(currentMaterial.ior || 1.5, nextMaterial.ior || 1.5, transitionProgress)
          material.opacity = lerp(currentMaterial.opacity || 1.0, nextMaterial.opacity || 1.0, transitionProgress)
          material.transparent = material.transmission > 0 || material.opacity < 1.0
          
        } else {
          // Apply current material properties with subtle animations
          material.color.setHex(parseInt(currentMaterial.color.replace('#', ''), 16))
          material.roughness = currentMaterial.roughness
          material.metalness = currentMaterial.metalness
          material.clearcoat = currentMaterial.clearcoat
          material.clearcoatRoughness = currentMaterial.clearcoatRoughness
          
          // Subtle environment animation with gentle breathing effect
          const envBreathing = Math.sin(elapsedSeconds * 0.25) * 0.12
          material.envMapIntensity = currentMaterial.envMapIntensity + envBreathing
          
          material.normalScale.set(currentMaterial.normalScale, currentMaterial.normalScale)
          
          // Set normal map based on current material
          material.normalMap = currentMaterial.normalMap
          
          // Handle transmission and opacity
          material.transmission = currentMaterial.transmission || 0
          material.thickness = currentMaterial.thickness || 0.5
          material.ior = currentMaterial.ior || 1.5
          material.opacity = currentMaterial.opacity || 1.0
          material.transparent = material.transmission > 0 || material.opacity < 1.0
        }
      }
    }
  })

  return (
    <mesh ref={meshRef} castShadow receiveShadow>
      <torusGeometry args={[0.5, 0.22, 128, 256]} />
      <meshPhysicalMaterial
        reflectivity={1.0}
        // All material properties are controlled by the animation loop
      />
    </mesh>
  )
})

AnimatedShape.displayName = 'AnimatedShape'

export const TemporalLogo3D = React.memo<TemporalLogo3DProps>(({ 
  size = 24, 
  className 
}) => {
  return (
    <div 
      className={className}
      style={{ width: size, height: size, cursor: 'pointer' }}
    >
      <Canvas
        camera={{ position: [0, 0, 2.5], fov: 45 }}
        style={{ width: '100%', height: '100%' }}
        dpr={window.devicePixelRatio}
        gl={{ 
          antialias: true, 
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2, // Higher exposure for more vibrant colors
          outputColorSpace: THREE.SRGBColorSpace
        }}
        shadows
      >
        {/* Environment Map - re-enabled for realistic reflections */}
        <EnvironmentMap />
        
        {/* Balanced lighting to show material detail */}
        <ambientLight intensity={0.3} color="#f0f0f0" />
        
        {/* Key light for material definition */}
        <directionalLight
          position={[4, 6, 4]}
          intensity={0.8}
          color="#ffffff"
          castShadow
          shadow-mapSize-width={512}
          shadow-mapSize-height={512}
          shadow-camera-near={0.1}
          shadow-camera-far={10}
          shadow-camera-left={-2}
          shadow-camera-right={2}
          shadow-camera-top={2}
          shadow-camera-bottom={-2}
          shadow-bias={-0.0001}
        />
        
        {/* Fill light for subtle detail */}
        <directionalLight
          position={[-3, 2, -2]}
          intensity={0.3}
          color="#e8f4fd"
        />
        
        {/* The main animated shape - rotated 90 degrees on Y axis */}
        <group rotation={[0, Math.PI / 2, 0]}>
          <AnimatedShape />
        </group>
      </Canvas>
    </div>
  )
})

TemporalLogo3D.displayName = 'TemporalLogo3D'
