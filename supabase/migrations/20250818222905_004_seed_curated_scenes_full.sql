-- HOME (4)

insert into public.curated_scenes (id, setting, obstacle, options, expected_valences, intents)
select gen_random_uuid(),'home',
'Your sibling is building a puzzle and asks you to join.',
'[{"id":"opt1","text":"Join for ten minutes","intent_tags":["connection"],"expected_valence":"positive"},
  {"id":"opt2","text":"Say you are too busy","intent_tags":["self_control"],"expected_valence":"neutral"}]'::jsonb,
'["positive","neutral"]'::jsonb,'["connection"]'::jsonb
where not exists (select 1 from public.curated_scenes where obstacle='Your sibling is building a puzzle and asks you to join.');

insert into public.curated_scenes (id, setting, obstacle, options, expected_valences, intents)
select gen_random_uuid(),'home',
'You notice dishes in the sink after snack time.',
'[{"id":"opt1","text":"Wash and dry them now","intent_tags":["responsibility"],"expected_valence":"positive"},
  {"id":"opt2","text":"Leave them for later","intent_tags":["responsibility"],"expected_valence":"negative"}]'::jsonb,
'["positive","negative"]','["responsibility"]'
where not exists (select 1 from public.curated_scenes where obstacle='You notice dishes in the sink after snack time.');

insert into public.curated_scenes (id, setting, obstacle, options, expected_valences, intents)
select gen_random_uuid(),'home',
'Your parent reminds you about reading time before bed.',
'[{"id":"opt1","text":"Read quietly for twenty minutes","intent_tags":["self_control"],"expected_valence":"positive"},
  {"id":"opt2","text":"Scroll on a device instead","intent_tags":["self_control"],"expected_valence":"negative"}]'::jsonb,
'["positive","negative"]','["self_control"]'
where not exists (select 1 from public.curated_scenes where obstacle='Your parent reminds you about reading time before bed.');

insert into public.curated_scenes (id, setting, obstacle, options, expected_valences, intents)
select gen_random_uuid(),'home',
'A board game is missing pieces after friends leave.',
'[{"id":"opt1","text":"Look for pieces and tidy up","intent_tags":["responsibility"],"expected_valence":"positive"},
  {"id":"opt2","text":"Say it was not your game","intent_tags":["honesty"],"expected_valence":"negative"}]'::jsonb,
'["positive","negative"]','["responsibility","honesty"]'
where not exists (select 1 from public.curated_scenes where obstacle='A board game is missing pieces after friends leave.');

-- SCHOOL (4)

insert into public.curated_scenes (id, setting, obstacle, options, expected_valences, intents)
select gen_random_uuid(),'school',
'You see someone drop pencils in the hallway.',
'[{"id":"opt1","text":"Help pick them up","intent_tags":["empathy"],"expected_valence":"positive"},
  {"id":"opt2","text":"Walk past quickly","intent_tags":["self_control"],"expected_valence":"negative"}]'::jsonb,
'["positive","negative"]','["empathy"]'
where not exists (select 1 from public.curated_scenes where obstacle='You see someone drop pencils in the hallway.');

insert into public.curated_scenes (id, setting, obstacle, options, expected_valences, intents)
select gen_random_uuid(),'school',
'Group work starts and roles are unassigned.',
'[{"id":"opt1","text":"Offer to keep notes","intent_tags":["responsibility"],"expected_valence":"positive"},
  {"id":"opt2","text":"Let others do everything","intent_tags":["responsibility"],"expected_valence":"negative"}]'::jsonb,
'["positive","negative"]','["responsibility"]'
where not exists (select 1 from public.curated_scenes where obstacle='Group work starts and roles are unassigned.');

insert into public.curated_scenes (id, setting, obstacle, options, expected_valences, intents)
select gen_random_uuid(),'school',
'Quiz directions say “no talking” and your friend whispers.',
'[{"id":"opt1","text":"Point to the rule quietly","intent_tags":["honesty"],"expected_valence":"positive"},
  {"id":"opt2","text":"Whisper back anyway","intent_tags":["self_control"],"expected_valence":"negative"}]'::jsonb,
