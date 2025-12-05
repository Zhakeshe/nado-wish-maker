import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const performInitialCheck = async () => {
      await checkAuth();
      if (isMounted) {
        setInitialCheckDone(true);
      }
    };

    performInitialCheck();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // Only react to auth changes after initial check is done
        if (!initialCheckDone) return;
        
        if (session?.user) {
          await checkVerification(session.user.id);
        } else {
          if (isMounted) {
            setIsAuthenticated(false);
            setIsVerified(false);
            setLoading(false);
          }
        }
      }
    );

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [initialCheckDone]);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    setIsAuthenticated(true);
    await checkVerification(user.id);
  };

  const checkVerification = async (userId: string) => {
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_verified")
      .eq("user_id", userId)
      .single();

    setIsVerified(profile?.is_verified || false);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (!isVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
