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
  'stats-intro', 'stats-procurement', 'stats-annual',

  -- Тендер
  'tender-plan', 'tender-a3', 'tender-zovlomj',

  -- Сумд (plans + tender result)
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
