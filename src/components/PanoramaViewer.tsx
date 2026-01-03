import { useRef, useEffect, useState } from "react";
import { PanoViewer, PROJECTION_TYPE } from "@egjs/react-view360";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, ChevronRight, ChevronUp, ChevronDown, 
  ZoomIn, ZoomOut, Maximize, RotateCcw, Move
} from "lucide-react";

interface PanoramaViewerProps {
  imageUrl: string;
  title?: string;
  className?: string;
}

export const PanoramaViewer = ({ imageUrl, title, className = "" }: PanoramaViewerProps) => {
  const viewerRef = useRef<any>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [yaw, setYaw] = useState(0);
  const [pitch, setPitch] = useState(0);

  const handleRotate = (yawDelta: number, pitchDelta: number) => {
    const viewer = viewerRef.current;
    if (viewer) {
      const newYaw = yaw + yawDelta;
      const newPitch = Math.max(-85, Math.min(85, pitch + pitchDelta));
      viewer.lookAt({ yaw: newYaw, pitch: newPitch }, 300);
      setYaw(newYaw);
      setPitch(newPitch);
    }
  };

  const handleReset = () => {
    const viewer = viewerRef.current;
    if (viewer) {
      viewer.lookAt({ yaw: 0, pitch: 0, fov: 65 }, 500);
      setYaw(0);
      setPitch(0);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const handleViewChange = (e: any) => {
    if (e.yaw !== undefined) setYaw(e.yaw);
    if (e.pitch !== undefined) setPitch(e.pitch);
  };

  return (
    <div 
      ref={containerRef}
      className={`relative w-full bg-muted rounded-lg overflow-hidden ${className} ${isFullscreen ? 'h-screen' : 'aspect-video'}`}
    >
      <PanoViewer
        ref={viewerRef}
        tag="div"
        image={imageUrl}
        projectionType={PROJECTION_TYPE.EQUIRECTANGULAR}
        useZoom={true}
        useKeyboard={true}
        gyroMode="yawPitch"
        onViewChange={handleViewChange}
        style={{ width: "100%", height: "100%" }}
      />

      {/* Title overlay */}
      {title && (
        <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-lg">
          <span className="text-sm font-medium">{title}</span>
        </div>
      )}

      {/* Navigation Controls */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-background/80 backdrop-blur-sm rounded-lg p-2">
        {/* Direction controls */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => handleRotate(-30, 0)}
            title="Солға"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className="flex flex-col gap-0.5">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-8"
              onClick={() => handleRotate(0, -20)}
              title="Жоғары"
            >
              <ChevronUp className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-8"
              onClick={() => handleRotate(0, 20)}
              title="Төмен"
            >
              <ChevronDown className="h-3 w-3" />
            </Button>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => handleRotate(30, 0)}
            title="Оңға"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="w-px h-8 bg-border" />

        {/* Utility controls */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleReset}
            title="Қалпына келтіру"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={toggleFullscreen}
            title="Толық экран"
          >
            <Maximize className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Drag hint */}
      <div className="absolute top-4 right-4 flex items-center gap-1 bg-background/60 backdrop-blur-sm px-2 py-1 rounded text-xs text-muted-foreground">
        <Move className="h-3 w-3" />
        <span>Сүйреңіз</span>
      </div>
    </div>
  );
};
