import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Upload, Download, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Viewer3D } from "@/components/Viewer3D";

type TaskStatus = "PENDING" | "IN_PROGRESS" | "SUCCEEDED" | "FAILED";

interface TaskData {
  id: string;
  status: TaskStatus;
  model_urls?: {
    glb?: string;
    fbx?: string;
    obj?: string;
  };
  progress?: number;
}

export default function ImageTo3D() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [taskData, setTaskData] = useState<TaskData | null>(null);
  const [modelUrl, setModelUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setModelUrl("");
      setTaskData(null);
    }
  };

  const checkTaskStatus = async (taskId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('image-to-3d', {
        body: { taskId },
        method: 'POST',
      });

      if (error) throw error;

      const taskData = data as TaskData;
      setTaskData(taskData);

      if (taskData.status === "SUCCEEDED" && taskData.model_urls?.glb) {
        setModelUrl(taskData.model_urls.glb);
        setIsProcessing(false);
      toast({
        title: "Success!",
        description: "3D model generated successfully",
      });
      } else if (taskData.status === "FAILED") {
        setIsProcessing(false);
      toast({
        title: "Error",
        description: "Failed to generate 3D model",
        variant: "destructive",
      });
      } else {
        // Continue polling
        setTimeout(() => checkTaskStatus(taskId), 5000);
      }
    } catch (error) {
      console.error("Error checking task status:", error);
      setIsProcessing(false);
      toast({
        title: "Error",
        description: "Failed to check processing status",
        variant: "destructive",
      });
    }
  };

  const handleConvert = async () => {
    if (!selectedImage) return;

    setIsProcessing(true);
    setTaskData(null);

    try {
      const formData = new FormData();
      formData.append('image', selectedImage);

      const { data, error } = await supabase.functions.invoke('image-to-3d', {
        body: formData,
      });

      if (error) throw error;

      const taskData = data as TaskData;
      setTaskData(taskData);

      toast({
        title: "Processing Started",
        description: "Generating 3D model... This will take 20–40 seconds",
      });

      // Start polling for status
      setTimeout(() => checkTaskStatus(taskData.id), 5000);

    } catch (error) {
      console.error("Error converting image:", error);
      setIsProcessing(false);
      toast({
        title: "Error",
        description: "Failed to start image processing",
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    if (modelUrl) {
      const a = document.createElement('a');
      a.href = modelUrl;
      a.download = 'model.glb';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-archaeology bg-clip-text text-transparent">
            3D Model Generator
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Upload your photo and AI will generate an interactive 3D model in 20-40 seconds
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Upload Section */}
          <Card className="p-8 border-2 border-primary/20 shadow-elegant animate-scale-in">
            <div className="space-y-6">
              <div className="flex flex-col items-center justify-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                
                {previewUrl ? (
                  <div className="relative w-full max-w-md animate-fade-in">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-64 object-cover rounded-lg shadow-soft transition-transform hover:scale-105"
                    />
                    <Button
                      variant="secondary"
                      size="sm"
                      className="absolute top-2 right-2 shadow-lg"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Change
                    </Button>
                  </div>
                ) : (
                  <Button
                    size="lg"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full max-w-md h-64 border-2 border-dashed border-primary/30 hover:border-primary/60 bg-background/50 transition-all hover:scale-105"
                    variant="outline"
                  >
                    <div className="flex flex-col items-center gap-4">
                      <Upload className="w-16 h-16 animate-pulse" />
                      <span className="text-lg font-medium">Upload Photo</span>
                      <span className="text-sm text-muted-foreground">JPG, JPEG, PNG (max 10MB)</span>
                    </div>
                  </Button>
                )}
              </div>

              {selectedImage && !modelUrl && (
                <Button
                  size="lg"
                  onClick={handleConvert}
                  disabled={isProcessing}
                  className="w-full"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Generate 3D Model"
                  )}
                </Button>
              )}
            </div>
          </Card>

          {/* Progress Section */}
          {isProcessing && taskData && (
            <Card className="p-8 border-2 border-primary/20 animate-fade-in bg-gradient-to-br from-background to-primary/5">
              <div className="space-y-6">
                <div className="flex items-center justify-center mb-4">
                  <Loader2 className="w-12 h-12 animate-spin text-primary" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-base font-medium">
                    Status: {taskData.status === "PENDING" ? "In queue..." : "Generating 3D model..."}
                  </span>
                  <span className="text-base font-bold text-primary">
                    {taskData.progress || 0}%
                  </span>
                </div>
                <Progress value={taskData.progress || 0} className="h-3" />
                <div className="text-center space-y-2">
                  <p className="text-base font-medium text-primary">
                    AI is generating your 3D model
                  </p>
                  <p className="text-sm text-muted-foreground">
                    This may take up to 20–40 seconds...
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* 3D Model Viewer */}
          {modelUrl && (
            <Card className="p-8 border-2 border-primary/20 shadow-elegant animate-scale-in">
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-3xl font-bold bg-gradient-archaeology bg-clip-text text-transparent">
                    Your 3D Model is Ready! 🎉
                  </h2>
                  <p className="text-muted-foreground">
                    Rotate and zoom to explore your model in detail
                  </p>
                </div>
                
                <div className="w-full h-[500px] rounded-lg overflow-hidden bg-gradient-to-br from-background to-muted shadow-soft border border-primary/10">
                  <Viewer3D
                    modelUrl={modelUrl}
                    title="Generated 3D Model"
                    description="Use mouse to interact with the model"
                    showBackground={false}
                  />
                </div>

                <div className="flex gap-4">
                  <Button
                    size="lg"
                    onClick={handleDownload}
                    className="flex-1 shadow-elegant"
                  >
                    <Download className="mr-2 h-5 w-5" />
                    Download 3D Model (.glb)
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => {
                      setModelUrl("");
                      setPreviewUrl("");
                      setSelectedImage(null);
                      setTaskData(null);
                    }}
                    className="flex-1"
                  >
                    Create New
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
