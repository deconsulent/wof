-- ====================================================================
-- RTU Wall of Fame - Bilingual Schema Migration (English & Latvian)
-- ====================================================================

-- 1. Add dedicated Latvian columns to the 'locations' table
ALTER TABLE locations 
ADD COLUMN IF NOT EXISTS title_lv TEXT,
ADD COLUMN IF NOT EXISTS subtitle_lv TEXT,
ADD COLUMN IF NOT EXISTS description_lv TEXT;

-- 2. Ensure Row Level Security (RLS) policies permit reading and writing
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'locations' AND policyname = 'Allow anon select') THEN
        CREATE POLICY "Allow anon select" ON locations FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'locations' AND policyname = 'Allow anon insert') THEN
        CREATE POLICY "Allow anon insert" ON locations FOR INSERT WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'locations' AND policyname = 'Allow anon update') THEN
        CREATE POLICY "Allow anon update" ON locations FOR UPDATE USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'locations' AND policyname = 'Allow anon delete') THEN
        CREATE POLICY "Allow anon delete" ON locations FOR DELETE USING (true);
    END IF;
END $$;

-- ====================================================================
-- 3. Nested JSONB Schema Specification for 'data' column:
--
-- For 'designfactory' template (Inductees / Hierarchy Tree):
-- data.inductees[i] = {
--   id: string,
--   name: string,
--   role: string,
--   role_lv: string,
--   level: 'root' | 'lead' | 'staff',
--   superpower: string,
--   superpower_lv: string,
--   current_project: string,
--   current_project_lv: string,
--   skills: string[] | string,
--   skills_lv: string[] | string,
--   certifications: string[] | string,
--   certifications_lv: string[] | string,
--   accent: string,
--   crop: string,
--   photo: string
-- }
--
-- For 'swup' template (Team Profile Projection):
-- data = {
--   teamName: string,
--   teamName_lv: string,
--   teamDestination: string,
--   teamDestination_lv: string,
--   teamPhoto: string,
--   members: [
--     {
--       name: string,
--       role: string,
--       role_lv: string,
--       specialty: string,
--       specialty_lv: string,
--       project: string,
--       project_lv: string,
--       skills: string[] | string,
--       skills_lv: string[] | string,
--       accent: string,
--       crop: string,
--       photo: string
--     }
--   ]
-- }
-- ====================================================================
