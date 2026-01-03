import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Shield, Users, Box, Search, Trash2, Check, X, RefreshCw, 
  Newspaper, Plus, Edit, Eye, Mail, Ban, UserCheck, Upload, Image
} from "lucide-react";

interface UserProfile {
  id: string;
  user_id: string;
  full_name: string | null;
  points: number;
  is_verified: boolean | null;
  created_at: string;
}

interface UserRole {
  user_id: string;
  role: "admin" | "moderator" | "user";
}

interface UserBan {
  user_id: string;
  reason: string | null;
  is_active: boolean;
}

interface Object3D {
  id: string;
  title: string;
  description: string | null;
  status: string;
  region: string | null;
  era: string | null;
  created_at: string;
  author_id: string | null;
  model_url: string | null;
  thumbnail_url: string | null;
}

interface NewsArticle {
  id: string;
  title: string;
  title_kz: string | null;
  title_en: string | null;
  content: string;
  content_kz: string | null;
  content_en: string | null;
  category: string | null;
  featured: boolean | null;
  published: boolean | null;
  image_url: string | null;
  created_at: string;
}

interface Panorama {
  id: string;
  title: string;
  description: string | null;
  panorama_url: string;
  thumbnail_url: string | null;
  location: string | null;
  author_id: string | null;
  status: string;
  created_at: string;
}

interface UserWithEmail extends UserProfile {
  email?: string;
}

