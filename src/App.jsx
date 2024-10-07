import { useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Earth from '../public/Earth';
import './App.css';  // Import the CSS file

function Jellyfish({ position, onClick }) {
  const [jellyfishPosition, setJellyfishPosition] = useState(position);

  useFrame(() => {
    setJellyfishPosition((prevPosition) => [
      prevPosition[0],
      Math.max(-10, prevPosition[1] + Math.sin(Date.now() / 1000) * 0.2), // Keep jellyfish above the sea floor
      prevPosition[2],
    ]);
  });

  return (
    <group position={jellyfishPosition} onClick={onClick}>
      {/* Head */}
      <mesh position={[0, 6, 0]}>
        <sphereGeometry args={[3, 32, 32]} />
        <meshStandardMaterial color="pink" />
      </mesh>
      {/* Tentacles */}
      {[...Array(20)].map((_, i) => (
        <mesh key={i} position={[0, -3, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 6]} />
          <meshStandardMaterial color="pink" />
          <group rotation={[0, (i * Math.PI) / 4, 0]}>
            <mesh position={[0, -3, 0]}>
              <cylinderGeometry args={[0.2, 0.2, 6]} />
              <meshStandardMaterial color="pink" />
            </mesh>
          </group>
        </mesh>
      ))}
    </group>
  );
}

function Clam({ position, onClick }) {
  return (
    <group position={position} onClick={onClick}>
      <mesh>
        <sphereGeometry args={[2, 32, 32]} />
        <meshStandardMaterial color="darkgrey" />
      </mesh>
      <mesh position={[0, 2, 0]}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshStandardMaterial color="lightgrey" />
      </mesh>
    </group>
  );
}

function TubeWorm({ position, onClick }) {
  return (
    <group position={position} onClick={onClick}>
      <mesh>
        <cylinderGeometry args={[0.4, 0.4, 6]} />
        <meshStandardMaterial color="red" />
      </mesh>
    </group>
  );
}

function Fish({ position, onClick }) {
  const [fishPosition, setFishPosition] = useState(position);

  useFrame(() => {
    setFishPosition((prevPosition) => [
      prevPosition[0] + (Math.sin(Date.now() / 1000) * 0.2), // Move fish horizontally
      prevPosition[1],
      prevPosition[2] + (Math.cos(Date.now() / 1000) * 0.2), // Move fish depth-wise
    ]);
  });

  return (
    <group position={fishPosition} onClick={onClick}>
      <mesh>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshStandardMaterial color="blue" />
      </mesh>
      <mesh position={[0, 0, 2]}>
        <sphereGeometry args={[0.75, 32, 32]} />
        <meshStandardMaterial color="lightblue" />
      </mesh>
      <mesh position={[0, 0, 2.5]}>
        <sphereGeometry args={[0.25, 32, 32]} />
        <meshStandardMaterial color="black" />
      </mesh>
      <mesh position={[-0.75, 0, -1.5]}>
        <planeGeometry args={[1.5, 1.5]} />
        <meshStandardMaterial color="blue" />
      </mesh>
    </group>
  );
}

function Shrimp({ position, onClick }) {
  return (
    <group position={position} onClick={onClick}>
      <mesh position={[0, 0.5, 0]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="orange" />
      </mesh>
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 2]} />
        <meshStandardMaterial color="orange" />
      </mesh>
    </group>
  );
}

function Bubble({ position }) {
  const [bubblePosition, setBubblePosition] = useState(position);

  useFrame(() => {
    setBubblePosition((prevPosition) => [
      prevPosition[0],
      prevPosition[1] + 0.1, // Bubble rising speed
      prevPosition[2],
    ]);
  });

  // Return null when the bubble goes too high (outside of view)
  if (bubblePosition[1] > 10) {
    return null;
  }

  return (
    <mesh position={bubblePosition}>
      <sphereGeometry args={[0.5, 16, 16]} />
      <meshStandardMaterial color="white" transparent={true} opacity={0.6} />
    </mesh>
  );
}

function HydrothermalVent({ position, onClick }) {
  const [bubbles, setBubbles] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setBubbles((prevBubbles) => [
        ...prevBubbles,
        { 
          id: Math.random(),
          position: [position[0] + Math.random() * 1 - 0.5, position[1] + 5, position[2] + Math.random() * 1 - 0.5],  // Spawn at the top of the vent
        },
      ]);
    }, 500); // Generate a new bubble every 500ms

    return () => clearInterval(interval);
  }, [position]);

  // Remove bubbles that have gone too high
  const activeBubbles = bubbles.filter(bubble => bubble.position[1] <= 10);

  return (
    <group position={position} onClick={onClick}>
      {/* Vent structure */}
      <mesh>
        <cylinderGeometry args={[2, 2, 10]} />
        <meshStandardMaterial color="gray" />
      </mesh>

      {/* Bubbles emerging from the top */}
      {activeBubbles.map((bubble) => (
        <Bubble key={bubble.id} position={bubble.position} />
      ))}
    </group>
  );
}

