import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Upload, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Viewer3D } from "@/components/Viewer3D";

const Upload3D = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [modelUrl, setModelUrl] = useState<string>("");
  const [objectTitle, setObjectTitle] = useState("");
  const [objectDescription, setObjectDescription] = useState("");

  const validateFile = (file: File): string | null => {
    const validExtensions = ['.glb', '.obj'];
    const maxSize = 50 * 1024 * 1024; // 50MB
    
    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!validExtensions.includes(extension)) {
      return "Файл форматы қолдамайды. Тек .glb немесе .obj файлдарын жүктеңіз.";
    }
    
    if (file.size > maxSize) {
      return "Файл өлшемі 50MB-тан аспауы керек.";
    }
    
    return null;
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const error = validateFile(file);
    if (error) {
      toast.error(error);
      event.target.value = '';
      return;
    }

    setSelectedFile(file);
    setModelUrl("");
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Файлды таңдаңыз");
      return;
    }

    if (!objectTitle.trim()) {
      toast.error("Объект атауын енгізіңіз");
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error("Авторизация қажет");
      }

      // Create unique file path with user ID
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('3d-models')
        .upload(fileName, selectedFile, {
          cacheControl: '3600',
          upsert: false
        });

      clearInterval(progressInterval);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('3d-models')
        .getPublicUrl(fileName);

      setUploadProgress(95);

      // Save metadata to database
      const { error: dbError } = await supabase
        .from('objects_3d')
        .insert({
          title: objectTitle,
          description: objectDescription || null,
          model_url: publicUrl,
          author_id: user.id,
          status: 'pending'
        });

      if (dbError) {
        // If DB insert fails, clean up the uploaded file
        await supabase.storage.from('3d-models').remove([fileName]);
        throw dbError;
      }

      setUploadProgress(100);
      setModelUrl(publicUrl);
      
      toast.success("3D объект сәтті жүктелді!");
      
      // Reset form
      setTimeout(() => {
        setSelectedFile(null);
        setObjectTitle("");
        setObjectDescription("");
        setUploadProgress(0);
      }, 1000);

    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || "Жүктеу сәтсіз аяқталды");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Артқа
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>3D Объект Жүктеу</CardTitle>
            <CardDescription>
              Өз 3D объектіңізді жүктеп, жеке аккаунтыңызда сақтаңыз
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Объект атауы *</Label>
              <Input
                id="title"
                value={objectTitle}
                onChange={(e) => setObjectTitle(e.target.value)}
                placeholder="Мысалы: Айша Биби кесенесі"
                disabled={uploading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Сипаттама</Label>
              <Input
                id="description"
                value={objectDescription}
                onChange={(e) => setObjectDescription(e.target.value)}
                placeholder="Қысқаша сипаттама (міндетті емес)"
                disabled={uploading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="file">3D файл (.glb, .obj) *</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="file"
                  type="file"
                  accept=".glb,.obj"
                  onChange={handleFileSelect}
                  disabled={uploading}
                  className="cursor-pointer"
                />
                {selectedFile && (
                  <span className="text-sm text-muted-foreground">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Қолдауға алынатын форматтар: .glb, .obj. Максималды өлшем: 50MB
              </p>
            </div>

            {uploading && (
              <div className="space-y-2">
                <Label>Жүктеу барысы</Label>
                <Progress value={uploadProgress} className="w-full" />
                <p className="text-sm text-center text-muted-foreground">
                  {uploadProgress}%
                </p>
              </div>
            )}

            <Button
              onClick={handleUpload}
              disabled={!selectedFile || uploading || !objectTitle.trim()}
              className="w-full"
            >
              <Upload className="mr-2 h-4 w-4" />
              {uploading ? "Жүктелуде..." : "Жүктеу"}
            </Button>
          </CardContent>
        </Card>

        {modelUrl && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Көрсету</CardTitle>
              <CardDescription>Сіздің 3D объектіңіз</CardDescription>
            </CardHeader>
            <CardContent>
              <Viewer3D
                modelUrl={modelUrl}
                title={objectTitle}
                description={objectDescription}
              />
              <div className="mt-4 flex gap-4">
                <Button
                  onClick={() => window.open(modelUrl, '_blank')}
                  variant="outline"
                  className="flex-1"
                >
                  Жүктеп алу
                </Button>
                <Button
                  onClick={() => navigate('/profile')}
                  className="flex-1"
                >
                  Жеке кабинетке өту
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Upload3D;
