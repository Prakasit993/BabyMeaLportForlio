-- ========================================
-- Portfolio Database Schema for Supabase
-- (Prefixed to avoid conflicts with existing tables)
-- Run this in Supabase SQL Editor
-- ========================================

-- ========================================
-- Portfolio Profile Table
-- ========================================
CREATE TABLE IF NOT EXISTS portfolio_profile (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT,
  headline TEXT DEFAULT 'Senior Full-stack AI Engineer',
  tagline TEXT DEFAULT 'Bridging Complex Business Logic with Scalable AI Automation',
  introduction TEXT,
  philosophy TEXT,
  avatar_url TEXT,
  email TEXT,
  social_links JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- Portfolio Projects Table
-- ========================================
CREATE TABLE IF NOT EXISTS portfolio_projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  icon TEXT DEFAULT '📦',
  tags TEXT[] DEFAULT '{}',
  link_url TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- Portfolio Tech Stack Table
-- ========================================
CREATE TABLE IF NOT EXISTS portfolio_tech_stack (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL,
  icon TEXT DEFAULT '⚙️',
  items TEXT[] DEFAULT '{}',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- Row Level Security (RLS)
-- ========================================

-- Enable RLS on all tables
ALTER TABLE portfolio_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_tech_stack ENABLE ROW LEVEL SECURITY;

-- Public read access (anyone can view the portfolio)
CREATE POLICY "Public can view portfolio_profile" ON portfolio_profile
  FOR SELECT USING (true);

CREATE POLICY "Public can view portfolio_projects" ON portfolio_projects
  FOR SELECT USING (true);

CREATE POLICY "Public can view portfolio_tech_stack" ON portfolio_tech_stack
  FOR SELECT USING (true);

-- Authenticated users can update (admin only)
CREATE POLICY "Authenticated users can update portfolio_profile" ON portfolio_profile
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage portfolio_projects" ON portfolio_projects
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage portfolio_tech_stack" ON portfolio_tech_stack
  FOR ALL USING (auth.role() = 'authenticated');

-- ========================================
-- Storage Bucket for Portfolio Images
-- ========================================
-- Create a bucket called 'portfolio' in Storage dashboard
-- OR run this (if you don't have one already):
INSERT INTO storage.buckets (id, name, public) 
VALUES ('portfolio', 'portfolio', true)
ON CONFLICT (id) DO NOTHING;

-- ========================================
-- Insert Default Data
-- ========================================
INSERT INTO portfolio_profile (full_name, headline, tagline, introduction, philosophy)
VALUES (
  'Your Name',
  'Senior Full-stack AI Engineer',
  'Bridging Complex Business Logic with Scalable AI Automation',
  'สวัสดีครับ ผมเป็น Full-stack Developer ที่มีพื้นฐานจากการเป็นเจ้าของธุรกิจ ผมไม่ได้เริ่มต้นจากหน้าจอคอมพิวเตอร์ แต่เริ่มจากการมองหาโซลูชันเพื่อแก้ปัญหาจริงในธุรกิจส่วนตัว จนกลายเป็นความเชี่ยวชาญในการสร้างระบบที่ ''ทำเงิน'' และ ''ประหยัดเวลา'' ด้วยเทคโนโลยี Next.js, AI และ Automation',
  'ผมเชื่อในเรื่อง Clean Code และ Proactive Maintenance งานของผมจึงไม่ได้จบแค่ที่หน้าบ้านที่สวยงาม UX/UI แต่ต้องรวมถึงระบบหลังบ้าน Admin ที่ยืดหยุ่นและการจัดการความปลอดภัยข้อมูลที่รัดกุม เพื่อรองรับการเติบโตของธุรกิจในอนาคต'
);

INSERT INTO portfolio_projects (title, subtitle, description, icon, tags, sort_order) VALUES
('SmartShip', 'AI-Powered ERP', 'ระบบจัดการทรัพยากรและสต็อกสินค้าอัจฉริยะที่ใช้ AI ช่วยตัดสินใจในเชิงธุรกิจ รองรับการวิเคราะห์ข้อมูลแบบ Real-time และการคาดการณ์ยอดขายล่วงหน้า', '🚀', ARRAY['AI Integration', 'ERP System', 'Business Intelligence'], 1),
('HelpMe CheckSystem', 'Proactive Monitoring', 'ระบบเฝ้าระวังโครงสร้างพื้นฐานไอทีอัตโนมัติ 24/7 เพื่อรับประกันความเสถียรระดับ Zero Downtime พร้อมแจ้งเตือนปัญหาก่อนเกิดขึ้นจริง', '🛡️', ARRAY['24/7 Monitoring', 'Zero Downtime', 'Auto Alerts'], 2),
('Multi-tenant Architecture', 'Scalable Infrastructure', 'การวางสถาปัตยกรรมที่รองรับหลายธุรกิจภายใต้ระบบจัดการเดียวอย่างปลอดภัยและคลีนที่สุด พร้อม Data Isolation และ Performance Optimization', '🏗️', ARRAY['Multi-tenant', 'Data Security', 'Scalability'], 3);

INSERT INTO portfolio_tech_stack (category, icon, items, sort_order) VALUES
('Frontend', '🎨', ARRAY['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'], 1),
('Backend & Data', '⚙️', ARRAY['Supabase', 'PostgreSQL', 'Python', 'Node.js'], 2),
('AI & Automation', '🤖', ARRAY['n8n', 'OpenAI SDK', 'Webhook Integrations'], 3),
('Infrastructure', '☁️', ARRAY['Docker', 'System Monitoring', 'DevOps'], 4);

-- ========================================
-- Audit Logs Table (Track all changes)
-- ========================================
CREATE TABLE IF NOT EXISTS portfolio_audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  user_email TEXT,
  action TEXT NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE'
  table_name TEXT NOT NULL,
  record_id UUID,
  old_data JSONB,
  new_data JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on audit logs
ALTER TABLE portfolio_audit_logs ENABLE ROW LEVEL SECURITY;

-- Only authenticated users can view logs
CREATE POLICY "Authenticated users can view audit logs" ON portfolio_audit_logs
  FOR SELECT USING (auth.role() = 'authenticated');

-- Only authenticated users can insert logs
CREATE POLICY "Authenticated users can insert audit logs" ON portfolio_audit_logs
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- ========================================
-- Passkeys/WebAuthn Credentials Table
-- ========================================
CREATE TABLE IF NOT EXISTS portfolio_passkeys (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  credential_id TEXT UNIQUE NOT NULL,
  public_key TEXT NOT NULL,
  counter INTEGER DEFAULT 0,
  device_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_used_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE portfolio_passkeys ENABLE ROW LEVEL SECURITY;

-- Users can only manage their own passkeys
CREATE POLICY "Users can manage own passkeys" ON portfolio_passkeys
  FOR ALL USING (auth.uid() = user_id);

-- ========================================
-- Admin Settings Table
-- ========================================
CREATE TABLE IF NOT EXISTS portfolio_admin_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  require_passkey BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE portfolio_admin_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own settings" ON portfolio_admin_settings
  FOR ALL USING (auth.uid() = user_id);
