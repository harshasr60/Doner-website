-- WOMBTO18 NGO Platform - PostgreSQL Database Schema
-- Run this script to create all required tables
-- Version: 1.0
-- Date: February 2026

-- ============================================
-- DROP EXISTING TABLES (if recreating)
-- ============================================
-- Uncomment the following lines if you want to drop existing tables
-- WARNING: This will delete all data!

-- DROP TABLE IF EXISTS email_logs CASCADE;
-- DROP TABLE IF EXISTS progress_reports CASCADE;
-- DROP TABLE IF EXISTS donations CASCADE;
-- DROP TABLE IF EXISTS impact_reports CASCADE;
-- DROP TABLE IF EXISTS press_releases CASCADE;
-- DROP TABLE IF EXISTS blog_posts CASCADE;
-- DROP TABLE IF EXISTS programs CASCADE;
-- DROP TABLE IF EXISTS donors CASCADE;

-- ============================================
-- 1. DONORS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS donors (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    mobile VARCHAR(20) NOT NULL,
    pan_number VARCHAR(10),
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for donors
CREATE INDEX IF NOT EXISTS idx_donors_email ON donors(email);
CREATE INDEX IF NOT EXISTS idx_donors_mobile ON donors(mobile);
CREATE INDEX IF NOT EXISTS idx_donors_public ON donors(is_public);

-- Comments
COMMENT ON TABLE donors IS 'Stores donor information with privacy preferences';
COMMENT ON COLUMN donors.is_public IS 'Whether donor name appears on public donor wall';
COMMENT ON COLUMN donors.pan_number IS 'Required for 80G tax exemption certificate';

-- ============================================
-- 2. PROGRAMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS programs (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    target_amount DECIMAL(12, 2) NOT NULL,
    raised_amount DECIMAL(12, 2) DEFAULT 0,
    utilized_amount DECIMAL(12, 2) DEFAULT 0,
    start_date DATE NOT NULL,
    end_date DATE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'upcoming')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for programs
CREATE INDEX IF NOT EXISTS idx_programs_status ON programs(status);
CREATE INDEX IF NOT EXISTS idx_programs_category ON programs(category);
CREATE INDEX IF NOT EXISTS idx_programs_dates ON programs(start_date, end_date);

-- Comments
COMMENT ON TABLE programs IS 'NGO programs and initiatives';
COMMENT ON COLUMN programs.raised_amount IS 'Total amount raised from donations';
COMMENT ON COLUMN programs.utilized_amount IS 'Amount actually spent on the program';
COMMENT ON COLUMN programs.status IS 'active, completed, or upcoming';

-- ============================================
-- 3. DONATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS donations (
    id VARCHAR(50) PRIMARY KEY,
    donor_id VARCHAR(50) NOT NULL REFERENCES donors(id) ON DELETE CASCADE,
    program_id VARCHAR(50) NOT NULL REFERENCES programs(id) ON DELETE RESTRICT,
    amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
    currency VARCHAR(3) DEFAULT 'INR',
    razorpay_order_id VARCHAR(100) UNIQUE,
    razorpay_payment_id VARCHAR(100) UNIQUE,
    razorpay_signature VARCHAR(255),
    transaction_id VARCHAR(100) UNIQUE NOT NULL,
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'success', 'failed', 'refunded')),
    payment_method VARCHAR(50),
    donation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    certificate_80g_url VARCHAR(500),
    certificate_12a_url VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for donations
CREATE INDEX IF NOT EXISTS idx_donations_donor ON donations(donor_id);
CREATE INDEX IF NOT EXISTS idx_donations_program ON donations(program_id);
CREATE INDEX IF NOT EXISTS idx_donations_status ON donations(payment_status);
CREATE INDEX IF NOT EXISTS idx_donations_date ON donations(donation_date);
CREATE INDEX IF NOT EXISTS idx_donations_active ON donations(is_active);
CREATE INDEX IF NOT EXISTS idx_donations_razorpay_order ON donations(razorpay_order_id);
CREATE INDEX IF NOT EXISTS idx_donations_razorpay_payment ON donations(razorpay_payment_id);

-- Comments
COMMENT ON TABLE donations IS 'All donation transactions';
COMMENT ON COLUMN donations.is_active IS 'False when program is completed (stops progress reports)';
COMMENT ON COLUMN donations.razorpay_order_id IS 'Order ID from Razorpay';
COMMENT ON COLUMN donations.razorpay_payment_id IS 'Payment ID from Razorpay after successful payment';
COMMENT ON COLUMN donations.razorpay_signature IS 'Signature for payment verification';

