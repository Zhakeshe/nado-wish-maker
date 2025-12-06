
-- News articles table for admin to manage
CREATE TABLE public.news_articles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  title_kz TEXT,
  title_en TEXT,
  content TEXT NOT NULL,
  content_kz TEXT,
  content_en TEXT,
  category TEXT DEFAULT 'news',
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  featured BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT true,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Site content for editable pages (About, etc.)
CREATE TABLE public.site_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_key TEXT NOT NULL UNIQUE,
  content JSONB NOT NULL DEFAULT '{}',
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User bans table
CREATE TABLE public.user_bans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reason TEXT,
  banned_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  banned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_bans ENABLE ROW LEVEL SECURITY;

-- News policies
CREATE POLICY "Anyone can view published news"
ON public.news_articles FOR SELECT
USING (published = true);

CREATE POLICY "Admins can manage all news"
ON public.news_articles FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Site content policies
CREATE POLICY "Anyone can view site content"
ON public.site_content FOR SELECT
USING (true);

CREATE POLICY "Admins can manage site content"
ON public.site_content FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- User bans policies
CREATE POLICY "Admins can view all bans"
ON public.user_bans FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage bans"
ON public.user_bans FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert default site content
INSERT INTO public.site_content (page_key, content) VALUES
('about', '{"teamMembers": [], "mission": "", "vision": "", "stats": {}}');

-- Add trigger for updated_at
CREATE TRIGGER update_news_updated_at BEFORE UPDATE ON public.news_articles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_site_content_updated_at BEFORE UPDATE ON public.site_content
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