const translations = {
  kz: {
    title: "Админ панель",
    refresh: "Жаңарту",
    users: "Пайдаланушылар",
    objects: "3D Объектілер",
    news: "Жаңалықтар",
    about: "Біз туралы",
    totalUsers: "Барлық пайдаланушылар",
    admins: "Админдер",
    approvedObjects: "Бекітілген объектілер",
    pending: "Күтуде",
    usersList: "Пайдаланушылар тізімі",
    manageRoles: "Рөлдерді басқару және пайдаланушыларды көру",
    search: "Іздеу...",
    name: "Аты",
    points: "Ұпай",
    verification: "Верификация",
    role: "Рөл",
    date: "Күні",
    unknown: "Белгісіз",
    yes: "Иә",
    no: "Жоқ",
    objectsTitle: "3D Объектілер",
    manageObjects: "Объектілерді басқару және статустарын өзгерту",
    objectName: "Атауы",
    region: "Аймақ",
    era: "Дәуір",
    status: "Статус",
    actions: "Әрекеттер",
    addObject: "Объект қосу",
    editObject: "Объектті өзгерту",
    description: "Сипаттама",
    modelUrl: "3D модель URL",
    modelFile: "3D модель файлы",
    thumbnailUrl: "Сурет URL",
    save: "Сақтау",
    cancel: "Болдырмау",
    noAccess: "Қатынас жоқ",
    noAdminRights: "Сізде админ құқығы жоқ",
    success: "Сәтті",
    roleChanged: "Рөл өзгертілді",
    statusChanged: "Статус өзгертілді",
    objectDeleted: "Объект жойылды",
    objectSaved: "Объект сақталды",
    error: "Қате",
    email: "Email",
    viewModel: "Модельді көру",
    ban: "Бұғаттау",
    unban: "Бұғаттан шығару",
    banned: "Бұғатталған",
    banReason: "Бұғаттау себебі",
    addNews: "Жаңалық қосу",
    editNews: "Жаңалықты өзгерту",
    newsTitle: "Тақырып",
    newsContent: "Мазмұны",
    category: "Санат",
    featured: "Басты",
    published: "Жарияланған",
    imageUrl: "Сурет URL",
    newsSaved: "Жаңалық сақталды",
    newsDeleted: "Жаңалық жойылды",
    uploadFile: "Файл жүктеу",
    panoramas: "Панорамалар",
    panoramasTitle: "Панорамалар",
    managePanoramas: "Панорамаларды модерациялау",
    panoramaLocation: "Орны",
    panoramaApproved: "Панорама бекітілді",
    panoramaDeleted: "Панорама жойылды",
  },
  ru: {
    title: "Админ панель",
    refresh: "Обновить",
    users: "Пользователи",
    objects: "3D Объекты",
    news: "Новости",
    about: "О нас",
    totalUsers: "Всего пользователей",
    admins: "Админы",
    approvedObjects: "Одобренные объекты",
    pending: "На рассмотрении",
    usersList: "Список пользователей",
    manageRoles: "Управление ролями и просмотр пользователей",
    search: "Поиск...",
    name: "Имя",
    points: "Баллы",
    verification: "Верификация",
    role: "Роль",
    date: "Дата",
    unknown: "Неизвестно",
    yes: "Да",
    no: "Нет",
    objectsTitle: "3D Объекты",
    manageObjects: "Управление объектами и изменение статусов",
    objectName: "Название",
    region: "Регион",
    era: "Эпоха",
    status: "Статус",
    actions: "Действия",
    addObject: "Добавить объект",
    editObject: "Редактировать объект",
    description: "Описание",
    modelUrl: "URL 3D модели",
    modelFile: "Файл 3D модели",
    thumbnailUrl: "URL изображения",
    save: "Сохранить",
    cancel: "Отмена",
    noAccess: "Нет доступа",
    noAdminRights: "У вас нет прав администратора",
    success: "Успешно",
    roleChanged: "Роль изменена",
    statusChanged: "Статус изменен",
    objectDeleted: "Объект удален",
    objectSaved: "Объект сохранен",
    error: "Ошибка",
    email: "Email",
    viewModel: "Смотреть модель",
    ban: "Заблокировать",
    unban: "Разблокировать",
    banned: "Заблокирован",
    banReason: "Причина блокировки",
    addNews: "Добавить новость",
    editNews: "Редактировать новость",
    newsTitle: "Заголовок",
    newsContent: "Содержание",
    category: "Категория",
    featured: "Главное",
    published: "Опубликовано",
    imageUrl: "URL изображения",
    newsSaved: "Новость сохранена",
    newsDeleted: "Новость удалена",
    uploadFile: "Загрузить файл",
    panoramas: "Панорамы",
    panoramasTitle: "Панорамы",
    managePanoramas: "Модерация панорам",
    panoramaLocation: "Местоположение",
    panoramaApproved: "Панорама одобрена",
    panoramaDeleted: "Панорама удалена",
  },
  en: {
    title: "Admin Panel",
    refresh: "Refresh",
    users: "Users",
    objects: "3D Objects",
    news: "News",
    about: "About",
    totalUsers: "Total Users",
    admins: "Admins",
    approvedObjects: "Approved Objects",
    pending: "Pending",
    usersList: "Users List",
    manageRoles: "Manage roles and view users",
    search: "Search...",
    name: "Name",
    points: "Points",
    verification: "Verification",
    role: "Role",
    date: "Date",
    unknown: "Unknown",
    yes: "Yes",
    no: "No",
    objectsTitle: "3D Objects",
    manageObjects: "Manage objects and change statuses",
    objectName: "Name",
    region: "Region",
    era: "Era",
    status: "Status",
    actions: "Actions",
    addObject: "Add Object",
    editObject: "Edit Object",
    description: "Description",
    modelUrl: "3D Model URL",
    modelFile: "3D Model File",
    thumbnailUrl: "Thumbnail URL",
    save: "Save",
    cancel: "Cancel",
    noAccess: "No Access",
    noAdminRights: "You don't have admin rights",
    success: "Success",
    roleChanged: "Role changed",
    statusChanged: "Status changed",
    objectDeleted: "Object deleted",
    objectSaved: "Object saved",
    error: "Error",
    email: "Email",
    viewModel: "View Model",
    ban: "Ban",
    unban: "Unban",
    banned: "Banned",
    banReason: "Ban reason",
    addNews: "Add News",
    editNews: "Edit News",
    newsTitle: "Title",
    newsContent: "Content",
    category: "Category",
    featured: "Featured",
    published: "Published",
    imageUrl: "Image URL",
    newsSaved: "News saved",
    newsDeleted: "News deleted",
    uploadFile: "Upload File",
    panoramas: "Panoramas",
    panoramasTitle: "Panoramas",
    managePanoramas: "Moderate panoramas",
    panoramaLocation: "Location",
    panoramaApproved: "Panorama approved",
    panoramaDeleted: "Panorama deleted",
  },
};

