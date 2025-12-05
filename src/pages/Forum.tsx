import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  MessageSquare, Plus, Users, Eye, Clock, Pin, Search,
  Send, ArrowLeft, User
} from "lucide-react";
import { Link } from "react-router-dom";

interface ForumTopic {
  id: string;
  title: string;
  description: string | null;
  category: string;
  author_id: string | null;
  created_at: string;
  is_pinned: boolean;
  views_count: number;
  posts_count: number;
  author_name?: string;
}

interface ForumPost {
  id: string;
  topic_id: string;
  content: string;
  author_id: string | null;
  created_at: string;
  author_name?: string;
}

const translations = {
  kz: {
    title: "Қауымдастық форумы",
    subtitle: "Тарих пен мәдениет туралы талқылаңыз",
    newTopic: "Жаңа тақырып",
    categories: {
      general: "Жалпы",
      history: "Тарих",
      archaeology: "Археология",
      culture: "Мәдениет",
      help: "Көмек",
    },
    search: "Тақырыпты іздеу...",
    posts: "жауап",
    views: "көрілім",
    by: "Автор:",
    createTopic: "Тақырып құру",
    topicTitle: "Тақырып атауы",
    topicDescription: "Сипаттама",
    category: "Санат",
    create: "Құру",
    cancel: "Болдырмау",
    writeReply: "Жауап жазыңыз...",
    send: "Жіберу",
    backToForum: "Форумға оралу",
    loginRequired: "Тіркелу қажет",
    loginToPost: "Жазу үшін жүйеге кіріңіз",
    noTopics: "Тақырыптар жоқ",
    beFirst: "Бірінші тақырып құрыңыз!",
  },
  ru: {
    title: "Форум сообщества",
    subtitle: "Обсуждайте историю и культуру",
    newTopic: "Новая тема",
    categories: {
      general: "Общее",
      history: "История",
      archaeology: "Археология",
      culture: "Культура",
      help: "Помощь",
    },
    search: "Поиск темы...",
    posts: "ответов",
    views: "просмотров",
    by: "Автор:",
    createTopic: "Создать тему",
    topicTitle: "Название темы",
    topicDescription: "Описание",
    category: "Категория",
    create: "Создать",
    cancel: "Отмена",
    writeReply: "Напишите ответ...",
    send: "Отправить",
    backToForum: "Вернуться к форуму",
    loginRequired: "Требуется авторизация",
    loginToPost: "Войдите, чтобы писать",
    noTopics: "Нет тем",
    beFirst: "Создайте первую тему!",
  },
  en: {
    title: "Community Forum",
    subtitle: "Discuss history and culture",
    newTopic: "New Topic",
    categories: {
      general: "General",
      history: "History",
      archaeology: "Archaeology",
      culture: "Culture",
      help: "Help",
    },
    search: "Search topics...",
    posts: "replies",
    views: "views",
    by: "By:",
    createTopic: "Create Topic",
    topicTitle: "Topic Title",
    topicDescription: "Description",
    category: "Category",
    create: "Create",
    cancel: "Cancel",
    writeReply: "Write a reply...",
    send: "Send",
    backToForum: "Back to Forum",
    loginRequired: "Login Required",
    loginToPost: "Please login to post",
    noTopics: "No topics",
    beFirst: "Be the first to create a topic!",
  },
};

