-- 샘플 데이터 삽입 스크립트
-- 실제 Supabase 프로젝트 생성 후 실행

-- 샘플 공지사항 데이터
INSERT INTO notices (title, content, is_published) VALUES
('GanziCorp 홈페이지 오픈 안내', '안녕하세요! GanziCorp 공식 홈페이지가 새롭게 오픈되었습니다. 앞으로 다양한 소식과 정보를 이곳에서 만나보실 수 있습니다.', true),
('시스템 점검 안내', '서비스 품질 향상을 위해 2025년 1월 20일 오전 2시부터 4시까지 시스템 점검을 실시합니다. 점검 시간 동안 일시적으로 서비스 이용이 제한될 수 있습니다.', true),
('새로운 기능 업데이트', '사용자 편의성 개선을 위한 새로운 기능들이 추가되었습니다. 자세한 내용은 업데이트 노트를 확인해주세요.', false);

-- 샘플 문의사항 데이터 (테스트용)
INSERT INTO inquiries (name, email, subject, message, status) VALUES
('김철수', 'chulsoo@example.com', '서비스 문의', '안녕하세요. 귀하의 서비스에 대해 자세히 알고 싶습니다. 연락 부탁드립니다.', 'pending'),
('박영희', 'younghee@example.com', '기술 지원 요청', '웹사이트 이용 중 오류가 발생했습니다. 도움이 필요합니다.', 'in_progress'),
('이민수', 'minsu@example.com', '제휴 문의', '비즈니스 제휴에 관심이 있습니다. 담당자와 미팅을 요청드립니다.', 'resolved'); 