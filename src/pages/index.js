import React from "react"
import { useState, useEffect, useRef } from "react"
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { Canvas, extend, useThree, useFrame } from "react-three-fiber"
import { useSpring , a } from "react-spring/three"

import "./style.css"

extend({ OrbitControls })

const Controls = () => {
  const orbitRef = useRef();
  const { camera, gl } = useThree()

  useFrame(() => {
    orbitRef.current.update()
  })

  return (
    <orbitControls 
      autoRotate
      minPolarAngle={Math.PI / 3}
      maxPolarAngle={Math.PI / 3}
      args={[camera, gl.domElement]}
      ref={orbitRef}
    />
  )
}

const Plane = () => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeBufferGeometry attach="geometry" args={[100, 100]} />
        <meshPhysicalMaterial attach="material" color="white" />
    </mesh>
  )
}

const Spaceship = () => {
  const [model, setModel] = useState()
  useEffect(() => {
    new GLTFLoader().load('/scene.gltf', setModel)
  }, [])
  console.log(model)
  return (
    model ? <primitive object={model.scene} /> : null
  )
}

const Box = () => {
  const [hovered, setHovered] = useState(false)
  const [active, setActive] = useState(false)

  // react spring can take static values to values that animate by themselves
  const props = useSpring ({
    scale: active ? [1.5, 1.5, 1.5] : [1, 1, 1],
    color: hovered ?  'hotpink' : 'gray'
  })

  return (
    <a.mesh
      onPointerOver={() => setHovered(true)} 
      onPointerOut={() => setHovered(false)}
      onClick={() => setActive(!active)}
      scale={props.scale}
      castShadow
    >

      <boxBufferGeometry attach="geometry" args={[1,1,1]} />
      <a.meshPhysicalMaterial attach="material" color={props.color}/>
    </a.mesh>
  )
}

export default () => {
  // GPU canvas rendering at 60fps by default
  return (
    <>
      <h1>Hi earth</h1>
      <Canvas camera={{position: [0, 0, 5]}} onCreated={({ gl }) => {
        gl.shadowMap.enabled = true
        gl.shadowMap.type = THREE.PCFSoftShadowMap
      }}>
        <ambientLight />
        <spotLight position={[0, 5, 10]} penumbra={1} castShadow/>
        <fog attach="fog" args={["white", 15, 35]} />
        <Controls />
        {/* <Box /> */}
        {/* <Plane /> */}
        <Spaceship />
      </Canvas>
    </>
  )
}