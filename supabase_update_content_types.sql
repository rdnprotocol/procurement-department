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
  'meetings-schedule',

  -- Бодлогын баримт бичиг (new)
  'policy-intro',
  'policy-documents',
  'policy-rules',

  -- Стратеги төлөвлөгөө (new)
  'strategy-intro',
  'strategy-goals',
  'strategy-plan',

  -- Төлөвлөгөө тайлан (new)
  'plan-intro',
  'plan-annual',
  'plan-report',

  -- Статистик мэдээ (new)
  'stats-intro',
  'stats-procurement',
  'stats-annual',

  -- Тендер (new)
  'tender-plan',
  'tender-a3',
  'tender-zovlomj',

  -- Сумд (new) - plans + tender result
  'province-altanbulag-plans', 'province-altanbulag-tender',
  'province-argalant-plans', 'province-argalant-tender',
  'province-arkhust-plans', 'province-arkhust-tender',
  'province-batsumber-plans', 'province-batsumber-tender',
  'province-bayan-plans', 'province-bayan-tender',
  'province-bayandelger-plans', 'province-bayandelger-tender',
  'province-bayanjargalan-plans', 'province-bayanjargalan-tender',
  'province-bayan-unjul-plans', 'province-bayan-unjul-tender',
  'province-bayankhangai-plans', 'province-bayankhangai-tender',
  'province-bayantsagaan-plans', 'province-bayantsagaan-tender',
  'province-bayantsogt-plans', 'province-bayantsogt-tender',
  'province-bayanchandmani-plans', 'province-bayanchandmani-tender',
  'province-bornuur-plans', 'province-bornuur-tender',
  'province-buren-plans', 'province-buren-tender',
  'province-delgerkhaan-plans', 'province-delgerkhaan-tender',
  'province-jargalant-plans', 'province-jargalant-tender',
  'province-zaamar-plans', 'province-zaamar-tender',
  'province-zuunmod-plans', 'province-zuunmod-tender',
  'province-lun-plans', 'province-lun-tender',
  'province-mungunmorit-plans', 'province-mungunmorit-tender',
  'province-undurshireet-plans', 'province-undurshireet-tender',
  'province-sumber-plans', 'province-sumber-tender',
  'province-sergelen-plans', 'province-sergelen-tender',
  'province-ugtaaltsaidam-plans', 'province-ugtaaltsaidam-tender',
  'province-tseel-plans', 'province-tseel-tender',
  'province-erdene-plans', 'province-erdene-tender',
  'province-erdenesant-plans', 'province-erdenesant-tender'
));

-- Verify the constraint was added
SELECT conname, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conname = 'static_contents_type_check';