'["positive","negative"]','["honesty","self_control"]'
where not exists (select 1 from public.curated_scenes where obstacle='Quiz directions say “no talking” and your friend whispers.');

insert into public.curated_scenes (id, setting, obstacle, options, expected_valences, intents)
select gen_random_uuid(),'school',
'You forgot a pencil and the teacher is starting.',
'[{"id":"opt1","text":"Ask politely to borrow one","intent_tags":["honesty"],"expected_valence":"neutral"},
  {"id":"opt2","text":"Wait and do nothing","intent_tags":["responsibility"],"expected_valence":"negative"}]'::jsonb,
'["neutral","negative"]','["honesty","responsibility"]'
where not exists (select 1 from public.curated_scenes where obstacle='You forgot a pencil and the teacher is starting.');

-- PLAYGROUND (4)

insert into public.curated_scenes (id, setting, obstacle, options, expected_valences, intents)
select gen_random_uuid(),'playground',
'A younger kid asks to join your soccer game.',
'[{"id":"opt1","text":"Include them and explain rules","intent_tags":["empathy","connection"],"expected_valence":"positive"},
  {"id":"opt2","text":"Say it is only for older kids","intent_tags":["empathy"],"expected_valence":"negative"}]'::jsonb,
'["positive","negative"]','["empathy","connection"]'
where not exists (select 1 from public.curated_scenes where obstacle='A younger kid asks to join your soccer game.');

insert into public.curated_scenes (id, setting, obstacle, options, expected_valences, intents)
select gen_random_uuid(),'playground',
'Two friends want the same swing and argue.',
'[{"id":"opt1","text":"Suggest taking turns with a timer","intent_tags":["empathy"],"expected_valence":"positive"},
  {"id":"opt2","text":"Grab the swing first","intent_tags":["self_control"],"expected_valence":"negative"}]'::jsonb,
'["positive","negative"]','["empathy","self_control"]'
where not exists (select 1 from public.curated_scenes where obstacle='Two friends want the same swing and argue.');

insert into public.curated_scenes (id, setting, obstacle, options, expected_valences, intents)
select gen_random_uuid(),'playground',
'Your ball accidentally hits a bush and gets dirty.',
'[{"id":"opt1","text":"Clean it and apologize","intent_tags":["responsibility"],"expected_valence":"positive"},
  {"id":"opt2","text":"Pretend it was not you","intent_tags":["honesty"],"expected_valence":"negative"}]'::jsonb,
'["positive","negative"]','["responsibility","honesty"]'
where not exists (select 1 from public.curated_scenes where obstacle='Your ball accidentally hits a bush and gets dirty.');

insert into public.curated_scenes (id, setting, obstacle, options, expected_valences, intents)
select gen_random_uuid(),'playground',
'It starts drizzling during tag and ground is slippery.',
'[{"id":"opt1","text":"Switch to a safer game","intent_tags":["self_control"],"expected_valence":"positive"},
  {"id":"opt2","text":"Keep sprinting fast","intent_tags":["self_control"],"expected_valence":"negative"}]'::jsonb,
'["positive","negative"]','["self_control"]'
where not exists (select 1 from public.curated_scenes where obstacle='It starts drizzling during tag and ground is slippery.');

-- STORE (4)

insert into public.curated_scenes (id, setting, obstacle, options, expected_valences, intents)
select gen_random_uuid(),'store',
'You promised to compare prices before choosing a snack.',
'[{"id":"opt1","text":"Check labels and pick fairly","intent_tags":["responsibility"],"expected_valence":"positive"},
  {"id":"opt2","text":"Grab the flashiest candy","intent_tags":["self_control"],"expected_valence":"negative"}]'::jsonb,
'["positive","negative"]','["responsibility","self_control"]'
where not exists (select 1 from public.curated_scenes where obstacle='You promised to compare prices before choosing a snack.');

