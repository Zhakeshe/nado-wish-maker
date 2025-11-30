import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import backgroundImage from "@/assets/background-petroglyphs.png";

const RESEND_SECONDS = 60;

const Auth = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [fullName, setFullName] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  const isCodeDisabled = useMemo(() => isSending || secondsLeft > 0 || !email, [isSending, secondsLeft, email]);

  useEffect(() => {
    let timer: number | undefined;
    if (secondsLeft > 0) {
      timer = window.setTimeout(() => setSecondsLeft((prev) => prev - 1), 1000);
    }
    return () => {
      if (timer) {
        window.clearTimeout(timer);
      }
    };
  }, [secondsLeft]);

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) navigate("/");
    };
    checkUser();
  }, [navigate]);

  const sendCode = async () => {
    if (!email.includes("@")) {
      toast({ variant: "destructive", title: "Email", description: "Дұрыс email енгізіңіз" });
      return;
    }
    setIsSending(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: mode === "signup",
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/auth`,
      },
    });
    setIsSending(false);

    if (error) {
      toast({ variant: "destructive", title: "Код жіберілмеді", description: error.message });
      return;
    }

    setSecondsLeft(RESEND_SECONDS);
    toast({ title: "Код жіберілді", description: "Поштаны тексеріп, 6-сандық кодты енгізіңіз" });
  };

  const verifyCode = async () => {
    if (code.length !== 6) {
      toast({ variant: "destructive", title: "Код қате", description: "6 таңбалы кодты енгізіңіз" });
      return;
    }
    setIsVerifying(true);
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: "email",
    });
    setIsVerifying(false);

    if (error) {
      toast({ variant: "destructive", title: "Растау сәтсіз", description: error.message });
      return;
    }

    toast({ title: "Құттықтаймыз!", description: "Email расталды, енді толық функционал ашылды" });
    navigate("/");
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
          <CardTitle className="text-3xl font-bold">Email верификациясы</CardTitle>
          <CardDescription>Кодты енгізбей коллекция, карта, ойын ашылмайды</CardDescription>
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
                <Label htmlFor="signin-code">6 таңбалы код</Label>
                <Input
                  id="signin-code"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="000000"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button type="button" className="flex-1" onClick={sendCode} disabled={isCodeDisabled}>
                  {secondsLeft > 0 ? `Қайта жіберу ${secondsLeft}s` : "Код жіберу"}
                </Button>
                <Button type="button" variant="secondary" className="flex-1" onClick={verifyCode} disabled={isVerifying}>
                  {isVerifying ? "Тексеру..." : "Кіру"}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                noreply@mydomain.kz арқылы келетін кодты енгізіңіз. Қауіпсіздік үшін камера/геолокация сұралмайды.
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
                <Label htmlFor="signup-code">6 таңбалы код</Label>
                <Input
                  id="signup-code"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="000000"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button type="button" className="flex-1" onClick={sendCode} disabled={isCodeDisabled}>
                  {secondsLeft > 0 ? `Қайта жіберу ${secondsLeft}s` : "Код жіберу"}
                </Button>
                <Button type="button" variant="secondary" className="flex-1" onClick={verifyCode} disabled={isVerifying}>
                  {isVerifying ? "Растау..." : "Тіркелу"}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                6 таңбалы кодты енгізген соң ғана коллекция, карта және ойын толық ашылады.
              </p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
