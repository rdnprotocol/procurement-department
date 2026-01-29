-- Add new static content types to the check constraint
-- Drop the existing constraint
ALTER TABLE static_contents DROP CONSTRAINT IF EXISTS static_contents_type_check;

-- Add new constraint with all types
ALTER TABLE static_contents ADD CONSTRAINT static_contents_type_check 
CHECK (type IN (
  -- Бидний тухай
  'mission', 'vision', 'goal', 'history', 'structure', 'intro',
  
  -- Хүний нөөц
  'hr-intro', 'hr-plan', 'hr-report', 'hr-stats',
  
  -- Хяналт шалгалт
  'monitoring-intro', 'monitoring-internal', 'monitoring-government', 'monitoring-client',
  
  -- Ёс зүйн дэд хороо
  'ethics-intro', 'ethics-activity', 'ethics-members',
  
  -- Өргөдөл гомдол
  'complaints-intro', 'complaints-report',
  
  -- Иргэд хүлээн авах
  'meetings-intro', 'meetings-schedule',
  
  -- Бодлогын баримт бичиг
  'policy-intro', 'policy-documents', 'policy-rules',
  
  -- Стратеги төлөвлөгөө
  'strategy-intro', 'strategy-goals', 'strategy-plan',
  
  -- Төлөвлөгөө тайлан
  'plan-intro', 'plan-annual', 'plan-report',
  
  -- Статистик мэдээ
  'stats-intro', 'stats-procurement', 'stats-annual'
));