const Forum = () => {
  const { language } = useLanguage();
  const t = translations[language];
  const { toast } = useToast();
  
  const [topics, setTopics] = useState<ForumTopic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<ForumTopic | null>(null);
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  // New topic dialog
  const [newTopicOpen, setNewTopicOpen] = useState(false);
  const [newTopicForm, setNewTopicForm] = useState({
    title: "",
    description: "",
    category: "general",
  });
  
  // Reply input
  const [replyContent, setReplyContent] = useState("");

  useEffect(() => {
    checkUser();
    fetchTopics();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const fetchTopics = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("forum_topics")
      .select("*")
      .order("is_pinned", { ascending: false })
      .order("updated_at", { ascending: false });
    
    if (data) {
      // Fetch author names from profiles
      const authorIds = [...new Set(data.map(t => t.author_id).filter(Boolean))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, full_name")
        .in("user_id", authorIds);
      
      const topicsWithAuthors = data.map(topic => ({
        ...topic,
        author_name: profiles?.find(p => p.user_id === topic.author_id)?.full_name || "Белгісіз"
      }));
      
      setTopics(topicsWithAuthors);
    }
    setLoading(false);
  };

  const fetchPosts = async (topicId: string) => {
    const { data, error } = await supabase
      .from("forum_posts")
      .select("*")
      .eq("topic_id", topicId)
      .order("created_at", { ascending: true });
    
    if (data) {
      const authorIds = [...new Set(data.map(p => p.author_id).filter(Boolean))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, full_name")
        .in("user_id", authorIds);
      
      const postsWithAuthors = data.map(post => ({
        ...post,
        author_name: profiles?.find(p => p.user_id === post.author_id)?.full_name || "Белгісіз"
      }));
      
      setPosts(postsWithAuthors);
    }

    // Increment views
    await supabase
      .from("forum_topics")
      .update({ views_count: (selectedTopic?.views_count || 0) + 1 })
      .eq("id", topicId);
  };

  const openTopic = async (topic: ForumTopic) => {
    setSelectedTopic(topic);
    await fetchPosts(topic.id);
  };

  const createTopic = async () => {
    if (!user) {
      toast({ variant: "destructive", title: t.loginRequired, description: t.loginToPost });
      return;
    }

    if (!newTopicForm.title.trim()) return;

    const { error } = await supabase
      .from("forum_topics")
      .insert({
        title: newTopicForm.title,
        description: newTopicForm.description || null,
        category: newTopicForm.category,
        author_id: user.id,
      });

    if (error) {
      toast({ variant: "destructive", title: "Қате", description: error.message });
      return;
    }

    toast({ title: "Сәтті", description: "Тақырып құрылды" });
    setNewTopicOpen(false);
    setNewTopicForm({ title: "", description: "", category: "general" });
    fetchTopics();
  };

  const sendReply = async () => {
    if (!user) {
      toast({ variant: "destructive", title: t.loginRequired, description: t.loginToPost });
      return;
    }

    if (!replyContent.trim() || !selectedTopic) return;

    const { error } = await supabase
      .from("forum_posts")
      .insert({
        topic_id: selectedTopic.id,
        content: replyContent,
        author_id: user.id,
      });

    if (error) {
      toast({ variant: "destructive", title: "Қате", description: error.message });
      return;
    }

    setReplyContent("");
    fetchPosts(selectedTopic.id);
  };

  const filteredTopics = topics.filter(topic => {
    const matchesSearch = topic.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "all" || topic.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      general: "bg-blue-100 text-blue-700",
      history: "bg-amber-100 text-amber-700",
      archaeology: "bg-green-100 text-green-700",
      culture: "bg-purple-100 text-purple-700",
      help: "bg-red-100 text-red-700",
    };
    return colors[category] || colors.general;
  };

  // Topic detail view
  if (selectedTopic) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navigation />
        
        <main className="flex-1 pt-20 container mx-auto px-4 py-8">
          <Button 
            variant="ghost" 
            onClick={() => setSelectedTopic(null)}
            className="mb-4 gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {t.backToForum}
          </Button>

          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <Badge className={getCategoryColor(selectedTopic.category)}>
                    {t.categories[selectedTopic.category as keyof typeof t.categories]}
                  </Badge>
                  <CardTitle className="mt-2 text-2xl">{selectedTopic.title}</CardTitle>
                  {selectedTopic.description && (
                    <p className="text-muted-foreground mt-2">{selectedTopic.description}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-4">
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {selectedTopic.author_name}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {new Date(selectedTopic.created_at).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {selectedTopic.views_count}
                </span>
              </div>
            </CardHeader>
          </Card>

          {/* Posts */}
          <div className="space-y-4 mb-6">
            {posts.map((post) => (
              <Card key={post.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{post.author_name}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(post.created_at).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-foreground whitespace-pre-wrap">{post.content}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Reply input */}
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-3">
                <Textarea
                  placeholder={t.writeReply}
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  className="flex-1"
                  rows={3}
                />
                <Button onClick={sendReply} className="self-end gap-2">
                  <Send className="w-4 h-4" />
                  {t.send}
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>

        <Footer />
      </div>
    );
  }

  // Topics list view
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      
      <main className="flex-1 pt-20">
        {/* Header */}
        <section className="py-12 bg-gradient-archaeology">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-background rounded-full mb-6 border border-primary/20">
                <MessageSquare className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">{t.title}</span>
              </div>
              <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">{t.title}</h1>
              <p className="text-lg text-muted-foreground">{t.subtitle}</p>
            </div>
          </div>
        </section>

        {/* Controls */}
        <section className="py-6 border-b">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex gap-4 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder={t.search}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Барлығы</SelectItem>
                    <SelectItem value="general">{t.categories.general}</SelectItem>
                    <SelectItem value="history">{t.categories.history}</SelectItem>
                    <SelectItem value="archaeology">{t.categories.archaeology}</SelectItem>
                    <SelectItem value="culture">{t.categories.culture}</SelectItem>
                    <SelectItem value="help">{t.categories.help}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={() => setNewTopicOpen(true)} className="gap-2 w-full md:w-auto">
                <Plus className="w-4 h-4" />
                {t.newTopic}
              </Button>
            </div>
          </div>
        </section>

        {/* Topics list */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : filteredTopics.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">{t.noTopics}</h3>
                <p className="text-muted-foreground">{t.beFirst}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredTopics.map((topic) => (
                  <Card 
                    key={topic.id} 
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => openTopic(topic)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <MessageSquare className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            {topic.is_pinned && <Pin className="w-4 h-4 text-primary" />}
                            <Badge className={getCategoryColor(topic.category)}>
                              {t.categories[topic.category as keyof typeof t.categories]}
                            </Badge>
                          </div>
                          <h3 className="font-semibold text-lg truncate">{topic.title}</h3>
                          {topic.description && (
                            <p className="text-sm text-muted-foreground truncate">{topic.description}</p>
                          )}
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span>{t.by} {topic.author_name}</span>
                            <span className="flex items-center gap-1">
                              <MessageSquare className="w-3 h-3" />
                              {topic.posts_count} {t.posts}
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {topic.views_count} {t.views}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* New Topic Dialog */}
      <Dialog open={newTopicOpen} onOpenChange={setNewTopicOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.createTopic}</DialogTitle>
            <DialogDescription>Жаңа тақырып құру</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>{t.topicTitle}</Label>
              <Input
                value={newTopicForm.title}
                onChange={(e) => setNewTopicForm({ ...newTopicForm, title: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label>{t.topicDescription}</Label>
              <Textarea
                value={newTopicForm.description}
                onChange={(e) => setNewTopicForm({ ...newTopicForm, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label>{t.category}</Label>
              <Select 
                value={newTopicForm.category} 
                onValueChange={(v) => setNewTopicForm({ ...newTopicForm, category: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">{t.categories.general}</SelectItem>
                  <SelectItem value="history">{t.categories.history}</SelectItem>
                  <SelectItem value="archaeology">{t.categories.archaeology}</SelectItem>
                  <SelectItem value="culture">{t.categories.culture}</SelectItem>
                  <SelectItem value="help">{t.categories.help}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewTopicOpen(false)}>
              {t.cancel}
            </Button>
            <Button onClick={createTopic}>
              {t.create}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Forum;