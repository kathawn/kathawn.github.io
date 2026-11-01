import { Line, Text } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { flowNodes, getNode, spine } from './nodes'

const BRAND = '#1d4ed8'
const BRAND_SOFT = '#93c5fd'
const INK = '#1e293b'
const MUTED = '#94a3b8'
const LINE = '#cbd5e1'

function SpineCurve() {
  const points = useMemo(() => spine.map((id) => getNode(id).position), [])
  const curve = useMemo(
    () => new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p)), false, 'catmullrom', 0.3),
    [points],
  )
  const linePoints = useMemo(() => curve.getPoints(80), [curve])

  return (
    <>
      <Line points={linePoints} color={BRAND_SOFT} lineWidth={1.5} transparent opacity={0.6} />
      <FlowParticles curve={curve} />
    </>
  )
}

function FlowParticles({ curve }: { curve: THREE.CatmullRomCurve3 }) {
  const count = 3
  const refs = useRef<(THREE.Mesh | null)[]>([])
  const progress = useRef(
    Array.from({ length: count }, (_, i) => ({ t: i / count })),
  )

  useGSAP(() => {
    progress.current.forEach((p, i) => {
      gsap.to(p, {
        t: 1,
        duration: 5,
        repeat: -1,
        ease: 'none',
        delay: i * (5 / count) * -1,
      })
    })
  }, [])

  useFrame(() => {
    progress.current.forEach((p, i) => {
      const t = ((p.t % 1) + 1) % 1
      const point = curve.getPointAt(t)
      const mesh = refs.current[i]
      if (mesh) mesh.position.copy(point)
    })
  })

  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <mesh key={i} ref={(el) => void (refs.current[i] = el)}>
          <sphereGeometry args={[0.055, 16, 16]} />
          <meshBasicMaterial color={BRAND} />
        </mesh>
      ))}
    </>
  )
}

function SatelliteLinks() {
  const satellites = flowNodes.filter((n) => n.kind === 'satellite')
  return (
    <>
      {satellites.map((sat) => {
        const parent = getNode(sat.parent!)
        const points = [new THREE.Vector3(...parent.position), new THREE.Vector3(...sat.position)]
        return <Line key={sat.id} points={points} color={LINE} lineWidth={1} transparent opacity={0.5} />
      })}
    </>
  )
}

function Node({ id }: { id: string }) {
  const node = getNode(id)
  const isMain = node.kind === 'main'
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t = clock.getElapsedTime()
    const bob = Math.sin(t * 0.6 + node.position[0]) * 0.05
    meshRef.current.position.y = node.position[1] + bob
  })

  return (
    <group>
      <mesh ref={meshRef} position={node.position}>
        <sphereGeometry args={[isMain ? 0.14 : 0.07, 24, 24]} />
        <meshStandardMaterial
          color={isMain ? BRAND : '#ffffff'}
          emissive={isMain ? BRAND : MUTED}
          emissiveIntensity={isMain ? 0.35 : 0.08}
          roughness={0.35}
          metalness={0.1}
        />
      </mesh>
      <Text
        position={[node.position[0], node.position[1] + (isMain ? 0.34 : 0.22), node.position[2]]}
        fontSize={isMain ? 0.17 : 0.12}
        color={isMain ? INK : MUTED}
        anchorX="center"
        anchorY="middle"
      >
        {node.label}
      </Text>
    </group>
  )
}

function Rig({ children }: { children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null)
  const { pointer } = useThree()

  useFrame(() => {
    if (!group.current) return
    const targetX = pointer.y * 0.12
    const targetY = pointer.x * 0.2
    group.current.rotation.x += (targetX - group.current.rotation.x) * 0.04
    group.current.rotation.y += (targetY - group.current.rotation.y) * 0.04
  })

  return (
    <group ref={group} scale={0.62}>
      {children}
    </group>
  )
}

export function DataFlowScene() {
  return (
    <>
      <ambientLight intensity={0.9} />
      <directionalLight position={[4, 6, 5]} intensity={0.6} />
      <Rig>
        <SpineCurve />
        <SatelliteLinks />
        {flowNodes.map((n) => (
          <Node key={n.id} id={n.id} />
        ))}
      </Rig>
    </>
  )
}
