import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Trophy, Medal, Award } from "lucide-react";
import { useLanguage, Language } from "@/contexts/LanguageContext";

interface LeaderboardUser {
  id: string;
  full_name: string | null;
  points: number;
}

const translations: Record<Language, { title: string; points: string; anonymous: string }> = {
  ru: { title: "Лидерборд", points: "очков", anonymous: "Аноним" },
  kz: { title: "Лидерборд", points: "ұпай", anonymous: "Аноним" },
  en: { title: "Leaderboard", points: "points", anonymous: "Anonymous" },
};

export const Leaderboard = () => {
  const { language } = useLanguage();
  const t = translations[language];
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, points")
        .order("points", { ascending: false })
        .limit(10);

      if (!error && data) {
        setUsers(data);
      }
      setLoading(false);
    };

    fetchLeaderboard();
  }, []);

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
    <Card className="p-6 bg-card border-border shadow-card">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-foreground">
        <Trophy className="w-5 h-5 text-primary" />
        {t.title}
      </h3>
      <div className="space-y-2">
        {users.map((user, index) => (
          <div
            key={user.id}
            className={`flex items-center gap-3 p-3 rounded-lg border transition-all hover:scale-[1.02] ${getRankBg(index)}`}
          >
            <div className="flex-shrink-0">{getRankIcon(index)}</div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">
                {user.full_name || t.anonymous}
              </p>
            </div>
            <div className="flex-shrink-0 text-right">
              <span className="font-bold text-primary">{user.points}</span>
              <span className="text-xs text-muted-foreground ml-1">{t.points}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
