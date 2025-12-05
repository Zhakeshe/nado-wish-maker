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
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleForgotPassword = async () => {
    if (!isValidEmail(email)) {
      toast({
        variant: "destructive",
        title: "Қате",
        description: "Email форматы дұрыс емес",
      });
      return;
    }

    setIsLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setIsLoading(false);

    if (error) {
      toast({
        variant: "destructive",
        title: "Қате",
        description: error.message,
      });
      return;
    }

    setResetEmailSent(true);
    toast({
      title: "Сілтеме жіберілді!",
      description: "Поштаңызды тексеріңіз",
    });
  };

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

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  };

  const handleSignup = async () => {
    if (!isValidEmail(email)) {
      toast({
        variant: "destructive",
        title: "Қате",
        description: "Email форматы дұрыс емес (мысалы: name@gmail.com)",
      });
      return;
    }
    
    if (!fullName.trim() || password.length < 6) {
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
      let errorMessage = authError.message;
      if (authError.message.includes("User already registered")) {
        errorMessage = "Бұл email тіркелген! \"Кіру\" табын басыңыз.";
      }
      toast({
        variant: "destructive",
        title: "Тіркелу сәтсіз",
        description: errorMessage,
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

    // Generate verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Create verification code in database
    const { data: codeData, error: codeError } = await supabase.rpc("create_verification_code");

    const codeResult = codeData as { success: boolean; code?: string; error?: string } | null;
    const codeToSend = codeResult?.success && codeResult?.code ? codeResult.code : verificationCode;

    if (codeError) {
      console.error("Verification code creation error:", codeError);
    }

    // Send email with timeout
    try {
      const { error: emailError } = await Promise.race([
        supabase.functions.invoke("send-verification-email", {
          body: { email: email.trim().toLowerCase(), code: codeToSend },
        }),
        new Promise<{ error: Error }>((_, reject) => 
          setTimeout(() => reject({ error: new Error('Email жіберу ұзақ болды') }), 15000)
        )
      ]);

      if (emailError) {
        toast({
          title: "Тіркелу сәтті!",
          description: "Verify-email бетінде жаңа код сұраңыз",
        });
      } else {
        toast({
          title: "Тіркелу сәтті!",
          description: "Верификациялық код поштаңызға жіберілді",
        });
      }
    } catch {
      toast({
        title: "Тіркелу сәтті!",
        description: "Verify-email бетінде жаңа код сұраңыз",
      });
    }

    setIsLoading(false);
    navigate("/verify-email");
  };

  const handleSignin = async () => {
    if (!isValidEmail(email)) {
      toast({
        variant: "destructive",
        title: "Қате",
        description: "Email форматы дұрыс емес",
      });
      return;
    }
    
    if (password.length < 6) {
      toast({
        variant: "destructive",
        title: "Қате",
        description: "Пароль ең кем 6 таңба болуы керек",
      });
      return;
    }

    setIsLoading(true);

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setIsLoading(false);
      let errorMessage = authError.message;
      if (authError.message.includes("Invalid login credentials")) {
        errorMessage = "Email немесе құпия сөз қате.";
      }
      toast({
        variant: "destructive",
        title: "Кіру сәтсіз",
        description: errorMessage,
      });
      return;
    }

    if (!authData.user) {
      setIsLoading(false);
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

    setIsLoading(false);

    if (profile?.is_verified) {
      toast({ title: "Кіру сәтті!" });
      navigate("/");
    } else {
      // Profile exists but not verified, or no profile - go to verify page
      // User can request verification code there
      toast({ title: "Email растау керек" });
      navigate("/verify-email");
    }
  };

  // Forgot password modal
  if (showForgotPassword) {
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
        <Card className="w-full max-w-md relative z-10 bg-card/95 backdrop-blur border border-primary/20 shadow-elegant">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-2xl font-bold">
              {resetEmailSent ? "Сілтеме жіберілді!" : "Құпия сөзді қалпына келтіру"}
            </CardTitle>
            <CardDescription>
              {resetEmailSent 
                ? "Поштаңыздағы сілтемеге өтіңіз" 
                : "Email енгізіңіз, сілтеме жібереміз"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!resetEmailSent && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="reset-email">Email</Label>
                  <Input
                    id="reset-email"
                    type="email"
                    placeholder="name@mydomain.kz"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <Button 
                  onClick={handleForgotPassword} 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? "Жүктеу..." : "Сілтеме жіберу"}
                </Button>
              </>
            )}
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setShowForgotPassword(false);
                setResetEmailSent(false);
              }}
            >
              Кіру бетіне оралу
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
              <Button
                type="button"
                variant="link"
                className="w-full text-sm"
                onClick={() => setShowForgotPassword(true)}
              >
                Құпия сөзді ұмыттыңыз ба?
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
