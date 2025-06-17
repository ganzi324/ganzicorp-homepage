-- GanziCorp Homepage Database Schema
-- Supabase에서 실행할 SQL 스크립트

-- 공지사항 테이블
CREATE TABLE IF NOT EXISTS notices (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_published BOOLEAN DEFAULT FALSE,
    author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- 문의사항 테이블
CREATE TABLE IF NOT EXISTS inquiries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'resolved')),
    response TEXT,
    responded_at TIMESTAMP WITH TIME ZONE
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_notices_created_at ON notices(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notices_published ON notices(is_published, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON inquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status);

-- RLS (Row Level Security) 정책 활성화
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- 공지사항 RLS 정책
-- 모든 사용자가 게시된 공지사항을 읽을 수 있음
CREATE POLICY "Anyone can read published notices" ON notices
    FOR SELECT USING (is_published = true);

-- 인증된 사용자만 공지사항을 생성/수정할 수 있음
CREATE POLICY "Authenticated users can manage notices" ON notices
    FOR ALL USING (auth.role() = 'authenticated');

-- 문의사항 RLS 정책  
-- 문의사항 작성은 누구나 가능
CREATE POLICY "Anyone can create inquiries" ON inquiries
    FOR INSERT WITH CHECK (true);

-- 문의사항 조회/수정은 관리자만 가능
CREATE POLICY "Authenticated users can read inquiries" ON inquiries
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update inquiries" ON inquiries
    FOR UPDATE USING (auth.role() = 'authenticated');

-- 업데이트 시간 자동 갱신을 위한 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 공지사항 테이블에 업데이트 트리거 추가
CREATE TRIGGER update_notices_updated_at BEFORE UPDATE ON notices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 