-- ============================================
-- 4. PROGRESS REPORTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS progress_reports (
    id VARCHAR(50) PRIMARY KEY,
    donation_id VARCHAR(50) NOT NULL REFERENCES donations(id) ON DELETE CASCADE,
    program_id VARCHAR(50) NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
    report_date DATE NOT NULL,
    content TEXT NOT NULL,
    images_json TEXT,
    sent_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for progress reports
CREATE INDEX IF NOT EXISTS idx_reports_donation ON progress_reports(donation_id);
CREATE INDEX IF NOT EXISTS idx_reports_program ON progress_reports(program_id);
CREATE INDEX IF NOT EXISTS idx_reports_sent ON progress_reports(sent_at);
CREATE INDEX IF NOT EXISTS idx_reports_date ON progress_reports(report_date);

-- Comments
COMMENT ON TABLE progress_reports IS 'Progress reports sent to donors every 7 days';
COMMENT ON COLUMN progress_reports.images_json IS 'JSON array of image URLs showing program progress';
COMMENT ON COLUMN progress_reports.sent_at IS 'NULL if not yet sent, timestamp when sent';

-- ============================================
-- 5. IMPACT REPORTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS impact_reports (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    quarter VARCHAR(2) NOT NULL CHECK (quarter IN ('Q1', 'Q2', 'Q3', 'Q4')),
    year INTEGER NOT NULL,
    programs_count INTEGER,
    beneficiaries INTEGER,
    funds_utilized DECIMAL(12, 2),
    report_url VARCHAR(500),
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for impact reports
CREATE INDEX IF NOT EXISTS idx_impact_reports_year_quarter ON impact_reports(year, quarter);

-- Comments
COMMENT ON TABLE impact_reports IS 'Quarterly impact reports published publicly';
COMMENT ON COLUMN impact_reports.report_url IS 'URL to downloadable PDF report';

-- ============================================
-- 6. BLOG POSTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS blog_posts (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    author VARCHAR(100),
    category VARCHAR(100),
    image_url VARCHAR(500),
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for blog posts
CREATE INDEX IF NOT EXISTS idx_blog_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_published ON blog_posts(published_at);

-- Comments
COMMENT ON TABLE blog_posts IS 'Blog articles and stories';

-- ============================================
-- 7. PRESS RELEASES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS press_releases (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    excerpt TEXT,
    source VARCHAR(100),
    external_link VARCHAR(500),
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for press releases
CREATE INDEX IF NOT EXISTS idx_press_published ON press_releases(published_at);

-- Comments
COMMENT ON TABLE press_releases IS 'Media coverage and press releases';

-- ============================================
-- 8. EMAIL LOGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS email_logs (
    id VARCHAR(50) PRIMARY KEY,
    donor_id VARCHAR(50) REFERENCES donors(id) ON DELETE SET NULL,
    email_type VARCHAR(50) NOT NULL,
    subject VARCHAR(255),
    recipient_email VARCHAR(255) NOT NULL,
    sent_at TIMESTAMP,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'bounced')),
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for email logs
CREATE INDEX IF NOT EXISTS idx_email_donor ON email_logs(donor_id);
CREATE INDEX IF NOT EXISTS idx_email_type ON email_logs(email_type);
CREATE INDEX IF NOT EXISTS idx_email_status ON email_logs(status);
CREATE INDEX IF NOT EXISTS idx_email_sent ON email_logs(sent_at);

-- Comments
COMMENT ON TABLE email_logs IS 'Logs all emails sent by the system';
COMMENT ON COLUMN email_logs.email_type IS 'confirmation, progress_report, final_report, etc.';

-- ============================================
-- TRIGGERS FOR AUTO-UPDATE TIMESTAMPS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for donors table
CREATE TRIGGER update_donors_updated_at BEFORE UPDATE ON donors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for programs table
CREATE TRIGGER update_programs_updated_at BEFORE UPDATE ON programs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for blog_posts table
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- USEFUL VIEWS
-- ============================================

-- View: Active Donations (for progress reports)
CREATE OR REPLACE VIEW active_donations AS
SELECT 
    d.id,
    d.donor_id,
    d.program_id,
    d.amount,
    d.donation_date,
    don.name as donor_name,
    don.email as donor_email,
    p.name as program_name,
    p.status as program_status
FROM donations d
JOIN donors don ON d.donor_id = don.id
JOIN programs p ON d.program_id = p.id
WHERE d.payment_status = 'success' 
  AND d.is_active = true;

-- View: Donor Wall (public donors only)
CREATE OR REPLACE VIEW donor_wall AS
SELECT 
    d.id,
    d.donor_id,
    don.name as donor_name,
    don.is_public,
    d.amount,
    d.donation_date,
    p.name as program_name
FROM donations d
JOIN donors don ON d.donor_id = don.id
JOIN programs p ON d.program_id = p.id
WHERE d.payment_status = 'success'
  AND don.is_public = true
ORDER BY d.amount DESC;

-- View: Transparency Summary
CREATE OR REPLACE VIEW transparency_summary AS
SELECT 
    p.id,
    p.name,
    p.category,
    p.target_amount,
    p.raised_amount,
    p.utilized_amount,
    p.status,
    (p.utilized_amount / NULLIF(p.raised_amount, 0) * 100) as utilization_percentage,
    COUNT(DISTINCT d.id) as donation_count
FROM programs p
LEFT JOIN donations d ON p.id = d.program_id AND d.payment_status = 'success'
GROUP BY p.id;

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to get next 7-day report date
CREATE OR REPLACE FUNCTION get_next_report_date(donation_date TIMESTAMP)
RETURNS DATE AS $$
BEGIN
    RETURN (donation_date + INTERVAL '7 days')::DATE;
END;
$$ LANGUAGE plpgsql;

-- Function to check if donation is due for report
CREATE OR REPLACE FUNCTION is_due_for_report(donation_date TIMESTAMP)
RETURNS BOOLEAN AS $$
DECLARE
    days_since_donation INTEGER;
BEGIN
    days_since_donation := EXTRACT(DAY FROM (CURRENT_TIMESTAMP - donation_date));
    RETURN (days_since_donation % 7 = 0 AND days_since_donation > 0);
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- SEED DATA (Optional - for testing)
-- ============================================

-- Insert sample programs
INSERT INTO programs (id, name, description, category, target_amount, raised_amount, utilized_amount, start_date, status)
VALUES 
    ('PROG001', 'Education for All', 'Providing quality education to 500 underprivileged children', 'Education', 5000000, 0, 0, '2025-06-01', 'active'),
    ('PROG002', 'Healthcare Initiative', 'Mobile medical camps in 50 villages', 'Healthcare', 3000000, 0, 0, '2025-08-01', 'active'),
    ('PROG003', 'Women Skill Development', 'Vocational training for 200 women', 'Women Empowerment', 2000000, 0, 0, '2025-09-01', 'active')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Run these queries to verify the schema was created correctly

-- List all tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- List all indexes
SELECT 
    tablename, 
    indexname 
FROM pg_indexes 
WHERE schemaname = 'public' 
ORDER BY tablename, indexname;

-- Count rows in each table
SELECT 
    'donors' as table_name, COUNT(*) as row_count FROM donors
UNION ALL
SELECT 'programs', COUNT(*) FROM programs
UNION ALL
SELECT 'donations', COUNT(*) FROM donations
UNION ALL
SELECT 'progress_reports', COUNT(*) FROM progress_reports
UNION ALL
SELECT 'impact_reports', COUNT(*) FROM impact_reports
UNION ALL
SELECT 'blog_posts', COUNT(*) FROM blog_posts
UNION ALL
SELECT 'press_releases', COUNT(*) FROM press_releases
UNION ALL
SELECT 'email_logs', COUNT(*) FROM email_logs;

-- ============================================
-- GRANT PERMISSIONS (Optional)
-- ============================================
-- Uncomment and modify if you have specific database users

-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO wombto18_app;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO wombto18_app;

-- ============================================
-- NOTES
-- ============================================
-- 1. This schema uses VARCHAR(50) for IDs to support custom ID formats (e.g., DON001, PROG001)
-- 2. All monetary values use DECIMAL(12,2) for precision
-- 3. Indexes are created on frequently queried columns
-- 4. Foreign keys use appropriate ON DELETE actions (CASCADE or RESTRICT)
-- 5. Check constraints ensure data integrity
-- 6. Triggers automatically update 'updated_at' columns
-- 7. Views simplify common queries
-- 8. Helper functions assist with business logic

-- ============================================
-- MAINTENANCE QUERIES
-- ============================================

-- Vacuum and analyze tables (run periodically)
-- VACUUM ANALYZE;

-- Reindex all tables (if performance degrades)
-- REINDEX DATABASE wombto18_db;

-- Check table sizes
-- SELECT 
--     tablename,
--     pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
-- FROM pg_tables
-- WHERE schemaname = 'public'
-- ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- ============================================
-- END OF SCHEMA
-- ============================================

-- Schema Version: 1.0
-- Last Updated: February 2026
-- Created for: WOMBTO18 NGO Platform
