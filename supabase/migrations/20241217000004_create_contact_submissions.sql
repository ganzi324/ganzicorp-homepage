-- Contact form submissions table
CREATE TABLE contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  company VARCHAR(100),
  phone VARCHAR(20),
  subject VARCHAR(50) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'resolved', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  admin_notes TEXT
);

-- Create index for faster queries
CREATE INDEX idx_contact_submissions_created_at ON contact_submissions(created_at DESC);
CREATE INDEX idx_contact_submissions_status ON contact_submissions(status);
CREATE INDEX idx_contact_submissions_email ON contact_submissions(email);

-- RLS policies
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can create contact submissions (public form)
CREATE POLICY "Anyone can create contact submissions" ON contact_submissions
  FOR INSERT
  WITH CHECK (true);

-- Policy: Only admins can view contact submissions  
CREATE POLICY "Only admins can view contact submissions" ON contact_submissions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email = 'admin@ganzicorp.com'
    )
  );

-- Policy: Only admins can update contact submissions
CREATE POLICY "Only admins can update contact submissions" ON contact_submissions
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email = 'admin@ganzicorp.com'
    )
  );

-- Update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_contact_submissions_updated_at 
  BEFORE UPDATE ON contact_submissions 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column(); 