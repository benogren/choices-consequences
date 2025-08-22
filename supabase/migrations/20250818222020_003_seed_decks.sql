-- Create positive/negative decks (idempotent on title+type combo via WHERE lookups below)
insert into public.decks (id, type, title, description, default_points, rarity_weights, themes)
values
  (gen_random_uuid(), 'positive','Connection','Positive outcomes that build connection', 1, '{"common":0.6,"uncommon":0.25,"rare":0.12,"very_rare":0.03}'::jsonb, ARRAY[]::text[]),
  (gen_random_uuid(), 'negative','Consequence','Negative outcomes from choices',       -1, '{"common":0.6,"uncommon":0.25,"rare":0.12,"very_rare":0.03}'::jsonb, ARRAY[]::text[])
ON CONFLICT DO NOTHING;

-- Positive cards
insert into public.deck_cards (deck_id, title, text, points, rarity, tags)
select (select id from public.decks where title='Connection' and type='positive' limit 1),
       'Shared Snack', 'You offered a snack and made a friend.', 1, 'common'::rarity, ARRAY['connection']
ON CONFLICT (deck_id, title) DO NOTHING;

insert into public.deck_cards (deck_id, title, text, points, rarity, tags)
select (select id from public.decks where title='Connection' and type='positive' limit 1),
       'Finished Homework','You completed homework early.', 2, 'uncommon'::rarity, ARRAY['responsibility']
ON CONFLICT (deck_id, title) DO NOTHING;

insert into public.deck_cards (deck_id, title, text, points, rarity, tags)
select (select id from public.decks where title='Connection' and type='positive' limit 1),
       'Helped Clean','You helped tidy the classroom.', 2, 'uncommon'::rarity, ARRAY['responsibility']
ON CONFLICT (deck_id, title) DO NOTHING;

insert into public.deck_cards (deck_id, title, text, points, rarity, tags)
select (select id from public.decks where title='Connection' and type='positive' limit 1),
       'Won Game','You scored a winning goal.', 3, 'rare'::rarity, ARRAY['accomplishment']
ON CONFLICT (deck_id, title) DO NOTHING;

insert into public.deck_cards (deck_id, title, text, points, rarity, tags)
select (select id from public.decks where title='Connection' and type='positive' limit 1),
       'Chores Done','You finished chores without being asked.', 1, 'common'::rarity, ARRAY['responsibility']
ON CONFLICT (deck_id, title) DO NOTHING;

insert into public.deck_cards (deck_id, title, text, points, rarity, tags)
select (select id from public.decks where title='Connection' and type='positive' limit 1),
       'Invited Friend','You invited a classmate to join play.', 1, 'common'::rarity, ARRAY['connection']
ON CONFLICT (deck_id, title) DO NOTHING;

insert into public.deck_cards (deck_id, title, text, points, rarity, tags)
select (select id from public.decks where title='Connection' and type='positive' limit 1),
       'Kind Words','You encouraged a teammate.', 2, 'uncommon'::rarity, ARRAY['connection']
ON CONFLICT (deck_id, title) DO NOTHING;

insert into public.deck_cards (deck_id, title, text, points, rarity, tags)
select (select id from public.decks where title='Connection' and type='positive' limit 1),
       'Extra Credit','Teacher praised your project.', 3, 'rare'::rarity, ARRAY['accomplishment']
ON CONFLICT (deck_id, title) DO NOTHING;

insert into public.deck_cards (deck_id, title, text, points, rarity, tags)
select (select id from public.decks where title='Connection' and type='positive' limit 1),
       'Big Win','Your team won a match!', 4, 'rare'::rarity, ARRAY['accomplishment']
ON CONFLICT (deck_id, title) DO NOTHING;

insert into public.deck_cards (deck_id, title, text, points, rarity, tags)
select (select id from public.decks where title='Connection' and type='positive' limit 1),
       'Special Privilege','You chose a fun activity.', 4, 'rare'::rarity, ARRAY['privileges']
ON CONFLICT (deck_id, title) DO NOTHING;

insert into public.deck_cards (deck_id, title, text, points, rarity, tags)
select (select id from public.decks where title='Connection' and type='positive' limit 1),
       'Award','You received a medal.', 5, 'very_rare'::rarity, ARRAY['accomplishment']
