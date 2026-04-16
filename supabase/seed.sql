insert into public.membership_plans
  (code, name, monthly_price, annual_price, included_visits, unlimited_visits, max_related_tasks, max_labor_minutes, materials_allowance, scheduling_priority, out_of_scope_discount_percent, fair_use_notes, status)
values
  ('silver', 'Silver', 24.99, 249.99, 2, false, 3, 90, 0, 1, 5, null, 'active'),
  ('gold', 'Gold', 49.99, 499.99, 5, false, 3, 90, 0, 2, 10, null, 'active'),
  ('platinum', 'Platinum', 99.99, 999.99, null, true, 3, 90, 40, 3, 15, 'Unlimited covered visits does not mean unlimited labor, project size, materials, turnover work, or excluded root-cause repeats.', 'active');

insert into public.settings (key, value)
values
  ('service_rules', '{
    "one_registered_property_per_membership": true,
    "response_sla_hours": 24,
    "covered_visit_target_business_days": "1-3",
    "schedule_depends_on_availability": true,
    "excluded_work_quote_or_decline": true
  }'::jsonb);