insert into public.curated_scenes (id, setting, obstacle, options, expected_valences, intents)
select gen_random_uuid(),'store',
'You bump a shelf and a box shifts near the edge.',
'[{"id":"opt1","text":"Steady it and tell staff","intent_tags":["honesty"],"expected_valence":"positive"},
  {"id":"opt2","text":"Walk away quickly","intent_tags":["responsibility"],"expected_valence":"negative"}]'::jsonb,
'["positive","negative"]','["honesty","responsibility"]'
where not exists (select 1 from public.curated_scenes where obstacle='You bump a shelf and a box shifts near the edge.');

insert into public.curated_scenes (id, setting, obstacle, options, expected_valences, intents)
select gen_random_uuid(),'store',
'Parent says one treat only; you spot two favorites.',
'[{"id":"opt1","text":"Choose one and put back the other","intent_tags":["self_control"],"expected_valence":"positive"},
  {"id":"opt2","text":"Hide the second in the cart","intent_tags":["honesty"],"expected_valence":"negative"}]'::jsonb,
'["positive","negative"]','["self_control","honesty"]'
where not exists (select 1 from public.curated_scenes where obstacle='Parent says one treat only; you spot two favorites.');

insert into public.curated_scenes (id, setting, obstacle, options, expected_valences, intents)
select gen_random_uuid(),'store',
'A cashier shortens a long line by opening a new register.',
'[{"id":"opt1","text":"Wait your turn calmly","intent_tags":["self_control"],"expected_valence":"positive"},
  {"id":"opt2","text":"Cut in front fast","intent_tags":["honesty"],"expected_valence":"negative"}]'::jsonb,
'["positive","negative"]','["self_control","honesty"]'
where not exists (select 1 from public.curated_scenes where obstacle='A cashier shortens a long line by opening a new register.');

-- FRIENDS_HOUSE (4)

insert into public.curated_scenes (id, setting, obstacle, options, expected_valences, intents)
select gen_random_uuid(),'friends_house',
'Your friend’s parent asks you both to tidy up toys.',
'[{"id":"opt1","text":"Clean together quickly","intent_tags":["responsibility"],"expected_valence":"positive"},
  {"id":"opt2","text":"Say you did not play with those","intent_tags":["honesty"],"expected_valence":"negative"}]'::jsonb,
'["positive","negative"]','["responsibility","honesty"]'
where not exists (select 1 from public.curated_scenes where obstacle='Your friend’s parent asks you both to tidy up toys.');

insert into public.curated_scenes (id, setting, obstacle, options, expected_valences, intents)
select gen_random_uuid(),'friends_house',
'A new game has tricky rules you do not know.',
'[{"id":"opt1","text":"Ask for a quick demo","intent_tags":["honesty"],"expected_valence":"positive"},
  {"id":"opt2","text":"Guess and get frustrated","intent_tags":["self_control"],"expected_valence":"negative"}]'::jsonb,
'["positive","negative"]','["honesty","self_control"]'
where not exists (select 1 from public.curated_scenes where obstacle='A new game has tricky rules you do not know.');

insert into public.curated_scenes (id, setting, obstacle, options, expected_valences, intents)
select gen_random_uuid(),'friends_house',
'You notice a water cup near electronics on a desk.',
'[{"id":"opt1","text":"Move it and mention the risk","intent_tags":["responsibility"],"expected_valence":"positive"},
  {"id":"opt2","text":"Ignore it","intent_tags":["responsibility"],"expected_valence":"negative"}]'::jsonb,
'["positive","negative"]','["responsibility"]'
where not exists (select 1 from public.curated_scenes where obstacle='You notice a water cup near electronics on a desk.');

insert into public.curated_scenes (id, setting, obstacle, options, expected_valences, intents)
select gen_random_uuid(),'friends_house',
'Your friend wants to swap snacks without telling their parent.',
'[{"id":"opt1","text":"Ask permission first","intent_tags":["honesty"],"expected_valence":"positive"},
  {"id":"opt2","text":"Trade secretly","intent_tags":["honesty"],"expected_valence":"negative"}]'::jsonb,
'["positive","negative"]','["honesty"]'
where not exists (select 1 from public.curated_scenes where obstacle='Your friend wants to swap snacks without telling their parent.');