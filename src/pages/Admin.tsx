import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Shield, Users, Box, Search, UserPlus, Trash2, Check, X, RefreshCw } from "lucide-react";

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
  status: string;
  region: string | null;
  era: string | null;
  created_at: string;
  author_id: string | null;
}

const Admin = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [objects, setObjects] = useState<Object3D[]>([]);
  const [searchUser, setSearchUser] = useState("");
  const [searchObject, setSearchObject] = useState("");
  const [refreshing, setRefreshing] = useState(false);
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
        title: "Қатынас жоқ",
        description: "Сізде админ құқығы жоқ",
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
      // Remove role entry if setting to user
      if (existingRole) {
        const { error } = await supabase
          .from("user_roles")
          .delete()
          .eq("user_id", userId);

        if (error) {
          toast({ variant: "destructive", title: "Қате", description: error.message });
          return;
        }
      }
    } else {
      if (existingRole) {
        // Update existing role
        const { error } = await supabase
          .from("user_roles")
          .update({ role: newRole as "admin" | "moderator" })
          .eq("user_id", userId);

        if (error) {
          toast({ variant: "destructive", title: "Қате", description: error.message });
          return;
        }
      } else {
        // Insert new role
        const { error } = await supabase
          .from("user_roles")
          .insert({ user_id: userId, role: newRole as "admin" | "moderator" });

        if (error) {
          toast({ variant: "destructive", title: "Қате", description: error.message });
          return;
        }
      }
    }

    toast({ title: "Сәтті", description: "Рөл өзгертілді" });
    await fetchData();
  };

  const handleObjectStatus = async (objectId: string, status: string) => {
    const { error } = await supabase
      .from("objects_3d")
      .update({ status })
      .eq("id", objectId);

    if (error) {
      toast({ variant: "destructive", title: "Қате", description: error.message });
      return;
    }

    toast({ title: "Сәтті", description: `Статус "${status}" болып өзгертілді` });
    await fetchData();
  };

  const handleDeleteObject = async (objectId: string) => {
    const { error } = await supabase
      .from("objects_3d")
      .delete()
      .eq("id", objectId);

    if (error) {
      toast({ variant: "destructive", title: "Қате", description: error.message });
      return;
    }

    toast({ title: "Сәтті", description: "Объект жойылды" });
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
            <h1 className="text-2xl md:text-3xl font-bold">Админ панель</h1>
          </div>
          <Button onClick={fetchData} variant="outline" disabled={refreshing}>
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Жаңарту
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">{users.length}</p>
              <p className="text-sm text-muted-foreground">Пайдаланушылар</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Shield className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
              <p className="text-2xl font-bold">{userRoles.filter(r => r.role === 'admin').length}</p>
              <p className="text-sm text-muted-foreground">Админдер</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Box className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <p className="text-2xl font-bold">{objects.filter(o => o.status === 'approved').length}</p>
              <p className="text-sm text-muted-foreground">Бекітілген объектілер</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Box className="w-8 h-8 mx-auto mb-2 text-orange-500" />
              <p className="text-2xl font-bold">{objects.filter(o => o.status === 'pending').length}</p>
              <p className="text-sm text-muted-foreground">Күтуде</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="users">
              <Users className="w-4 h-4 mr-2" />
              Пайдаланушылар
            </TabsTrigger>
            <TabsTrigger value="objects">
              <Box className="w-4 h-4 mr-2" />
              Объектілер
            </TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Пайдаланушылар тізімі</CardTitle>
                <CardDescription>Рөлдерді басқару және пайдаланушыларды көру</CardDescription>
                <div className="relative mt-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Іздеу..."
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
                        <TableHead>Аты</TableHead>
                        <TableHead className="hidden md:table-cell">Ұпай</TableHead>
                        <TableHead className="hidden md:table-cell">Верификация</TableHead>
                        <TableHead>Рөл</TableHead>
                        <TableHead className="hidden md:table-cell">Күні</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{user.full_name || "Белгісіз"}</p>
                              <p className="text-xs text-muted-foreground truncate max-w-[150px]">{user.user_id}</p>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">{user.points}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            {user.is_verified ? (
                              <Badge variant="default" className="bg-green-500">Иә</Badge>
                            ) : (
                              <Badge variant="secondary">Жоқ</Badge>
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
                <CardTitle>3D Объектілер</CardTitle>
                <CardDescription>Объектілерді басқару және статустарын өзгерту</CardDescription>
                <div className="relative mt-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Іздеу..."
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
                        <TableHead>Атауы</TableHead>
                        <TableHead className="hidden md:table-cell">Аймақ</TableHead>
                        <TableHead className="hidden md:table-cell">Дәуір</TableHead>
                        <TableHead>Статус</TableHead>
                        <TableHead>Әрекеттер</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredObjects.map((obj) => (
                        <TableRow key={obj.id}>
                          <TableCell>
                            <p className="font-medium">{obj.title}</p>
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

      <Footer />
    </div>
  );
};

export default Admin;
