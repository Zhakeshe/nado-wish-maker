import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Mail, CheckCircle2, AlertCircle, Edit2 } from "lucide-react";
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

    // Use secure RPC function to verify code server-side
    const { data, error } = await supabase.rpc('verify_email_code', {
      code_input: code
    });

    setIsVerifying(false);

    if (error) {
      toast({ 
        variant: "destructive", 
        title: "Қате", 
        description: error.message 
      });
      return;
    }

    const result = data as { success: boolean; error?: string };

    if (!result.success) {
      let errorMessage = "Белгісіз қате";
      switch (result.error) {
        case 'Not authenticated':
          errorMessage = "Авторизация қажет";
          navigate("/auth");
          return;
        case 'No verification code found':
          errorMessage = "Верификациялық код табылмады. Жаңа код сұраңыз";
          break;
        case 'Code has expired':
          errorMessage = "Кодтың мерзімі өтті. Жаңа код жіберіңіз";
          break;
        case 'Invalid code':
          errorMessage = "Дұрыс емес верификациялық код";
          break;
        default:
          errorMessage = result.error || "Белгісіз қате";
      }
      toast({ 
        variant: "destructive", 
        title: "Қате", 
        description: errorMessage 
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

    // Use secure RPC function to create verification code server-side
    const { data, error } = await supabase.rpc('create_verification_code');

    if (error) {
      toast({ 
        variant: "destructive", 
        title: "Қате", 
        description: error.message 
      });
      setIsResending(false);
      return;
    }

    const result = data as { success: boolean; code?: string; error?: string };

    if (!result.success) {
      toast({ 
        variant: "destructive", 
        title: "Қате", 
        description: result.error === 'Please wait before requesting a new code' 
          ? "Тым жиі. Біраз күтіңіз" 
          : result.error || "Белгісіз қате"
      });
      setIsResending(false);
      return;
    }

    // Send the code via email
    const { error: emailError } = await supabase.functions.invoke("send-verification-email", {
      body: { email: (user.email || "").trim().toLowerCase(), code: result.code },
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

  const handleChangeEmail = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Шығу сәтті",
      description: "Жаңа email-мен тіркелуге болады",
    });
    navigate("/auth");
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

      <Card className="w-full max-w-md relative z-10 bg-card/95 backdrop-blur border border-primary/20 shadow-elegant">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Mail className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold">Email растау</CardTitle>
          <CardDescription>
            {userEmail && (
              <div className="mt-2 space-y-2">
                <span className="block font-medium text-foreground">{userEmail}</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleChangeEmail}
                  className="text-xs text-muted-foreground hover:text-primary gap-1"
                >
                  <Edit2 className="w-3 h-3" />
                  Email қате ме? Өзгерту
                </Button>
              </div>
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