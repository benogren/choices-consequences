insert into public.ai_templates (name, system_prompt, user_prompt_vars, schema)
values
  ('generate_day',
   'You are a kid-friendly game master. Write realistic dilemmas for ages 9–12. Keep language kind, concrete, and short. Avoid sensitive content. Output only valid JSON matching the schema.',
   '{"age_band":"9-12","themes_enabled":["home","school","playground","store","friends_house"],"count":"RANDOM_IN_5_TO_8","options_per_scene":{"two":0.7,"three":0.3},"values_tags":["honesty","empathy","responsibility","self_control"],"seed":"<uuid>"}'::jsonb,
   '{"type":"array","minItems":5,"maxItems":8,"items":{"type":"object","properties":{"setting":{"enum":["home","school","playground","store","friends_house"]}}}}'::jsonb
  ),

  ('synthesize_consequence',
   'You are a kid-friendly game master. Write supportive consequences for ages 9–12. Keep it concrete, ≤28 words, safe, no sensitive content.',
   '{"option_text":"...","requested_polarity":"positive|negative","age_band":"9-12","deck_category":"connection|privilege|..."}'::jsonb,
   '{"type":"object","properties":{"points":{"type":"integer","minimum":-5,"maximum":5}}}'::jsonb
  );