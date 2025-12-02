import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, ArrowLeft, Camera, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Viewer3D } from "@/components/Viewer3D";

const Upload3D = () => {
  const navigate = useNavigate();
  
  // File upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [modelUrl, setModelUrl] = useState<string>("");
  const [objectTitle, setObjectTitle] = useState("");
  const [objectDescription, setObjectDescription] = useState("");

  // Photo-to-3D state
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [generating, setGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generatedModelUrl, setGeneratedModelUrl] = useState<string>("");
  const [generationTitle, setGenerationTitle] = useState("");
  const [generationDescription, setGenerationDescription] = useState("");

  const validateFile = (file: File): string | null => {
    const validExtensions = ['.glb', '.obj'];
    const maxSize = 50 * 1024 * 1024;
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

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error("Тек JPEG, PNG немесе WebP форматындағы суреттер қолдайды");
      event.target.value = '';
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Сурет өлшемі 10MB-тан аспауы керек");
      event.target.value = '';
      return;
    }

    setSelectedImage(file);
    setGeneratedModelUrl("");
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
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
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error("Авторизация қажет");
      }

      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const { error: uploadError } = await supabase.storage
        .from('3d-models')
        .upload(fileName, selectedFile, {
          cacheControl: '3600',
          upsert: false
        });

      clearInterval(progressInterval);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('3d-models')
        .getPublicUrl(fileName);

      setUploadProgress(95);

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
        await supabase.storage.from('3d-models').remove([fileName]);
        throw dbError;
      }

      setUploadProgress(100);
      setModelUrl(publicUrl);
      
      toast.success("3D объект сәтті жүктелді!");
      
      setTimeout(() => {
        setSelectedFile(null);
        setObjectTitle("");
        setObjectDescription("");
        setUploadProgress(0);
      }, 1000);

    } catch (error) {
      console.error("Upload error:", error);
      const errorMessage = error instanceof Error ? error.message : "Жүктеу сәтсіз аяқталды";
      toast.error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleGenerate3D = async () => {
    if (!selectedImage) {
      toast.error("Суретті таңдаңыз");
      return;
    }

    if (!generationTitle.trim()) {
      toast.error("Объект атауын енгізіңіз");
      return;
    }

    setGenerating(true);
    setGenerationProgress(5);

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error("Авторизация қажет");
      }

      // Upload image to storage first
      const imageExt = selectedImage.name.split('.').pop();
      const imageName = `${user.id}/source-images/${Date.now()}.${imageExt}`;

      const { error: imageUploadError } = await supabase.storage
        .from('3d-models')
        .upload(imageName, selectedImage, {
          cacheControl: '3600',
          upsert: false
        });

      if (imageUploadError) {
        throw new Error("Суретті жүктеу сәтсіз: " + imageUploadError.message);
      }

      const { data: { publicUrl: imageUrl } } = supabase.storage
        .from('3d-models')
        .getPublicUrl(imageName);

      setGenerationProgress(15);
      toast.info("Meshy AI арқылы 3D модель жасалуда...");

      // Create Meshy task
      const { data: createData, error: createError } = await supabase.functions.invoke('generate-3d-from-image', {
        body: { action: 'create', imageUrl }
      });

      if (createError || createData?.error) {
        throw new Error(createData?.error || createError?.message || "Meshy API қатесі");
      }

      const taskId = createData.result;
      console.log("Meshy task created:", taskId);

      // Poll for completion
      let attempts = 0;
      const maxAttempts = 120; // 10 minutes max

      const checkStatus = async (): Promise<string> => {
        const { data: statusData, error: statusError } = await supabase.functions.invoke('generate-3d-from-image', {
          body: { action: 'status', taskId }
        });

        if (statusError || statusData?.error) {
          throw new Error(statusData?.error || statusError?.message || "Статус тексеру қатесі");
        }

        const status = statusData.status;
        const progress = statusData.progress || 0;
        
        setGenerationProgress(15 + Math.floor(progress * 0.8));

        if (status === 'SUCCEEDED') {
          return statusData.model_urls?.glb || statusData.model_url;
        } else if (status === 'FAILED') {
          throw new Error("3D модель жасау сәтсіз аяқталды");
        } else if (status === 'PENDING' || status === 'IN_PROGRESS') {
          attempts++;
          if (attempts >= maxAttempts) {
            throw new Error("Уақыт өтіп кетті. Қайта көріңіз.");
          }
          await new Promise(resolve => setTimeout(resolve, 5000));
          return checkStatus();
        }

        throw new Error("Белгісіз статус: " + status);
      };

      const modelUrl = await checkStatus();
      
      if (!modelUrl) {
        throw new Error("3D модель URL табылмады");
      }

      setGenerationProgress(95);

      // Save to database
      const { error: dbError } = await supabase
        .from('objects_3d')
        .insert({
          title: generationTitle,
          description: generationDescription || "Meshy AI арқылы жасалған",
          model_url: modelUrl,
          thumbnail_url: imageUrl,
          author_id: user.id,
          status: 'pending'
        });

      if (dbError) {
        console.error("DB error:", dbError);
      }

      setGenerationProgress(100);
      setGeneratedModelUrl(modelUrl);
      
      toast.success("3D модель сәтті жасалды!");

    } catch (error) {
      console.error("Generation error:", error);
      const errorMessage = error instanceof Error ? error.message : "3D жасау сәтсіз аяқталды";
      toast.error(errorMessage);
    } finally {
      setGenerating(false);
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

        <Tabs defaultValue="upload" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 h-14">
            <TabsTrigger value="upload" className="flex items-center gap-2 text-base">
              <Upload className="h-5 w-5" />
              3D Файл жүктеу
            </TabsTrigger>
            <TabsTrigger value="generate" className="flex items-center gap-2 text-base">
              <Sparkles className="h-5 w-5" />
              Фотодан 3D жасау
            </TabsTrigger>
          </TabsList>

          {/* File Upload Tab */}
          <TabsContent value="upload">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5 text-primary" />
                  3D Объект Жүктеу
                </CardTitle>
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
          </TabsContent>

          {/* Photo to 3D Tab */}
          <TabsContent value="generate">
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 p-1">
                <CardHeader className="bg-card rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Фотодан 3D Модель Жасау
                  </CardTitle>
                  <CardDescription>
                    Meshy AI арқылы суреттен автоматты түрде 3D модель жасаңыз
                  </CardDescription>
                </CardHeader>
              </div>
              <CardContent className="space-y-6 pt-6">
                <div className="space-y-2">
                  <Label htmlFor="gen-title">Объект атауы *</Label>
                  <Input
                    id="gen-title"
                    value={generationTitle}
                    onChange={(e) => setGenerationTitle(e.target.value)}
                    placeholder="Мысалы: Көне ыдыс"
                    disabled={generating}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gen-description">Сипаттама</Label>
                  <Input
                    id="gen-description"
                    value={generationDescription}
                    onChange={(e) => setGenerationDescription(e.target.value)}
                    placeholder="Қысқаша сипаттама (міндетті емес)"
                    disabled={generating}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Сурет (JPEG, PNG, WebP) *</Label>
                  <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/50 transition-colors">
                    <Input
                      id="image"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleImageSelect}
                      disabled={generating}
                      className="hidden"
                    />
                    <label htmlFor="image" className="cursor-pointer block">
                      {imagePreview ? (
                        <div className="space-y-4">
                          <img 
                            src={imagePreview} 
                            alt="Preview" 
                            className="max-h-64 mx-auto rounded-lg shadow-lg"
                          />
                          <p className="text-sm text-muted-foreground">
                            Басқа сурет таңдау үшін басыңыз
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4 py-8">
                          <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                            <Camera className="h-8 w-8 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">Сурет жүктеу үшін басыңыз</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              JPEG, PNG немесе WebP, макс. 10MB
                            </p>
                          </div>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                {generating && (
                  <div className="space-y-3 bg-muted/50 rounded-xl p-4">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      <Label>3D модель жасалуда...</Label>
                    </div>
                    <Progress value={generationProgress} className="w-full h-3" />
                    <p className="text-sm text-center text-muted-foreground">
                      {generationProgress}% — Бұл бірнеше минут алуы мүмкін
                    </p>
                  </div>
                )}

                <Button
                  onClick={handleGenerate3D}
                  disabled={!selectedImage || generating || !generationTitle.trim()}
                  className="w-full h-12 text-base"
                  size="lg"
                >
                  {generating ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Жасалуда...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      3D Модель Жасау
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {generatedModelUrl && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Жасалған 3D Модель
                  </CardTitle>
                  <CardDescription>Meshy AI арқылы жасалды</CardDescription>
                </CardHeader>
                <CardContent>
                  <Viewer3D
                    modelUrl={generatedModelUrl}
                    title={generationTitle}
                    description={generationDescription || "Meshy AI арқылы жасалған"}
                  />
                  <div className="mt-4 flex gap-4">
                    <Button
                      onClick={() => window.open(generatedModelUrl, '_blank')}
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Upload3D;
