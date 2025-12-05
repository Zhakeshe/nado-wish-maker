import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import backgroundImage from "@/assets/background-petroglyphs.png";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if user already logged in
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        supabase
          .from("profiles")
          .select("is_verified")
          .eq("user_id", data.user.id)
          .maybeSingle()
          .then(({ data: profile }) => {
            navigate(profile?.is_verified ? "/" : "/verify-email");
          });
      }
    });
  }, [navigate]);

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  // SIGNIN - simple and fast
  const handleSignin = async () => {
    if (!isValidEmail(email)) {
      toast({ variant: "destructive", title: "Email форматы дұрыс емес" });
      return;
    }
    if (password.length < 6) {
      toast({ variant: "destructive", title: "Пароль ең кем 6 таңба" });
      return;
    }

    setIsLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      setIsLoading(false);
      toast({ 
        variant: "destructive", 
        title: error.message.includes("Invalid login") ? "Email немесе пароль қате" : error.message 
      });
      return;
    }

    // Check verification status
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_verified")
      .eq("user_id", data.user!.id)
      .maybeSingle();

    setIsLoading(false);
    
    if (profile?.is_verified) {
      toast({ title: "Кіру сәтті!" });
      navigate("/");
    } else {
      navigate("/verify-email");
    }
  };

  // SIGNUP - simple, email verification handled on verify-email page
  const handleSignup = async () => {
    if (!fullName.trim()) {
      toast({ variant: "destructive", title: "Атыңызды енгізіңіз" });
      return;
    }
    if (!isValidEmail(email)) {
      toast({ variant: "destructive", title: "Email форматы дұрыс емес" });
      return;
    }
    if (password.length < 6) {
      toast({ variant: "destructive", title: "Пароль ең кем 6 таңба" });
      return;
    }

    setIsLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/verify-email`,
      },
    });

    setIsLoading(false);

    if (error) {
      toast({ 
        variant: "destructive", 
        title: error.message.includes("already registered") 
          ? "Бұл email тіркелген! Кіру табын басыңыз" 
          : error.message 
      });
      return;
    }

    toast({ title: "Тіркелу сәтті!", description: "Верификация бетіне өтіңіз" });
    navigate("/verify-email");
  };

  // FORGOT PASSWORD
  const handleForgotPassword = async () => {
    if (!isValidEmail(email)) {
      toast({ variant: "destructive", title: "Email енгізіңіз" });
      return;
    }

    setIsLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setIsLoading(false);

    if (error) {
      toast({ variant: "destructive", title: error.message });
      return;
    }

    toast({ title: "Сілтеме жіберілді!", description: "Поштаңызды тексеріңіз" });
    setShowForgotPassword(false);
  };

  // Forgot password view
  if (showForgotPassword) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4 relative"
        style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
        <Card className="w-full max-w-md relative z-10 bg-card/95 backdrop-blur border border-primary/20">
          <CardHeader className="text-center">
            <CardTitle>Құпия сөзді қалпына келтіру</CardTitle>
            <CardDescription>Email енгізіңіз</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="name@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <Button onClick={handleForgotPassword} className="w-full" disabled={isLoading}>
              {isLoading ? "Жіберілуде..." : "Сілтеме жіберу"}
            </Button>
            <Button variant="outline" className="w-full" onClick={() => setShowForgotPassword(false)}>
              Артқа
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main auth view
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: "cover", backgroundPosition: "center" }}
    >
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />

      <Card className="w-full max-w-md relative z-10 bg-card/95 backdrop-blur border border-primary/20">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">TENGIR</CardTitle>
          <CardDescription>Қазақстанның археологиялық мұрасы</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={mode} onValueChange={(v) => setMode(v as typeof mode)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Кіру</TabsTrigger>
              <TabsTrigger value="signup">Тіркелу</TabsTrigger>
            </TabsList>

            {/* SIGNIN */}
            <TabsContent value="signin" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  placeholder="name@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Пароль</Label>
                <Input
                  type="password"
                  placeholder="••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button className="w-full" onClick={handleSignin} disabled={isLoading}>
                {isLoading ? "Кіруде..." : "Кіру"}
              </Button>
              <Button variant="link" className="w-full text-sm" onClick={() => setShowForgotPassword(true)}>
                Құпия сөзді ұмыттыңыз ба?
              </Button>
            </TabsContent>

            {/* SIGNUP */}
            <TabsContent value="signup" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Аты-жөні</Label>
                <Input
                  type="text"
                  placeholder="Толық аты"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  placeholder="name@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Пароль</Label>
                <Input
                  type="password"
                  placeholder="••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Ең кем 6 таңба</p>
              </div>
              <Button className="w-full" onClick={handleSignup} disabled={isLoading}>
                {isLoading ? "Тіркелуде..." : "Тіркелу"}
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