ON CONFLICT (deck_id, title) DO NOTHING;

insert into public.deck_cards (deck_id, title, text, points, rarity, tags)
select (select id from public.decks where title='Connection' and type='positive' limit 1),
       'Helped Younger','You read to a younger student.', 1, 'common'::rarity, ARRAY['connection']
ON CONFLICT (deck_id, title) DO NOTHING;

-- Negative cards
insert into public.deck_cards (deck_id, title, text, points, rarity, tags)
select (select id from public.decks where title='Consequence' and type='negative' limit 1),
       'Forgot Homework','You forgot homework and lost points.', -2, 'uncommon'::rarity, ARRAY['responsibility']
ON CONFLICT (deck_id, title) DO NOTHING;

insert into public.deck_cards (deck_id, title, text, points, rarity, tags)
select (select id from public.decks where title='Consequence' and type='negative' limit 1),
       'Argued','You argued with a classmate.', -1, 'common'::rarity, ARRAY['social']
ON CONFLICT (deck_id, title) DO NOTHING;

insert into public.deck_cards (deck_id, title, text, points, rarity, tags)
select (select id from public.decks where title='Consequence' and type='negative' limit 1),
       'Mess Left','You left a mess behind.', -1, 'common'::rarity, ARRAY['chores']
ON CONFLICT (deck_id, title) DO NOTHING;

insert into public.deck_cards (deck_id, title, text, points, rarity, tags)
select (select id from public.decks where title='Consequence' and type='negative' limit 1),
       'Late Arrival','You arrived late to class.', -2, 'uncommon'::rarity, ARRAY['responsibility']
ON CONFLICT (deck_id, title) DO NOTHING;

insert into public.deck_cards (deck_id, title, text, points, rarity, tags)
select (select id from public.decks where title='Consequence' and type='negative' limit 1),
       'Lost Turn','You lost your turn in the game.', -3, 'rare'::rarity, ARRAY['privilege_loss']
ON CONFLICT (deck_id, title) DO NOTHING;

insert into public.deck_cards (deck_id, title, text, points, rarity, tags)
select (select id from public.decks where title='Consequence' and type='negative' limit 1),
       'Ignored Friend','You ignored a friend’s request.', -2, 'uncommon'::rarity, ARRAY['social']
ON CONFLICT (deck_id, title) DO NOTHING;

insert into public.deck_cards (deck_id, title, text, points, rarity, tags)
select (select id from public.decks where title='Consequence' and type='negative' limit 1),
       'Extra Chores','You must do extra chores.', -3, 'rare'::rarity, ARRAY['chores']
ON CONFLICT (deck_id, title) DO NOTHING;

insert into public.deck_cards (deck_id, title, text, points, rarity, tags)
select (select id from public.decks where title='Consequence' and type='negative' limit 1),
       'Detention','Teacher gave detention.', -4, 'rare'::rarity, ARRAY['responsibility']
ON CONFLICT (deck_id, title) DO NOTHING;

insert into public.deck_cards (deck_id, title, text, points, rarity, tags)
select (select id from public.decks where title='Consequence' and type='negative' limit 1),
       'Grounded','No screen time tonight.', -4, 'rare'::rarity, ARRAY['privilege_loss']
ON CONFLICT (deck_id, title) DO NOTHING;

insert into public.deck_cards (deck_id, title, text, points, rarity, tags)
select (select id from public.decks where title='Consequence' and type='negative' limit 1),
       'Teammates Upset','Your choices upset teammates.', -3, 'rare'::rarity, ARRAY['social']
ON CONFLICT (deck_id, title) DO NOTHING;

insert into public.deck_cards (deck_id, title, text, points, rarity, tags)
select (select id from public.decks where title='Consequence' and type='negative' limit 1),
       'Big Mistake','You lost important materials.', -5, 'very_rare'::rarity, ARRAY['natural_loss']
ON CONFLICT (deck_id, title) DO NOTHING;

insert into public.deck_cards (deck_id, title, text, points, rarity, tags)
select (select id from public.decks where title='Consequence' and type='negative' limit 1),
       'Ignored Directions','You didn’t follow instructions.', -1, 'common'::rarity, ARRAY['responsibility']
ON CONFLICT (deck_id, title) DO NOTHING;