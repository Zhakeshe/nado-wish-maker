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
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("is_verified")
          .eq("user_id", data.user.id)
          .maybeSingle();

        if (profile?.is_verified) {
          navigate("/");
        } else {
          navigate("/verify-email");
        }
      }
    };
    checkUser();
  }, [navigate]);

  const handleSignup = async () => {
    if (!email.includes("@") || !fullName.trim() || password.length < 6) {
      toast({
        variant: "destructive",
        title: "Қате",
        description: "Барлық өрістерді дұрыс толтырыңыз (пароль ең кем 6 таңба)",
      });
      return;
    }

    setIsLoading(true);

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/verify-email`,
      },
    });

    if (authError) {
      toast({
        variant: "destructive",
        title: "Тіркелу сәтсіз",
        description: authError.message,
      });
      setIsLoading(false);
      return;
    }

    if (!authData.user) {
      toast({
        variant: "destructive",
        title: "Қате",
        description: "Пайдаланушы жасалмады",
      });
      setIsLoading(false);
      return;
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    const profilePayload = {
      user_id: authData.user.id,
      full_name: fullName,
      verification_code: verificationCode,
      code_expires_at: expiresAt.toISOString(),
      last_resend_at: new Date().toISOString(),
      is_verified: false,
    };

    const { error: profileError } = await supabase
      .from("profiles")
      .upsert(profilePayload, { onConflict: "user_id" });

    if (profileError) {
      toast({
        variant: "destructive",
        title: "Профиль жаңартылмады",
        description: profileError.message,
      });
      setIsLoading(false);
      return;
    }

    const { error: emailError } = await supabase.functions.invoke("send-verification-email", {
      body: { email, code: verificationCode },
    });

    setIsLoading(false);

    if (emailError) {
      toast({
        variant: "destructive",
        title: "Email жіберілмеді",
        description: emailError.message,
      });
      return;
    }

    toast({
      title: "Тіркелу сәтті!",
      description: "Верификациялық код поштаңызға жіберілді",
    });

    navigate("/verify-email");
  };

  const handleSignin = async () => {
    if (!email.includes("@") || password.length < 6) {
      toast({
        variant: "destructive",
        title: "Қате",
        description: "Email және пароль енгізіңіз",
      });
      return;
    }

    setIsLoading(true);

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setIsLoading(false);

    if (authError) {
      toast({
        variant: "destructive",
        title: "Кіру сәтсіз",
        description: authError.message,
      });
      return;
    }

    if (!authData.user) {
      toast({
        variant: "destructive",
        title: "Қате",
        description: "Пайдаланушы табылмады",
      });
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("is_verified")
      .eq("user_id", authData.user.id)
      .maybeSingle();

    if (!profile) {
      const newCode = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

      const { error: profileCreateError } = await supabase
        .from("profiles")
        .upsert({
          user_id: authData.user.id,
          full_name: (authData.user.user_metadata as { full_name?: string })?.full_name ?? null,
          verification_code: newCode,
          code_expires_at: expiresAt.toISOString(),
          last_resend_at: new Date().toISOString(),
          is_verified: false,
        }, { onConflict: "user_id" });

      if (profileCreateError) {
        toast({
          variant: "destructive",
          title: "Профиль табылмады",
          description: profileCreateError.message,
        });
        return;
      }

      const { error: emailError } = await supabase.functions.invoke("send-verification-email", {
        body: { email, code: newCode },
      });

      if (emailError) {
        toast({
          variant: "destructive",
          title: "Email жіберілмеді",
          description: emailError.message,
        });
        return;
      }

      toast({
        title: "Профиль қалпына келтірілді",
        description: "Жаңа верификациялық код жіберілді",
      });

      navigate("/verify-email");
      return;
    }

    if (profile?.is_verified) {
      toast({
        title: "Кіру сәтті!",
        description: "Жүйеге кірдіңіз",
      });
      navigate("/");
    } else {
      toast({
        title: "Email расталмаған",
        description: "Алдымен email растау керек",
      });
      navigate("/verify-email");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />

      <Card className="w-full max-w-xl relative z-10 bg-card/95 backdrop-blur border border-primary/20 shadow-elegant">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-bold">TENGIR</CardTitle>
          <CardDescription>
            Email верификациясы: коллекция, карта, ойын ашылады
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" value={mode} onValueChange={(value) => setMode(value as typeof mode)} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Кіру</TabsTrigger>
              <TabsTrigger value="signup">Тіркелу</TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="signin-email">Email</Label>
                <Input
                  id="signin-email"
                  type="email"
                  placeholder="name@mydomain.kz"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signin-password">Пароль</Label>
                <Input
                  id="signin-password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={6}
                  required
                />
              </div>
              <Button type="button" className="w-full" onClick={handleSignin} disabled={isLoading}>
                {isLoading ? "Жүктеу..." : "Кіру"}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Email расталмаған болса, верификация бетіне өтесіз
              </p>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name">Толық аты</Label>
                <Input
                  id="signup-name"
                  type="text"
                  placeholder="Аты-жөні"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="name@mydomain.kz"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Пароль</Label>
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={6}
                  required
                />
                <p className="text-xs text-muted-foreground">Ең кем 6 таңба</p>
              </div>
              <Button type="button" className="w-full" onClick={handleSignup} disabled={isLoading}>
                {isLoading ? "Жүктеу..." : "Тіркелу"}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Тіркелгеннен кейін email растау үшін 6 таңбалы код аласыз
              </p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
