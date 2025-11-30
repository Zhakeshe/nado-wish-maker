import { useRef, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, useGLTF, Environment, Grid } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, ZoomIn, ZoomOut, Maximize, Ruler } from "lucide-react";
import * as THREE from "three";

interface Viewer3DProps {
  modelUrl?: string;
  title?: string;
  description?: string;
  showBackground?: boolean;
}

const GLTFModel = ({ url }: { url: string }) => {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
};

// Sample 3D model component (uses a basic geometry when no model URL is provided)
const Model3D = ({ url }: { url?: string }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state, delta) => {
    if (meshRef.current && !hovered) {
      meshRef.current.rotation.y += delta * 0.2;
    }
  });

  if (url) return <GLTFModel url={url} />;

  // Default geometry representing architectural structure
  return (
    <group>
      {/* Base pedestal */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[3, 0.3, 3]} />
        <meshStandardMaterial color="#c4a86a" metalness={0.3} roughness={0.7} />
      </mesh>

      {/* Main column */}
      <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.3, 0.3, 3, 12]} />
        <meshStandardMaterial color="#d4af6a" metalness={0.2} roughness={0.6} />
      </mesh>

      {/* Column capital */}
      <mesh position={[0, 3, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.5, 0.3, 0.4, 12]} />
        <meshStandardMaterial color="#c4a86a" metalness={0.3} roughness={0.5} />
      </mesh>

      {/* Decorative dome */}
      <mesh
        ref={meshRef}
        position={[0, 3.8, 0]}
        castShadow
        receiveShadow
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.6, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial 
          color={hovered ? "#e0c080" : "#d4af6a"} 
          metalness={0.4} 
          roughness={0.4}
        />
      </mesh>

      {/* Decorative elements */}
      {[0, 90, 180, 270].map((angle, i) => (
        <mesh
          key={i}
          position={[
            Math.cos((angle * Math.PI) / 180) * 1.5,
            0.3,
            Math.sin((angle * Math.PI) / 180) * 1.5,
          ]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[0.2, 0.6, 0.2]} />
          <meshStandardMaterial color="#a08860" metalness={0.2} roughness={0.7} />
        </mesh>
      ))}
    </group>
  );
};

export const Viewer3D = ({ 
  modelUrl, 
  title = "Архитектурный объект", 
  description = "3D модель исторического памятника",
  showBackground = true
}: Viewer3DProps) => {
  const [zoom, setZoom] = useState(1);
  const [showMeasurements, setShowMeasurements] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const controlsRef = useRef<OrbitControlsImpl | null>(null);

  const handleReset = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
    setZoom(1);
  };

  const handleZoomIn = () => {
    if (cameraRef.current) {
      const newZoom = Math.min(zoom + 0.2, 3);
      setZoom(newZoom);
      cameraRef.current.position.z = 8 / newZoom;
    }
  };

  const handleZoomOut = () => {
    if (cameraRef.current) {
      const newZoom = Math.max(zoom - 0.2, 0.5);
      setZoom(newZoom);
      cameraRef.current.position.z = 8 / newZoom;
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50' : 'w-full'}`}>
      <Card className={`overflow-hidden ${isFullscreen ? 'h-screen' : 'h-[600px]'}`}>
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-background/90 to-transparent">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold text-foreground">{title}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
            <div className="flex gap-2">
              <Badge variant="secondary">3D</Badge>
              <Badge variant="outline">Интерактивно</Badge>
            </div>
          </div>
        </div>

        {/* 3D Canvas */}
        <Canvas
          shadows
          dpr={[1, 2]}
          camera={{ position: [5, 3, 8], fov: 50 }}
          style={{ 
            background: showBackground 
              ? 'linear-gradient(to bottom, hsl(var(--background)), hsl(var(--muted)))' 
              : 'transparent' 
          }}
        >
          <Suspense fallback={null}>
            <PerspectiveCamera ref={cameraRef} makeDefault position={[5, 3, 8]} />
            
            {/* Lighting */}
            <ambientLight intensity={0.5} />
            <directionalLight
              position={[10, 10, 5]}
              intensity={1}
              castShadow
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
            />
            <spotLight
              position={[-10, 10, -5]}
              angle={0.3}
              penumbra={1}
              intensity={0.5}
              castShadow
            />
            
            {/* Environment */}
            <Environment preset="city" />
            
            {/* Grid */}
            {showMeasurements && (
              <Grid
                args={[10, 10]}
                cellSize={0.5}
                cellThickness={0.5}
                cellColor="#6f6f6f"
                sectionSize={1}
                sectionThickness={1}
                sectionColor="#9d9d9d"
                fadeDistance={25}
                fadeStrength={1}
                followCamera={false}
                infiniteGrid
              />
            )}

            {/* Model */}
            <Model3D url={modelUrl} />

            {/* Controls */}
            <OrbitControls
              ref={controlsRef}
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              minDistance={3}
              maxDistance={20}
              maxPolarAngle={Math.PI / 2}
            />
          </Suspense>
        </Canvas>

        {/* Control Panel */}
        <div className="absolute bottom-0 left-0 right-0 z-10 p-4 bg-gradient-to-t from-background/90 to-transparent">
          <div className="flex justify-center gap-2">
            <Button
              variant="secondary"
              size="icon"
              onClick={handleReset}
              title="Сбросить вид"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            
            <Button
              variant="secondary"
              size="icon"
              onClick={handleZoomIn}
              title="Приблизить"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
            
            <Button
              variant="secondary"
              size="icon"
              onClick={handleZoomOut}
              title="Отдалить"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            
            <Button
              variant={showMeasurements ? "default" : "secondary"}
              size="icon"
              onClick={() => setShowMeasurements(!showMeasurements)}
              title="Показать сетку"
            >
              <Ruler className="w-4 h-4" />
            </Button>
            
            <Button
              variant="secondary"
              size="icon"
              onClick={toggleFullscreen}
              title={isFullscreen ? "Выйти из полноэкранного режима" : "Полноэкранный режим"}
            >
              <Maximize className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Instructions */}
        <div className="absolute top-20 right-4 z-10 bg-background/80 backdrop-blur-sm rounded-lg p-3 text-xs space-y-1 max-w-[200px]">
          <p className="font-semibold">Управление:</p>
          <p>🖱️ Левая кнопка - вращение</p>
          <p>🖱️ Правая кнопка - перемещение</p>
          <p>🔄 Колесо - масштаб</p>
        </div>
      </Card>
    </div>
  );
};
