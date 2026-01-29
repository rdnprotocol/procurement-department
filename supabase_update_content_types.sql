-- ===========================================
-- RUN THIS IN SUPABASE SQL EDITOR
-- ===========================================
-- This script updates the static_contents table 
-- to allow new content types for transparency pages
-- ===========================================

-- Step 1: Drop the existing constraint
ALTER TABLE static_contents DROP CONSTRAINT IF EXISTS static_contents_type_check;

-- Step 2: Add new constraint with all content types
ALTER TABLE static_contents ADD CONSTRAINT static_contents_type_check 
CHECK (type IN (
  -- Бидний тухай (existing)
  'mission', 
  'vision', 
  'goal', 
  'history', 
  'structure',
  'intro',
  
  -- Хүний нөөц (new)
  'hr-intro',
  'hr-plan',
  'hr-report',
  'hr-stats',
  
  -- Хяналт шалгалт (new)
  'monitoring-intro',
  'monitoring-internal',
  'monitoring-government',
  'monitoring-client',
  
  -- Ёс зүйн дэд хороо (new)
  'ethics-intro',
  'ethics-activity',
  'ethics-members',
  
  -- Өргөдөл гомдол (new)
  'complaints-intro',
  'complaints-report',
  
  -- Иргэд хүлээн авах (new)
  'meetings-intro',
  'meetings-schedule'
));

-- Verify the constraint was added
SELECT conname, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conname = 'static_contents_type_check';

