import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "@supabase/supabase-js";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase, signOut } from "@/lib/supabase";
import { Trophy, Upload, Award, History, Eye, Download } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Viewer3D } from "@/components/Viewer3D";

interface Profile {
  full_name: string | null;
  avatar_url: string | null;
  points: number;
}

interface UserObject {
  id: string;
  title: string;
  description: string | null;
  model_url: string | null;
  status: string;
  created_at: string;
}

interface Achievement {
  id: string;
  name: string;
  description: string | null;
  points_required: number;
  earned_at?: string;
}

interface PointsHistory {
  id: string;
  points: number;
  action: string;
  description: string | null;
  created_at: string;
}

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userObjects, setUserObjects] = useState<UserObject[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [pointsHistory, setPointsHistory] = useState<PointsHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      setUser(session.user);
      await fetchProfileData(session.user.id);
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchProfileData = async (userId: string) => {
    try {
      // Fetch profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (profileData) {
        setProfile(profileData);
      }

      // Fetch user's uploaded objects
      const { data: objectsData } = await supabase
        .from("objects_3d")
        .select("id, title, description, model_url, status, created_at")
        .eq("author_id", userId)
        .order("created_at", { ascending: false });

      if (objectsData) {
        setUserObjects(objectsData);
      }

      // Fetch all achievements and user's earned achievements
      const { data: allAchievements } = await supabase
        .from("achievements")
        .select("*")
        .order("points_required", { ascending: true });

      const { data: earnedAchievements } = await supabase
        .from("user_achievements")
        .select("achievement_id, earned_at")
        .eq("user_id", userId);

      if (allAchievements) {
        const achievementsWithStatus = allAchievements.map(ach => {
          const earned = earnedAchievements?.find(e => e.achievement_id === ach.id);
          return {
            ...ach,
            earned_at: earned?.earned_at,
          };
        });
        setAchievements(achievementsWithStatus);
      }

      // Fetch points history
      const { data: historyData } = await supabase
        .from("points_history")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(10);

      if (historyData) {
        setPointsHistory(historyData);
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Вы вышли из системы",
      description: "До скорой встречи!",
    });
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  const getInitials = (name: string | null) => {
    if (!name) return "?";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-4 py-8 mt-16">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <Avatar className="w-24 h-24 mx-auto mb-4">
                  <AvatarImage src={profile?.avatar_url || undefined} />
                  <AvatarFallback>{getInitials(profile?.full_name || user?.email || null)}</AvatarFallback>
                </Avatar>
                <CardTitle>{profile?.full_name || user?.email}</CardTitle>
                <CardDescription>{user?.email}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-primary" />
                    <span className="font-semibold">Поинты</span>
                  </div>
                  <Badge variant="default" className="text-lg px-4 py-1">
                    {profile?.points || 0}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Загружено объектов:</span>
                    <span className="font-semibold">{userObjects.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Достижений:</span>
                    <span className="font-semibold">
                      {achievements.filter(a => a.earned_at).length} / {achievements.length}
                    </span>
                  </div>
                </div>

                <Button variant="outline" className="w-full" onClick={handleSignOut}>
                  Выйти
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2">
            <Tabs defaultValue="objects" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="objects">
                  <Upload className="w-4 h-4 mr-2" />
                  Мои объекты
                </TabsTrigger>
                <TabsTrigger value="achievements">
                  <Award className="w-4 h-4 mr-2" />
                  Достижения
                </TabsTrigger>
                <TabsTrigger value="history">
                  <History className="w-4 h-4 mr-2" />
                  История
                </TabsTrigger>
              </TabsList>

              <TabsContent value="objects" className="space-y-4">
                {userObjects.length === 0 ? (
                  <Card>
                    <CardContent className="py-8 text-center text-muted-foreground space-y-4">
                      <Upload className="w-12 h-12 mx-auto opacity-50" />
                      <p>Вы ещё не загрузили ни одного объекта</p>
                      <Button onClick={() => navigate("/upload-3d")}>
                        Загрузить 3D объект
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <>
                    <div className="flex justify-end mb-4">
                      <Button onClick={() => navigate("/upload-3d")}>
                        <Upload className="w-4 h-4 mr-2" />
                        Новый объект
                      </Button>
                    </div>
                    {userObjects.map(obj => (
                      <Card key={obj.id}>
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <CardTitle className="text-lg">{obj.title}</CardTitle>
                              {obj.description && (
                                <p className="text-sm text-muted-foreground mt-1">{obj.description}</p>
                              )}
                              <CardDescription className="mt-2">
                                {new Date(obj.created_at).toLocaleDateString("ru-RU")}
                              </CardDescription>
                            </div>
                            <Badge 
                              variant={
                                obj.status === "approved" ? "default" : 
                                obj.status === "rejected" ? "destructive" : 
                                "secondary"
                              }
                            >
                              {obj.status === "approved" ? "Одобрено" : 
                               obj.status === "rejected" ? "Отклонено" : 
                               "На модерации"}
                            </Badge>
                          </div>
                        </CardHeader>
                        {obj.model_url && (
                          <CardContent className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Eye className="mr-2 h-4 w-4" />
                                  Просмотр
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl max-h-[90vh]">
                                <DialogHeader>
                                  <DialogTitle>{obj.title}</DialogTitle>
                                </DialogHeader>
                                <div className="overflow-auto">
                                  <Viewer3D
                                    modelUrl={obj.model_url}
                                    title={obj.title}
                                    description={obj.description || undefined}
                                  />
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(obj.model_url!, '_blank')}
                            >
                              <Download className="mr-2 h-4 w-4" />
                              Скачать
                            </Button>
                          </CardContent>
                        )}
                      </Card>
                    ))}
                  </>
                )}
              </TabsContent>

              <TabsContent value="achievements" className="space-y-4">
                <div className="grid gap-4">
                  {achievements.map(achievement => (
                    <Card 
                      key={achievement.id}
                      className={achievement.earned_at ? "border-primary" : "opacity-60"}
                    >
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg flex items-center gap-2">
                              {achievement.earned_at && <Award className="w-5 h-5 text-primary" />}
                              {achievement.name}
                            </CardTitle>
                            <CardDescription>{achievement.description}</CardDescription>
                          </div>
                          <Badge variant={achievement.earned_at ? "default" : "outline"}>
                            {achievement.points_required} поинтов
                          </Badge>
                        </div>
                        {achievement.earned_at && (
                          <p className="text-xs text-muted-foreground">
                            Получено: {new Date(achievement.earned_at).toLocaleDateString("ru-RU")}
                          </p>
                        )}
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="history" className="space-y-4">
                {pointsHistory.length === 0 ? (
                  <Card>
                    <CardContent className="py-8 text-center text-muted-foreground">
                      <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>История поинтов пока пуста</p>
                    </CardContent>
                  </Card>
                ) : (
                  pointsHistory.map(record => (
                    <Card key={record.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{record.action}</CardTitle>
                            {record.description && (
                              <CardDescription>{record.description}</CardDescription>
                            )}
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(record.created_at).toLocaleDateString("ru-RU", {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                          <Badge 
                            variant={record.points > 0 ? "default" : "destructive"}
                            className="text-lg px-4 py-1"
                          >
                            {record.points > 0 ? "+" : ""}{record.points}
                          </Badge>
                        </div>
                      </CardHeader>
                    </Card>
                  ))
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
