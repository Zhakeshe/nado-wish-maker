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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Shield, Users, Box, Search, Trash2, Check, X, RefreshCw, 
  Newspaper, Plus, Edit, Eye, Mail
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

const translations = {
  kz: {
    title: "Админ панель",
    refresh: "Жаңарту",
    users: "Пайдаланушылар",
    objects: "3D Объектілер",
    news: "Жаңалықтар",
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
  },
  ru: {
    title: "Админ панель",
    refresh: "Обновить",
    users: "Пользователи",
    objects: "3D Объекты",
    news: "Новости",
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
  },
  en: {
    title: "Admin Panel",
    refresh: "Refresh",
    users: "Users",
    objects: "3D Objects",
    news: "News",
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
  },
};

const Admin = () => {
  const { language } = useLanguage();
  const t = translations[language];
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [objects, setObjects] = useState<Object3D[]>([]);
  const [searchUser, setSearchUser] = useState("");
  const [searchObject, setSearchObject] = useState("");
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
      .single();

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
    
    // Fetch users
    const { data: usersData } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (usersData) setUsers(usersData);

    // Fetch user roles
    const { data: rolesData } = await supabase
      .from("user_roles")
      .select("user_id, role");
    
    if (rolesData) setUserRoles(rolesData as UserRole[]);

    // Fetch 3D objects
    const { data: objectsData } = await supabase
      .from("objects_3d")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (objectsData) setObjects(objectsData);
    
    setRefreshing(false);
  };

  const getUserRole = (userId: string): string => {
    const role = userRoles.find(r => r.user_id === userId);
    return role?.role || "user";
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
    setEditDialogOpen(true);
  };

  const handleSaveObject = async () => {
    if (!objectForm.title) {
      toast({ variant: "destructive", title: t.error, description: "Title is required" });
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    if (editingObject) {
      // Update existing object
      const { error } = await supabase
        .from("objects_3d")
        .update({
          title: objectForm.title,
          description: objectForm.description || null,
          region: objectForm.region || null,
          era: objectForm.era || null,
          model_url: objectForm.model_url || null,
          thumbnail_url: objectForm.thumbnail_url || null,
        })
        .eq("id", editingObject.id);

      if (error) {
        toast({ variant: "destructive", title: t.error, description: error.message });
        return;
      }
    } else {
      // Create new object
      const { error } = await supabase
        .from("objects_3d")
        .insert({
          title: objectForm.title,
          description: objectForm.description || null,
          region: objectForm.region || null,
          era: objectForm.era || null,
          model_url: objectForm.model_url || null,
          thumbnail_url: objectForm.thumbnail_url || null,
          author_id: user.id,
          status: "approved", // Admin-created objects are auto-approved
        });

      if (error) {
        toast({ variant: "destructive", title: t.error, description: error.message });
        return;
      }
    }

    toast({ title: t.success, description: t.objectSaved });
    setEditDialogOpen(false);
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
              <Box className="w-8 h-8 mx-auto mb-2 text-orange-500" />
              <p className="text-2xl font-bold">{objects.filter(o => o.status === 'pending').length}</p>
              <p className="text-sm text-muted-foreground">{t.pending}</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="users">
              <Users className="w-4 h-4 mr-2" />
              {t.users}
            </TabsTrigger>
            <TabsTrigger value="objects">
              <Box className="w-4 h-4 mr-2" />
              {t.objects}
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
                        <TableHead className="hidden md:table-cell">{t.points}</TableHead>
                        <TableHead className="hidden md:table-cell">{t.verification}</TableHead>
                        <TableHead>{t.role}</TableHead>
                        <TableHead className="hidden md:table-cell">{t.date}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{user.full_name || t.unknown}</p>
                              <p className="text-xs text-muted-foreground truncate max-w-[150px]">{user.user_id}</p>
                            </div>
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
                          <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                            {new Date(user.created_at).toLocaleDateString()}
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
        </Tabs>
      </main>

      {/* Edit/Add Object Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingObject ? t.editObject : t.addObject}</DialogTitle>
            <DialogDescription>
              {editingObject ? `ID: ${editingObject.id}` : ""}
            </DialogDescription>
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
              <Label htmlFor="model_url">{t.modelUrl}</Label>
              <Input
                id="model_url"
                value={objectForm.model_url}
                onChange={(e) => setObjectForm({ ...objectForm, model_url: e.target.value })}
                placeholder="https://..."
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="thumbnail_url">{t.thumbnailUrl}</Label>
              <Input
                id="thumbnail_url"
                value={objectForm.thumbnail_url}
                onChange={(e) => setObjectForm({ ...objectForm, thumbnail_url: e.target.value })}
                placeholder="https://..."
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              {t.cancel}
            </Button>
            <Button onClick={handleSaveObject}>
              {t.save}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Admin;