function App() {
  const [showOcean, setShowOcean] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [description, setDescription] = useState('');

  const handleClick = () => {
    setShowOcean(true);
  };

  const handleJellyfishClick = () => {
    setSelectedAnimal('Jellyfish');
    setDescription('Jellyfish are soft-bodied marine animals that drift through the oceans.');
  };

  const handleClamClick = () => {
    setSelectedAnimal('Giant Clam');
    setDescription('Giant clams (Calyptogena magnifica) live near hydrothermal vents and contain symbiotic chemosynthetic bacteria in their gills that help them obtain energy from the chemicals seeping from the Earth’s crust.');
  };

  const handleTubeWormClick = () => {
    setSelectedAnimal('Tube Worm');
    setDescription('Tube worms (Riftia pachyptila) live near hydrothermal vents in the deep sea. They have a symbiotic relationship with chemosynthetic bacteria that live inside them, converting chemicals from vent fluids into energy, which sustains the tube worms.');
  };

  const handleFishClick = () => {
    setSelectedAnimal('Vent Fish');
    setDescription('Various species of fish live near hydrothermal vents, feeding on smaller organisms like shrimp, crabs, and other invertebrates. While not directly relying on chemosynthesis, they are part of this unique food web.');
  };

  const handleShrimpClick = () => {
    setSelectedAnimal('Vent Shrimp');
    setDescription('Vent shrimp (Rimicaris exoculata) live near hydrothermal vents and cluster around vent openings. They either feed on chemosynthetic bacteria or have bacteria living in their gills to supply them with nutrients.');
  };

  const handleHydrothermalVentClick = () => {
    setSelectedAnimal('Hydrothermal Vent');
    setDescription('Hydrothermal vents are fissures in the ocean floor that release hot, mineral-rich water. They support diverse ecosystems, including unique organisms like tube worms, clams, and crabs.');
  };

  const handleUndo = () => {
    setShowOcean(false);
    setSelectedAnimal(null);
    setDescription('');
  };

  // New function to handle closing the description
  const handleCloseDescription = () => {
    setSelectedAnimal(null);
    setDescription('');
  };

  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: showOcean ? 'darkblue' : 'black' }}>
      {!showOcean ? (
        <Canvas onClick={handleClick}>
          <ambientLight />
          <OrbitControls />
          <Earth />
        </Canvas>
      ) : (
        <div>
          {/* Ocean scene with the ocean floor */}
          <Canvas>
            <ambientLight intensity={0.5} />
            <OrbitControls />
            
            {/* Adding a simple plane to represent the ocean floor */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -10, 0]}>
              <planeGeometry args={[500, 500]} />
              <meshStandardMaterial color="#C4A484" />
            </mesh>

            {/* Jellyfish Model with sway animation */}
            {[[-30, -5, -30], [30, -5, 30], [-45, -5, 45], [45, -5, -45], [0, -5, 40], [35, -5, -35]].map((pos, i) => (
              <Jellyfish key={i} position={pos} onClick={handleJellyfishClick} />
            ))}
            
            {/* Clams */}
            {[[-15, -10, 10], [15, -10, -10]].map((pos, i) => (
              <Clam key={i} position={pos} onClick={handleClamClick} />
            ))}

            {/* Tube Worms */}
            {[[-25, -10, 15], [25, -10, -15]].map((pos, i) => (
              <TubeWorm key={i} position={pos} onClick={handleTubeWormClick} />
            ))}

            {/* Fish - More positions added */}
            {[[-10, -8, -20], [10, -8, 20], [-15, -8, 5], [15, -8, -5], [-5, -8, -15], [5, -8, 15], [-25, -8, 10], [25, -8, -10]].map((pos, i) => (
              <Fish key={i} position={pos} onClick={handleFishClick} />
            ))}

            {/* Shrimp */}
            {[[-10, -5, 20], [20, -5, 20]].map((pos, i) => (
              <Shrimp key={i} position={pos} onClick={handleShrimpClick} />
            ))}

            {/* Hydrothermal Vents */}
            {[[-40, -10, 40], [40, -10, -40], [-35, -10, -35], [35, -10, 35], [-20, -10, 25], [-30, -10, 35], [-40, -10, 40]].map((pos, i) => (
              <HydrothermalVent key={i} position={pos} onClick={handleHydrothermalVentClick} />
            ))}

            {/* Random bubbles */}
            {[...Array(40)].map((_, i) => (
              <Bubble key={i} position={[Math.random() * 100 - 50, -10, Math.random() * 100 - 50]} />
            ))}
          </Canvas>

          {/* Undo Button */}
          <button 
            onClick={handleUndo} 
            style={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              padding: '10px',
              backgroundColor: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}>
            Undo
          </button>

          {/* Selected Animal Info */}
          {selectedAnimal && (
            <div className="pop-up-box">
              <h3>{selectedAnimal}</h3>
              <p>{description}</p>
              {/* Exit button */}
              <button 
                onClick={handleCloseDescription} 
                style={{
                  position: 'absolute',
                  top: '5px',
                  right: '5px',
                  padding: '5px 10px',
                  backgroundColor: 'red',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}>
                X
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
