import React, { useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

export default function Jellyfish(props) {
  const { nodes, materials } = useGLTF('/Jellyfish/jellyfish.gltf');
  const jellyfishRef = useRef();

  return (
    <group ref={jellyfishRef} {...props} dispose={null}>
      {/* Ensure nodes and materials exist before rendering */}
      {nodes.ringen1_lambert4_0 && materials.lambert4 && (
        <mesh geometry={nodes.ringen1_lambert4_0.geometry} material={materials.lambert4} />
      )}
      {nodes.ringen_2_lambert3_0 && materials.lambert3 && (
        <mesh geometry={nodes.ringen_2_lambert3_0.geometry} material={materials.lambert3} />
      )}
    </group>
  );
}

useGLTF.preload('/Jellyfish/jellyfish.gltf');
