import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Mail, CheckCircle2, AlertCircle } from "lucide-react";
import backgroundImage from "@/assets/background-petroglyphs.png";

const RESEND_SECONDS = 60;

const VerifyEmail = () => {
  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [userEmail, setUserEmail] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    let timer: number | undefined;
    if (secondsLeft > 0) {
      timer = window.setTimeout(() => setSecondsLeft((prev) => prev - 1), 1000);
    }
    return () => {
      if (timer) window.clearTimeout(timer);
    };
  }, [secondsLeft]);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      navigate("/auth");
      return;
    }

    setUserEmail(user.email || "");

    const { data: profile } = await supabase
      .from("profiles")
      .select("is_verified")
      .eq("user_id", user.id)
      .single();

    if (profile?.is_verified) {
      navigate("/");
    }
  };

  const verifyCode = async () => {
    if (code.length !== 6) {
      toast({ 
        variant: "destructive", 
        title: "Қате", 
        description: "6 таңбалы кодты енгізіңіз" 
      });
      return;
    }

    setIsVerifying(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }

    const { data: profile, error: fetchError } = await supabase
      .from("profiles")
      .select("verification_code, code_expires_at")
      .eq("user_id", user.id)
      .single();

    if (fetchError || !profile) {
      toast({ 
        variant: "destructive", 
        title: "Қате", 
        description: "Профиль табылмады" 
      });
      setIsVerifying(false);
      return;
    }

    if (profile.verification_code !== code) {
      toast({ 
        variant: "destructive", 
        title: "Қате код", 
        description: "Дұрыс емес верификациялық код" 
      });
      setIsVerifying(false);
      return;
    }

    const expiresAt = new Date(profile.code_expires_at);
    if (expiresAt < new Date()) {
      toast({ 
        variant: "destructive", 
        title: "Код өткен", 
        description: "Кодтың мерзімі өтті. Жаңа код жіберіңіз" 
      });
      setIsVerifying(false);
      return;
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ 
        is_verified: true, 
        verification_code: null,
        code_expires_at: null 
      })
      .eq("user_id", user.id);

    setIsVerifying(false);

    if (updateError) {
      toast({ 
        variant: "destructive", 
        title: "Қате", 
        description: updateError.message 
      });
      return;
    }

    toast({ 
      title: "Құттықтаймыз! 🎉", 
      description: "Email расталды! Барлық мүмкіндіктер ашылды" 
    });
    
    navigate("/");
  };

  const resendCode = async () => {
    setIsResending(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("last_resend_at")
      .eq("user_id", user.id)
      .single();

    if (profile?.last_resend_at) {
      const lastResend = new Date(profile.last_resend_at);
      const now = new Date();
      const diffSeconds = (now.getTime() - lastResend.getTime()) / 1000;
      
      if (diffSeconds < RESEND_SECONDS) {
        toast({ 
          variant: "destructive", 
          title: "Тым жиі", 
          description: `Күтіңіз ${Math.ceil(RESEND_SECONDS - diffSeconds)} секунд` 
        });
        setIsResending(false);
        return;
      }
    }

    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        verification_code: newCode,
        code_expires_at: expiresAt.toISOString(),
        last_resend_at: new Date().toISOString(),
      })
      .eq("user_id", user.id);

    if (updateError) {
      toast({ 
        variant: "destructive", 
        title: "Қате", 
        description: updateError.message 
      });
      setIsResending(false);
      return;
    }

    const { error: emailError } = await supabase.functions.invoke("send-verification-email", {
      body: { email: user.email, code: newCode },
    });

    setIsResending(false);

    if (emailError) {
      toast({ 
        variant: "destructive", 
        title: "Email жіберілмеді", 
        description: emailError.message 
      });
      return;
    }

    setSecondsLeft(RESEND_SECONDS);
    toast({ 
      title: "Код жіберілді", 
      description: "Жаңа код поштаңызға жіберілді" 
    });
  };

  const isResendDisabled = isResending || secondsLeft > 0;

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
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Mail className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold">Email растау</CardTitle>
          <CardDescription>
            {userEmail && (
              <span className="block font-medium text-foreground mt-2">{userEmail}</span>
            )}
            Поштаңызға жіберілген 6 таңбалы кодты енгізіңіз
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Input
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="000000"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              className="text-center text-2xl font-mono tracking-widest"
            />
          </div>

          <Button 
            onClick={verifyCode} 
            disabled={isVerifying || code.length !== 6}
            className="w-full"
            size="lg"
          >
            {isVerifying ? "Тексеру..." : "Растау"}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">немесе</span>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={resendCode}
            disabled={isResendDisabled}
            className="w-full"
          >
            {secondsLeft > 0 
              ? `Қайта жіберу ${secondsLeft}s` 
              : isResending 
                ? "Жіберілуде..." 
                : "Кодты қайта жіберу"}
          </Button>

          <div className="space-y-3 pt-4">
            <div className="flex items-start gap-3 text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-foreground mb-1">Код келмесе:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Spam немесе Junk папкасын тексеріңіз</li>
                  <li>• noreply@mydomain.kz адресінен келген</li>
                  <li>• Код 5 минут жарамды</li>
                </ul>
              </div>
            </div>

            <div className="flex items-start gap-3 text-sm bg-accent/10 p-3 rounded-lg">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5 text-accent" />
              <div className="text-foreground">
                <p className="font-medium mb-1">Растағаннан кейін:</p>
                <p className="text-xs text-muted-foreground">
                  Білім беру ойындары, интерактивті карта, 3D коллекция және жеке кабинет ашылады
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmail;
