import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Medal, Award, RefreshCw } from "lucide-react";
import { useLanguage, Language } from "@/contexts/LanguageContext";

interface LeaderboardUser {
  id: string;
  full_name: string | null;
  points: number;
}

const translations: Record<Language, { title: string; points: string; anonymous: string; refresh: string }> = {
  ru: { title: "Лидерборд", points: "очков", anonymous: "Аноним", refresh: "Обновить" },
  kz: { title: "Лидерборд", points: "ұпай", anonymous: "Аноним", refresh: "Жаңарту" },
  en: { title: "Leaderboard", points: "points", anonymous: "Anonymous", refresh: "Refresh" },
};

export const Leaderboard = () => {
  const { language } = useLanguage();
  const t = translations[language];
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLeaderboard = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name, points")
      .order("points", { ascending: false })
      .limit(10);

    if (!error && data) {
      setUsers(data);
    }
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const getRankIcon = (index: number) => {
    if (index === 0) return <Trophy className="w-5 h-5 text-yellow-500" />;
    if (index === 1) return <Medal className="w-5 h-5 text-gray-400" />;
    if (index === 2) return <Award className="w-5 h-5 text-amber-600" />;
    return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-muted-foreground">{index + 1}</span>;
  };

  const getRankBg = (index: number) => {
    if (index === 0) return "bg-yellow-500/10 border-yellow-500/30";
    if (index === 1) return "bg-gray-400/10 border-gray-400/30";
    if (index === 2) return "bg-amber-600/10 border-amber-600/30";
    return "bg-muted/50";
  };

  if (loading) {
    return (
      <Card className="p-6 bg-card border-border">
        <div className="animate-pulse space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-muted rounded-lg" />
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 sm:p-6 bg-card border-border shadow-card">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h3 className="text-lg sm:text-xl font-bold flex items-center gap-2 text-foreground">
          <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          {t.title}
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => fetchLeaderboard(true)}
          disabled={refreshing}
          className="gap-1 text-muted-foreground hover:text-foreground text-xs sm:text-sm px-2 sm:px-3"
        >
          <RefreshCw className={`w-3 h-3 sm:w-4 sm:h-4 ${refreshing ? "animate-spin" : ""}`} />
          <span className="hidden sm:inline">{t.refresh}</span>
        </Button>
      </div>
      <div className="space-y-2">
        {users.map((user, index) => (
          <div
            key={user.id}
            className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border transition-all duration-300 hover:scale-[1.02] hover:shadow-md animate-fade-in ${getRankBg(index)}`}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex-shrink-0">{getRankIcon(index)}</div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate text-sm sm:text-base">
                {user.full_name || t.anonymous}
              </p>
            </div>
            <div className="flex-shrink-0 text-right">
              <span className="font-bold text-primary text-sm sm:text-base">{user.points}</span>
              <span className="text-[10px] sm:text-xs text-muted-foreground ml-1">{t.points}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
