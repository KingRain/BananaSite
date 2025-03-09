import { useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Physics, useSphere } from "@react-three/cannon";
import { TextureLoader, RepeatWrapping } from "three";
import { useLoader } from "@react-three/fiber";
import bananaTexture from "../assets/banana-icon.svg";

function Banana({ position }) {
  const [ref, api] = useSphere(() => ({
    mass: 0.2,
    position,
    args: [0.3], // Banana size
    restitution: 0.4, // Slight bounce for realism
  }));

  const texture = useLoader(TextureLoader, bananaTexture);
  texture.wrapS = texture.wrapT = RepeatWrapping;

  const [driftDirection] = useState(() => [
    (Math.random() - 0.5) * 0.1,
    (Math.random() - 0.5) * 0.1,
    0
  ]);

  useFrame(() => {
    api.applyForce(driftDirection, [0, 0, 0]);
    api.applyForce([(Math.random() - 0.5) * 0.05, (Math.random() - 0.5) * 0.05, 0], [0, 0, 0]);
    api.applyTorque([0, 0, (Math.random() - 0.5) * 0.002]);
  });

  return (
    <mesh ref={ref}>
      <planeGeometry args={[0.6, 0.6]} />
      <meshBasicMaterial map={texture} transparent />
    </mesh>
  );
}

export default function BananaEffect() {
  const [bananas, setBananas] = useState([]);
  const [bounds, setBounds] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const handleResize = () => {
      setBounds({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      spawnBanana();
    }, 200); // Spawns a banana every 200ms

    return () => clearInterval(interval); // Cleanup when component unmounts
  }, []);

  const spawnBanana = () => {
    const x = (Math.random() * bounds.width - bounds.width / 2) / 100;
    const y = (Math.random() * bounds.height - bounds.height / 2) / 100;
    
    setBananas((prev) => [...prev, { id: Math.random(), position: [x, y, 0] }]);
  };

  return (
    <div className="fixed inset-0">
      <Canvas>
        <Physics gravity={[0, 0, 0]}>
          {bananas.map((banana) => (
            <Banana key={banana.id} position={banana.position} />
          ))}
        </Physics>
      </Canvas>
    </div>
  );
}
