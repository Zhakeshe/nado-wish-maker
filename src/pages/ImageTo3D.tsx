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
          title: "Готово!",
          description: "3D-модель успешно создана",
        });
      } else if (taskData.status === "FAILED") {
        setIsProcessing(false);
        toast({
          title: "Ошибка",
          description: "Не удалось создать 3D-модель",
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
        title: "Ошибка",
        description: "Не удалось проверить статус обработки",
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
        title: "Обработка началась",
        description: "Обрабатываем фото... это займет 20–60 секунд",
      });

      // Start polling for status
      setTimeout(() => checkTaskStatus(taskData.id), 5000);

    } catch (error) {
      console.error("Error converting image:", error);
      setIsProcessing(false);
      toast({
        title: "Ошибка",
        description: "Не удалось начать обработку изображения",
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
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-archaeology bg-clip-text text-transparent">
            Фото → 3D-модель
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Загрузите фотографию археологической находки, и мы создадим для вас 3D-модель
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Upload Section */}
          <Card className="p-8 border-2 border-primary/20 shadow-elegant">
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
                  <div className="relative w-full max-w-md">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-64 object-cover rounded-lg shadow-soft"
                    />
                    <Button
                      variant="secondary"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Изменить
                    </Button>
                  </div>
                ) : (
                  <Button
                    size="lg"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full max-w-md h-64 border-2 border-dashed border-primary/30 hover:border-primary/60 bg-background/50"
                    variant="outline"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="w-12 h-12" />
                      <span className="text-lg font-medium">Загрузить фото</span>
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
                      Обработка...
                    </>
                  ) : (
                    "Создать 3D-модель"
                  )}
                </Button>
              )}
            </div>
          </Card>

          {/* Progress Section */}
          {isProcessing && taskData && (
            <Card className="p-6 border-2 border-primary/20">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    Статус: {taskData.status === "PENDING" ? "В очереди" : "Обрабатывается"}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {taskData.progress || 0}%
                  </span>
                </div>
                <Progress value={taskData.progress || 0} />
                <p className="text-sm text-muted-foreground text-center">
                  Обрабатываем фото... это займет 20–60 секунд
                </p>
              </div>
            </Card>
          )}

          {/* 3D Model Viewer */}
          {modelUrl && (
            <Card className="p-6 border-2 border-primary/20 shadow-elegant">
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-center">Ваша 3D-модель готова!</h2>
                
                <div className="w-full h-[500px] rounded-lg overflow-hidden bg-gradient-to-br from-background to-muted">
                  <Viewer3D
                    modelUrl={modelUrl}
                    title="Сгенерированная 3D-модель"
                    description="Вращайте и масштабируйте модель для детального просмотра"
                    showBackground={false}
                  />
                </div>

                <Button
                  size="lg"
                  onClick={handleDownload}
                  className="w-full"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Скачать 3D-модель
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
