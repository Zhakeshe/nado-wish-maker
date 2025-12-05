import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import backgroundImage from "@/assets/background-petroglyphs.png";
import { Lock, ArrowLeft } from "lucide-react";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isValidSession, setIsValidSession] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Check if user came from password reset link
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsValidSession(true);
      } else {
        // Try to get session from URL hash (Supabase redirects with hash)
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        
        if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (!error) {
            setIsValidSession(true);
          }
        }
      }
    };
    checkSession();
  }, []);

  const handleResetPassword = async () => {
    if (password.length < 6) {
      toast({
        variant: "destructive",
        title: "Қате",
        description: "Пароль ең кем 6 таңба болуы керек",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Қате",
        description: "Парольдер сәйкес келмейді",
      });
      return;
    }

    setIsLoading(true);

    const { error } = await supabase.auth.updateUser({
      password: password,
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

    toast({
      title: "Сәтті!",
      description: "Пароль сәтті өзгертілді",
    });

    navigate("/");
  };

  if (!isValidSession) {
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
        <Card className="w-full max-w-md relative z-10 bg-card/95 backdrop-blur border border-primary/20">
          <CardHeader className="text-center">
            <CardTitle>Сілтеме жарамсыз</CardTitle>
            <CardDescription>
              Құпия сөзді қалпына келтіру сілтемесі жарамсыз немесе мерзімі өтіп кеткен
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/auth")} className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
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

      <Card className="w-full max-w-md relative z-10 bg-card/95 backdrop-blur border border-primary/20 shadow-elegant">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Жаңа құпия сөз</CardTitle>
          <CardDescription>
            Жаңа құпия сөзіңізді енгізіңіз
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Жаңа пароль</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
            />
            <p className="text-xs text-muted-foreground">Ең кем 6 таңба</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Парольді растау</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              minLength={6}
            />
          </div>
          <Button 
            onClick={handleResetPassword} 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? "Жүктеу..." : "Парольді өзгерту"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;