const Admin = () => {
  const { language } = useLanguage();
  const t = translations[language];
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<UserWithEmail[]>([]);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [userBans, setUserBans] = useState<UserBan[]>([]);
  const [objects, setObjects] = useState<Object3D[]>([]);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [panoramas, setPanoramas] = useState<Panorama[]>([]);
  const [searchUser, setSearchUser] = useState("");
  const [searchObject, setSearchObject] = useState("");
  const [searchPanorama, setSearchPanorama] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  
  // Edit object dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingObject, setEditingObject] = useState<Object3D | null>(null);
  const [objectForm, setObjectForm] = useState({
    title: "",
    description: "",
    region: "",
    era: "",
    model_url: "",
    thumbnail_url: "",
  });
  const [modelFile, setModelFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // News dialog state
  const [newsDialogOpen, setNewsDialogOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsArticle | null>(null);
  const [newsForm, setNewsForm] = useState({
    title: "",
    title_kz: "",
    title_en: "",
    content: "",
    content_kz: "",
    content_en: "",
    category: "news",
    featured: false,
    published: true,
    image_url: "",
  });

  // Ban dialog state
  const [banDialogOpen, setBanDialogOpen] = useState(false);
  const [banningUser, setBanningUser] = useState<UserWithEmail | null>(null);
  const [banReason, setBanReason] = useState("");
  
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }

    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleData) {
      toast({
        variant: "destructive",
        title: t.noAccess,
        description: t.noAdminRights,
      });
      navigate("/");
      return;
    }

    setIsAdmin(true);
    await fetchData();
    setIsLoading(false);
  };

  const fetchData = async () => {
    setRefreshing(true);
    
    // Fetch users with emails from auth
    const { data: usersData } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (usersData) {
      // Get emails from auth.users via user_id
      const usersWithEmails = usersData.map(u => ({
        ...u,
        email: undefined as string | undefined
      }));
      setUsers(usersWithEmails);
    }

    // Fetch user roles
    const { data: rolesData } = await supabase
      .from("user_roles")
      .select("user_id, role");
    
    if (rolesData) setUserRoles(rolesData as UserRole[]);

    // Fetch user bans
    const { data: bansData } = await supabase
      .from("user_bans")
      .select("user_id, reason, is_active")
      .eq("is_active", true);
    
    if (bansData) setUserBans(bansData as UserBan[]);

    // Fetch 3D objects
    const { data: objectsData } = await supabase
      .from("objects_3d")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (objectsData) setObjects(objectsData);

    // Fetch news
    const { data: newsData } = await supabase
      .from("news_articles")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (newsData) setNews(newsData as NewsArticle[]);

    // Fetch panoramas
    const { data: panoramasData } = await supabase
      .from("panoramas")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (panoramasData) setPanoramas(panoramasData as Panorama[]);
    
    setRefreshing(false);
  };

  const getUserRole = (userId: string): string => {
    const role = userRoles.find(r => r.user_id === userId);
    return role?.role || "user";
  };

  const isUserBanned = (userId: string): boolean => {
    return userBans.some(b => b.user_id === userId && b.is_active);
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    const existingRole = userRoles.find(r => r.user_id === userId);

    if (newRole === "user") {
      if (existingRole) {
        const { error } = await supabase
          .from("user_roles")
          .delete()
          .eq("user_id", userId);

        if (error) {
          toast({ variant: "destructive", title: t.error, description: error.message });
          return;
        }
      }
    } else {
      if (existingRole) {
        const { error } = await supabase
          .from("user_roles")
          .update({ role: newRole as "admin" | "moderator" })
          .eq("user_id", userId);

        if (error) {
          toast({ variant: "destructive", title: t.error, description: error.message });
          return;
        }
      } else {
        const { error } = await supabase
          .from("user_roles")
          .insert({ user_id: userId, role: newRole as "admin" | "moderator" });

        if (error) {
          toast({ variant: "destructive", title: t.error, description: error.message });
          return;
        }
      }
    }

    toast({ title: t.success, description: t.roleChanged });
    await fetchData();
  };

  const handleBanUser = async () => {
    if (!banningUser) return;
    
    const { data: { user } } = await supabase.auth.getUser();
    
    const { error } = await supabase
      .from("user_bans")
      .upsert({
        user_id: banningUser.user_id,
        reason: banReason || null,
        banned_by: user?.id,
        is_active: true,
      });

    if (error) {
      toast({ variant: "destructive", title: t.error, description: error.message });
      return;
    }

    toast({ title: t.success, description: t.ban });
    setBanDialogOpen(false);
    setBanningUser(null);
    setBanReason("");
    await fetchData();
  };

  const handleUnbanUser = async (userId: string) => {
    const { error } = await supabase
      .from("user_bans")
      .update({ is_active: false })
      .eq("user_id", userId);

    if (error) {
      toast({ variant: "destructive", title: t.error, description: error.message });
      return;
    }

    toast({ title: t.success, description: t.unban });
    await fetchData();
  };

  const handleObjectStatus = async (objectId: string, status: string) => {
    const { error } = await supabase
      .from("objects_3d")
      .update({ status })
      .eq("id", objectId);

    if (error) {
      toast({ variant: "destructive", title: t.error, description: error.message });
      return;
    }

    toast({ title: t.success, description: t.statusChanged });
    await fetchData();
  };

  const handleDeleteObject = async (objectId: string) => {
    const { error } = await supabase
      .from("objects_3d")
      .delete()
      .eq("id", objectId);

    if (error) {
      toast({ variant: "destructive", title: t.error, description: error.message });
      return;
    }

    toast({ title: t.success, description: t.objectDeleted });
    await fetchData();
  };

  const openEditDialog = (obj?: Object3D) => {
    if (obj) {
      setEditingObject(obj);
      setObjectForm({
        title: obj.title,
        description: obj.description || "",
        region: obj.region || "",
        era: obj.era || "",
        model_url: obj.model_url || "",
        thumbnail_url: obj.thumbnail_url || "",
      });
    } else {
      setEditingObject(null);
      setObjectForm({
        title: "",
        description: "",
        region: "",
        era: "",
        model_url: "",
        thumbnail_url: "",
      });
    }
    setModelFile(null);
    setThumbnailFile(null);
    setEditDialogOpen(true);
  };

  const handleSaveObject = async () => {
    if (!objectForm.title) {
      toast({ variant: "destructive", title: t.error, description: "Title is required" });
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    setUploading(true);
    let modelUrl = objectForm.model_url;
    let thumbnailUrl = objectForm.thumbnail_url;

    // Upload model file if selected
    if (modelFile) {
      const fileExt = modelFile.name.split('.').pop();
      const fileName = `admin/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('3d-models')
        .upload(fileName, modelFile);

      if (uploadError) {
        toast({ variant: "destructive", title: t.error, description: uploadError.message });
        setUploading(false);
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('3d-models')
        .getPublicUrl(fileName);
      
      modelUrl = publicUrl;
    }

    // Upload thumbnail if selected
    if (thumbnailFile) {
      const fileExt = thumbnailFile.name.split('.').pop();
      const fileName = `admin/thumbnails/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('3d-models')
        .upload(fileName, thumbnailFile);

      if (uploadError) {
        toast({ variant: "destructive", title: t.error, description: uploadError.message });
        setUploading(false);
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('3d-models')
        .getPublicUrl(fileName);
      
      thumbnailUrl = publicUrl;
    }

    if (editingObject) {
      const { error } = await supabase
        .from("objects_3d")
        .update({
          title: objectForm.title,
          description: objectForm.description || null,
          region: objectForm.region || null,
          era: objectForm.era || null,
          model_url: modelUrl || null,
          thumbnail_url: thumbnailUrl || null,
        })
        .eq("id", editingObject.id);

      if (error) {
        toast({ variant: "destructive", title: t.error, description: error.message });
        setUploading(false);
        return;
      }
    } else {
      const { error } = await supabase
        .from("objects_3d")
        .insert({
          title: objectForm.title,
          description: objectForm.description || null,
          region: objectForm.region || null,
          era: objectForm.era || null,
          model_url: modelUrl || null,
          thumbnail_url: thumbnailUrl || null,
          author_id: user.id,
          status: "approved",
        });

      if (error) {
        toast({ variant: "destructive", title: t.error, description: error.message });
        setUploading(false);
        return;
      }
    }

    setUploading(false);
    toast({ title: t.success, description: t.objectSaved });
    setEditDialogOpen(false);
    await fetchData();
  };

  // News functions
  const openNewsDialog = (article?: NewsArticle) => {
    if (article) {
      setEditingNews(article);
      setNewsForm({
        title: article.title,
        title_kz: article.title_kz || "",
        title_en: article.title_en || "",
        content: article.content,
        content_kz: article.content_kz || "",
        content_en: article.content_en || "",
        category: article.category || "news",
        featured: article.featured || false,
        published: article.published ?? true,
        image_url: article.image_url || "",
      });
    } else {
      setEditingNews(null);
      setNewsForm({
        title: "",
        title_kz: "",
        title_en: "",
        content: "",
        content_kz: "",
        content_en: "",
        category: "news",
        featured: false,
        published: true,
        image_url: "",
      });
    }
    setNewsDialogOpen(true);
  };

  const handleSaveNews = async () => {
    if (!newsForm.title || !newsForm.content) {
      toast({ variant: "destructive", title: t.error, description: "Title and content required" });
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();

    if (editingNews) {
      const { error } = await supabase
        .from("news_articles")
        .update({
          title: newsForm.title,
          title_kz: newsForm.title_kz || null,
          title_en: newsForm.title_en || null,
          content: newsForm.content,
          content_kz: newsForm.content_kz || null,
          content_en: newsForm.content_en || null,
          category: newsForm.category,
          featured: newsForm.featured,
          published: newsForm.published,
          image_url: newsForm.image_url || null,
        })
        .eq("id", editingNews.id);

      if (error) {
        toast({ variant: "destructive", title: t.error, description: error.message });
        return;
      }
    } else {
      const { error } = await supabase
        .from("news_articles")
        .insert({
          title: newsForm.title,
          title_kz: newsForm.title_kz || null,
          title_en: newsForm.title_en || null,
          content: newsForm.content,
          content_kz: newsForm.content_kz || null,
          content_en: newsForm.content_en || null,
          category: newsForm.category,
          featured: newsForm.featured,
          published: newsForm.published,
          image_url: newsForm.image_url || null,
          author_id: user?.id,
        });

      if (error) {
        toast({ variant: "destructive", title: t.error, description: error.message });
        return;
      }
    }

    toast({ title: t.success, description: t.newsSaved });
    setNewsDialogOpen(false);
    await fetchData();
  };

  const handleDeleteNews = async (newsId: string) => {
    const { error } = await supabase
      .from("news_articles")
      .delete()
      .eq("id", newsId);

    if (error) {
      toast({ variant: "destructive", title: t.error, description: error.message });
      return;
    }

    toast({ title: t.success, description: t.newsDeleted });
    await fetchData();
  };

  const filteredUsers = users.filter(u => 
    u.full_name?.toLowerCase().includes(searchUser.toLowerCase()) ||
    u.user_id.toLowerCase().includes(searchUser.toLowerCase())
  );

  const filteredObjects = objects.filter(o =>
    o.title.toLowerCase().includes(searchObject.toLowerCase()) ||
    o.region?.toLowerCase().includes(searchObject.toLowerCase())
  );

  const filteredPanoramas = panoramas.filter(p =>
    p.title.toLowerCase().includes(searchPanorama.toLowerCase()) ||
    p.location?.toLowerCase().includes(searchPanorama.toLowerCase())
  );

  const handlePanoramaStatus = async (panoramaId: string, status: string) => {
    const { error } = await supabase
      .from("panoramas")
      .update({ status })
      .eq("id", panoramaId);

    if (error) {
      toast({ variant: "destructive", title: t.error, description: error.message });
      return;
    }

    toast({ title: t.success, description: t.panoramaApproved });
    await fetchData();
  };

  const handleDeletePanorama = async (panoramaId: string) => {
    const { error } = await supabase
      .from("panoramas")
      .delete()
      .eq("id", panoramaId);

    if (error) {
      toast({ variant: "destructive", title: t.error, description: error.message });
      return;
    }

    toast({ title: t.success, description: t.panoramaDeleted });
    await fetchData();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-4 py-8 mt-16">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-primary" />
            <h1 className="text-2xl md:text-3xl font-bold">{t.title}</h1>
          </div>
          <Button onClick={fetchData} variant="outline" disabled={refreshing}>
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {t.refresh}
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">{users.length}</p>
              <p className="text-sm text-muted-foreground">{t.totalUsers}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Shield className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
              <p className="text-2xl font-bold">{userRoles.filter(r => r.role === 'admin').length}</p>
              <p className="text-sm text-muted-foreground">{t.admins}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Box className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <p className="text-2xl font-bold">{objects.filter(o => o.status === 'approved').length}</p>
              <p className="text-sm text-muted-foreground">{t.approvedObjects}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Newspaper className="w-8 h-8 mx-auto mb-2 text-blue-500" />
              <p className="text-2xl font-bold">{news.length}</p>
              <p className="text-sm text-muted-foreground">{t.news}</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 max-w-xl">
            <TabsTrigger value="users">
              <Users className="w-4 h-4 mr-2" />
              {t.users}
            </TabsTrigger>
            <TabsTrigger value="objects">
              <Box className="w-4 h-4 mr-2" />
              {t.objects}
            </TabsTrigger>
            <TabsTrigger value="panoramas">
              <Image className="w-4 h-4 mr-2" />
              {t.panoramas}
            </TabsTrigger>
            <TabsTrigger value="news">
              <Newspaper className="w-4 h-4 mr-2" />
              {t.news}
            </TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>{t.usersList}</CardTitle>
                <CardDescription>{t.manageRoles}</CardDescription>
                <div className="relative mt-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder={t.search}
                    value={searchUser}
                    onChange={(e) => setSearchUser(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t.name}</TableHead>
                        <TableHead>{t.email}</TableHead>
                        <TableHead className="hidden md:table-cell">{t.points}</TableHead>
                        <TableHead className="hidden md:table-cell">{t.verification}</TableHead>
                        <TableHead>{t.role}</TableHead>
                        <TableHead>{t.date}</TableHead>
                        <TableHead>{t.actions}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id} className={isUserBanned(user.user_id) ? "bg-red-50" : ""}>
                          <TableCell>
                            <p className="font-medium">{user.full_name || t.unknown}</p>
                          </TableCell>
                          <TableCell>
                            <p className="text-xs text-muted-foreground truncate max-w-[150px]">
                              {user.user_id.substring(0, 8)}...
                            </p>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">{user.points}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            {user.is_verified ? (
                              <Badge variant="default" className="bg-green-500">{t.yes}</Badge>
                            ) : (
                              <Badge variant="secondary">{t.no}</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <Select
                              value={getUserRole(user.user_id)}
                              onValueChange={(value) => handleRoleChange(user.user_id, value)}
                            >
                              <SelectTrigger className="w-[120px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="user">User</SelectItem>
                                <SelectItem value="moderator">Moderator</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {new Date(user.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {isUserBanned(user.user_id) ? (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleUnbanUser(user.user_id)}
                                className="gap-1"
                              >
                                <UserCheck className="w-4 h-4" />
                                {t.unban}
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => {
                                  setBanningUser(user);
                                  setBanDialogOpen(true);
                                }}
                                className="gap-1"
                              >
                                <Ban className="w-4 h-4" />
                                {t.ban}
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Objects Tab */}
          <TabsContent value="objects">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{t.objectsTitle}</CardTitle>
                    <CardDescription>{t.manageObjects}</CardDescription>
                  </div>
                  <Button onClick={() => openEditDialog()} className="gap-2">
                    <Plus className="w-4 h-4" />
                    {t.addObject}
                  </Button>
                </div>
                <div className="relative mt-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder={t.search}
                    value={searchObject}
                    onChange={(e) => setSearchObject(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t.objectName}</TableHead>
                        <TableHead className="hidden md:table-cell">{t.region}</TableHead>
                        <TableHead className="hidden md:table-cell">{t.era}</TableHead>
                        <TableHead>{t.status}</TableHead>
                        <TableHead>{t.actions}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredObjects.map((obj) => (
                        <TableRow key={obj.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              {obj.thumbnail_url && (
                                <img 
                                  src={obj.thumbnail_url} 
                                  alt={obj.title}
                                  className="w-10 h-10 object-cover rounded"
                                />
                              )}
                              <p className="font-medium">{obj.title}</p>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">{obj.region || "-"}</TableCell>
                          <TableCell className="hidden md:table-cell">{obj.era || "-"}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={obj.status === 'approved' ? 'default' : 'secondary'}
                              className={obj.status === 'approved' ? 'bg-green-500' : obj.status === 'rejected' ? 'bg-red-500' : ''}
                            >
                              {obj.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => openEditDialog(obj)}
                                className="h-8 w-8 p-0"
                                title={t.editObject}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              {obj.model_url && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => window.open(`/viewer/${obj.id}`, '_blank')}
                                  className="h-8 w-8 p-0"
                                  title={t.viewModel}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleObjectStatus(obj.id, 'approved')}
                                className="h-8 w-8 p-0"
                              >
                                <Check className="w-4 h-4 text-green-500" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleObjectStatus(obj.id, 'rejected')}
                                className="h-8 w-8 p-0"
                              >
                                <X className="w-4 h-4 text-red-500" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDeleteObject(obj.id)}
                                className="h-8 w-8 p-0"
                              >
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* News Tab */}
          <TabsContent value="news">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{t.news}</CardTitle>
                    <CardDescription>Manage news articles</CardDescription>
                  </div>
                  <Button onClick={() => openNewsDialog()} className="gap-2">
                    <Plus className="w-4 h-4" />
                    {t.addNews}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t.newsTitle}</TableHead>
                        <TableHead>{t.category}</TableHead>
                        <TableHead>{t.featured}</TableHead>
                        <TableHead>{t.published}</TableHead>
                        <TableHead>{t.date}</TableHead>
                        <TableHead>{t.actions}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {news.map((article) => (
                        <TableRow key={article.id}>
                          <TableCell className="font-medium">{article.title}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{article.category}</Badge>
                          </TableCell>
                          <TableCell>
                            {article.featured ? <Check className="w-4 h-4 text-green-500" /> : <X className="w-4 h-4 text-muted-foreground" />}
                          </TableCell>
                          <TableCell>
                            {article.published ? <Check className="w-4 h-4 text-green-500" /> : <X className="w-4 h-4 text-muted-foreground" />}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {new Date(article.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => openNewsDialog(article)}
                                className="h-8 w-8 p-0"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDeleteNews(article.id)}
                                className="h-8 w-8 p-0"
                              >
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Panoramas Tab */}
          <TabsContent value="panoramas">
            <Card>
              <CardHeader>
                <CardTitle>{t.panoramasTitle}</CardTitle>
                <CardDescription>{t.managePanoramas}</CardDescription>
                <div className="relative mt-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder={t.search}
                    value={searchPanorama}
                    onChange={(e) => setSearchPanorama(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t.objectName}</TableHead>
                        <TableHead className="hidden md:table-cell">{t.panoramaLocation}</TableHead>
                        <TableHead>{t.status}</TableHead>
                        <TableHead>{t.date}</TableHead>
                        <TableHead>{t.actions}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPanoramas.map((pano) => (
                        <TableRow key={pano.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <img 
                                src={pano.thumbnail_url || pano.panorama_url} 
                                alt={pano.title}
                                className="w-12 h-8 object-cover rounded"
                              />
                              <p className="font-medium">{pano.title}</p>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">{pano.location || "-"}</TableCell>
                          <TableCell>
                            <Select
                              value={pano.status}
                              onValueChange={(value) => handlePanoramaStatus(pano.id, value)}
                            >
                              <SelectTrigger className="w-[120px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">{t.pending}</SelectItem>
                                <SelectItem value="approved">{t.yes}</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {new Date(pano.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => window.open(pano.panorama_url, '_blank')}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeletePanorama(pano.id)}
                                className="h-8 w-8 p-0"
                              >
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Edit/Add Object Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingObject ? t.editObject : t.addObject}</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">{t.objectName} *</Label>
              <Input
                id="title"
                value={objectForm.title}
                onChange={(e) => setObjectForm({ ...objectForm, title: e.target.value })}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">{t.description}</Label>
              <Textarea
                id="description"
                value={objectForm.description}
                onChange={(e) => setObjectForm({ ...objectForm, description: e.target.value })}
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="region">{t.region}</Label>
                <Input
                  id="region"
                  value={objectForm.region}
                  onChange={(e) => setObjectForm({ ...objectForm, region: e.target.value })}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="era">{t.era}</Label>
                <Input
                  id="era"
                  value={objectForm.era}
                  onChange={(e) => setObjectForm({ ...objectForm, era: e.target.value })}
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label>{t.modelFile} (.glb, .obj)</Label>
              <Input
                type="file"
                accept=".glb,.obj"
                onChange={(e) => setModelFile(e.target.files?.[0] || null)}
              />
              {objectForm.model_url && !modelFile && (
                <p className="text-xs text-muted-foreground">Current: {objectForm.model_url.substring(0, 50)}...</p>
              )}
            </div>
            
            <div className="grid gap-2">
              <Label>Сурет файлы</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
              />
              {objectForm.thumbnail_url && !thumbnailFile && (
                <img src={objectForm.thumbnail_url} alt="Thumbnail" className="w-20 h-20 object-cover rounded" />
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              {t.cancel}
            </Button>
            <Button onClick={handleSaveObject} disabled={uploading}>
              {uploading ? "Жүктелуде..." : t.save}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* News Dialog */}
      <Dialog open={newsDialogOpen} onOpenChange={setNewsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingNews ? t.editNews : t.addNews}</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>{t.newsTitle} (RU) *</Label>
              <Input
                value={newsForm.title}
                onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>{t.newsTitle} (KZ)</Label>
                <Input
                  value={newsForm.title_kz}
                  onChange={(e) => setNewsForm({ ...newsForm, title_kz: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label>{t.newsTitle} (EN)</Label>
                <Input
                  value={newsForm.title_en}
                  onChange={(e) => setNewsForm({ ...newsForm, title_en: e.target.value })}
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label>{t.newsContent} (RU) *</Label>
              <Textarea
                value={newsForm.content}
                onChange={(e) => setNewsForm({ ...newsForm, content: e.target.value })}
                rows={4}
              />
            </div>
            
            <div className="grid gap-2">
              <Label>{t.newsContent} (KZ)</Label>
              <Textarea
                value={newsForm.content_kz}
                onChange={(e) => setNewsForm({ ...newsForm, content_kz: e.target.value })}
                rows={3}
              />
            </div>
            
            <div className="grid gap-2">
              <Label>{t.newsContent} (EN)</Label>
              <Textarea
                value={newsForm.content_en}
                onChange={(e) => setNewsForm({ ...newsForm, content_en: e.target.value })}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>{t.category}</Label>
                <Select value={newsForm.category} onValueChange={(v) => setNewsForm({ ...newsForm, category: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="news">News</SelectItem>
                    <SelectItem value="update">Update</SelectItem>
                    <SelectItem value="article">Article</SelectItem>
                    <SelectItem value="research">Research</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>{t.imageUrl}</Label>
                <Input
                  value={newsForm.image_url}
                  onChange={(e) => setNewsForm({ ...newsForm, image_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newsForm.featured}
                  onChange={(e) => setNewsForm({ ...newsForm, featured: e.target.checked })}
                  className="w-4 h-4"
                />
                <span>{t.featured}</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newsForm.published}
                  onChange={(e) => setNewsForm({ ...newsForm, published: e.target.checked })}
                  className="w-4 h-4"
                />
                <span>{t.published}</span>
              </label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewsDialogOpen(false)}>
              {t.cancel}
            </Button>
            <Button onClick={handleSaveNews}>
              {t.save}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Ban Dialog */}
      <Dialog open={banDialogOpen} onOpenChange={setBanDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.ban}</DialogTitle>
            <DialogDescription>
              {banningUser?.full_name || banningUser?.user_id}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>{t.banReason}</Label>
              <Textarea
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                placeholder="Бұғаттау себебін жазыңыз..."
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setBanDialogOpen(false)}>
              {t.cancel}
            </Button>
            <Button variant="destructive" onClick={handleBanUser}>
              {t.ban}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Admin;
