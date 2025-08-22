-- At least 4 per setting, here are a handful to get started

insert into public.curated_scenes (id, setting, obstacle, options, expected_valences, intents)
values
  (gen_random_uuid(),'home',
   'Your sibling asks for help carrying books.',
   '[{"id":"opt1","text":"Help carry them","intent_tags":["empathy"],"expected_valence":"positive"},
     {"id":"opt2","text":"Ignore them","intent_tags":["self_control"],"expected_valence":"negative"}]'::jsonb,
   '["positive","negative"]','["empathy"]'),

  (gen_random_uuid(),'school',
   'Teacher asks a question you know the answer to.',
   '[{"id":"opt1","text":"Raise your hand","intent_tags":["responsibility"],"expected_valence":"positive"},
     {"id":"opt2","text":"Stay quiet","intent_tags":["self_control"],"expected_valence":"neutral"}]'::jsonb,
   '["positive","neutral"]','["responsibility"]'),

  (gen_random_uuid(),'playground',
   'A ball rolls near you while others wait.',
   '[{"id":"opt1","text":"Kick it back","intent_tags":["empathy"],"expected_valence":"positive"},
     {"id":"opt2","text":"Keep it","intent_tags":["self_control"],"expected_valence":"negative"}]'::jsonb,
   '["positive","negative"]','["empathy"]'),

  (gen_random_uuid(),'store',
   'You see candy near the checkout line.',
   '[{"id":"opt1","text":"Ask politely if you can have some","intent_tags":["honesty"],"expected_valence":"neutral"},
     {"id":"opt2","text":"Sneak it into the cart","intent_tags":["honesty"],"expected_valence":"negative"}]'::jsonb,
   '["neutral","negative"]','["honesty"]'),

  (gen_random_uuid(),'friends_house',
   'Your friend suggests playing a game you both like.',
   '[{"id":"opt1","text":"Say yes","intent_tags":["connection"],"expected_valence":"positive"},
     {"id":"opt2","text":"Say no and pout","intent_tags":["self_control"],"expected_valence":"negative"}]'::jsonb,
   '["positive","negative"]','["connection"]');