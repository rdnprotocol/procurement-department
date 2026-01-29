-- Add new content types for transparency pages
-- This migration updates the check constraint to allow new static content types

-- First, drop the existing constraint
ALTER TABLE static_contents DROP CONSTRAINT IF EXISTS static_contents_type_check;

-- Add new constraint with all content types
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

