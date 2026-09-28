-- Development-only preview data. Never run against production.
-- Every row is draft + is_demo and cannot be published by the database constraint.
insert into public.people (name, role, group_name, sort_order, is_demo)
values
  ('DEMO — ประธานสี', 'ประธานสี', 'leadership', 1, true),
  ('DEMO — รองประธานสี 1', 'รองประธานสี', 'leadership', 2, true),
  ('DEMO — รองประธานสี 2', 'รองประธานสี', 'leadership', 3, true),
  ('DEMO — ทีมงาน 1', 'ทีมงาน', 'leadership', 4, true),
  ('DEMO — ทีมงาน 2', 'ทีมงาน', 'leadership', 5, true),
  ('DEMO — ทีมงาน 3', 'ทีมงาน', 'leadership', 6, true),
  ('DEMO — เชียร์ลีดเดอร์ 1', 'เชียร์ลีดเดอร์', 'cheerleader', 7, true),
  ('DEMO — เชียร์ลีดเดอร์ 2', 'เชียร์ลีดเดอร์', 'cheerleader', 8, true),
  ('DEMO — เชียร์ลีดเดอร์ 3', 'เชียร์ลีดเดอร์', 'cheerleader', 9, true),
  ('DEMO — นักกีฬา 1', 'นักกีฬา', 'athlete', 10, true),
  ('DEMO — นักกีฬา 2', 'นักกีฬา', 'athlete', 11, true),
  ('DEMO — นักกีฬา 3', 'นักกีฬา', 'athlete', 12, true);
