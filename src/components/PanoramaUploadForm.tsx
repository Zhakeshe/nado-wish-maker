import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload, MapPin, Image as ImageIcon, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface PanoramaUploadFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const translations = {
  ru: {
    title: "Загрузить панораму",
    titleLabel: "Название",
    titlePlaceholder: "Название панорамы",
    descriptionLabel: "Описание",
    descriptionPlaceholder: "Краткое описание места",
    locationLabel: "Местоположение",
    locationPlaceholder: "Например: Алматы, Көктөбе",
    selectFile: "Выберите файл панорамы",
    fileHint: "Поддерживаются файлы JPG, PNG (equirectangular). Максимум 20MB",
    uploading: "Загрузка...",
    upload: "Загрузить",
    cancel: "Отмена",
    success: "Панорама успешно загружена!",
    pending: "Панорама отправлена на модерацию",
    error: "Ошибка при загрузке",
    invalidFile: "Неверный формат файла. Используйте JPG или PNG",
    fileTooLarge: "Файл слишком большой. Максимум 20MB",
    fillRequired: "Заполните все обязательные поля",
  },
  kz: {
    title: "Панорама жүктеу",
    titleLabel: "Атауы",
    titlePlaceholder: "Панорама атауы",
    descriptionLabel: "Сипаттама",
    descriptionPlaceholder: "Орын туралы қысқаша сипаттама",
    locationLabel: "Орналасқан жері",
    locationPlaceholder: "Мысалы: Алматы, Көктөбе",
    selectFile: "Панорама файлын таңдаңыз",
    fileHint: "JPG, PNG файлдары қолдау көрсетіледі (equirectangular). Максимум 20MB",
    uploading: "Жүктелуде...",
    upload: "Жүктеу",
    cancel: "Болдырмау",
    success: "Панорама сәтті жүктелді!",
    pending: "Панорама модерацияға жіберілді",
    error: "Жүктеу кезінде қате",
    invalidFile: "Файл форматы дұрыс емес. JPG немесе PNG қолданыңыз",
    fileTooLarge: "Файл тым үлкен. Максимум 20MB",
    fillRequired: "Барлық міндетті өрістерді толтырыңыз",
  },
  en: {
    title: "Upload Panorama",
    titleLabel: "Title",
    titlePlaceholder: "Panorama title",
    descriptionLabel: "Description",
    descriptionPlaceholder: "Brief description of the location",
    locationLabel: "Location",
    locationPlaceholder: "e.g., Almaty, Kok-Tobe",
    selectFile: "Select panorama file",
    fileHint: "JPG, PNG files supported (equirectangular). Max 20MB",
    uploading: "Uploading...",
    upload: "Upload",
    cancel: "Cancel",
    success: "Panorama uploaded successfully!",
    pending: "Panorama submitted for moderation",
    error: "Error uploading",
    invalidFile: "Invalid file format. Use JPG or PNG",
    fileTooLarge: "File too large. Max 20MB",
    fillRequired: "Please fill all required fields",
  },
};

export const PanoramaUploadForm = ({ onSuccess, onCancel }: PanoramaUploadFormProps) => {
  const { language } = useLanguage();
  const t = translations[language];
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const validateFile = (file: File): string | null => {
    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      return t.invalidFile;
    }
    if (file.size > 20 * 1024 * 1024) {
      return t.fileTooLarge;
    }
    return null;
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const error = validateFile(selectedFile);
    if (error) {
      toast({ variant: "destructive", title: t.error, description: error });
      return;
    }

    setFile(selectedFile);
    const url = URL.createObjectURL(selectedFile);
    setPreview(url);
  };

  const handleClearFile = () => {
    setFile(null);
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !file) {
      toast({ variant: "destructive", title: t.error, description: t.fillRequired });
      return;
    }

    setUploading(true);
    setProgress(10);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      setProgress(30);

      // Upload panorama file
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("panoramas")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      setProgress(70);

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("panoramas")
        .getPublicUrl(fileName);

      // Create panorama record
      const { error: insertError } = await supabase
        .from("panoramas")
        .insert({
          title: title.trim(),
          description: description.trim() || null,
          location: location.trim() || null,
          panorama_url: publicUrl,
          author_id: user.id,
          status: "pending",
        });

      if (insertError) throw insertError;

      setProgress(100);

      toast({
        title: t.success,
        description: t.pending,
      });

      // Reset form
      setTitle("");
      setDescription("");
      setLocation("");
      handleClearFile();
      onSuccess?.();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: t.error,
        description: error.message,
      });
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <Card className="gradient-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          {t.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">{t.titleLabel} *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t.titlePlaceholder}
              disabled={uploading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t.descriptionLabel}</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t.descriptionPlaceholder}
              rows={3}
              disabled={uploading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">{t.locationLabel}</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder={t.locationPlaceholder}
                className="pl-10"
                disabled={uploading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t.selectFile} *</Label>
            {!file ? (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                <span className="text-sm text-muted-foreground">{t.selectFile}</span>
                <span className="text-xs text-muted-foreground/70 mt-1">{t.fileHint}</span>
                <input
                  type="file"
                  className="hidden"
                  accept=".jpg,.jpeg,.png"
                  onChange={handleFileSelect}
                  disabled={uploading}
                />
              </label>
            ) : (
              <div className="relative">
                <img
                  src={preview || ""}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded-lg"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-6 w-6"
                  onClick={handleClearFile}
                  disabled={uploading}
                >
                  <X className="h-4 w-4" />
                </Button>
                <div className="absolute bottom-2 left-2 bg-background/80 backdrop-blur-sm px-2 py-1 rounded text-xs">
                  {file.name}
                </div>
              </div>
            )}
          </div>

          {uploading && (
            <div className="space-y-2">
              <Progress value={progress} />
              <p className="text-sm text-muted-foreground text-center">{t.uploading}</p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel} disabled={uploading} className="flex-1">
                {t.cancel}
              </Button>
            )}
            <Button type="submit" disabled={uploading || !file || !title.trim()} className="flex-1">
              {uploading ? t.uploading : t.upload}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
