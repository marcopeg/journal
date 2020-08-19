-- Users & Settings
-- (settings is created via trigger, in case you need to alter the table to apply custom settings)
TRUNCATE public.users RESTART IDENTITY CASCADE;
INSERT INTO public.users VALUES 
(1, 'auth0|0123456789', 'jdoe@foobar.com', '2020-01-01 08:54:49.275948+00', '2020-01-03 09:52:30.695674+00'),
(2, 'facebook|10221765877087248', 'marco.pegoraro@gmail.com', '2019-12-27 13:49:08.694295+00', '2020-08-18 05:31:27.229456+00');
ALTER SEQUENCE public.users_id_seq RESTART WITH 3;

-- Journal Questions & Logs
TRUNCATE public.journal_questions RESTART IDENTITY CASCADE;
INSERT INTO public.journal_questions VALUES
(1, 1, 1, 'text', 'What was today''s best happening?', '{"rows": 2, "maxlength": 140}', '2019-12-30 07:44:47.892977+00', '2020-01-01 21:31:52.432049+00', true),
(2, 1, 2, 'text', 'What can you improve?', '{"rows": 2, "maxlength": 140}', '2019-12-30 07:44:47.892977+00', '2020-01-01 21:31:52.432049+00', false);
ALTER SEQUENCE public.journal_questions_id_seq RESTART WITH 3;

TRUNCATE public.journal_logs RESTART IDENTITY CASCADE;
INSERT INTO public.journal_logs VALUES
(1, 1, 'Got promoted', '{}', NOW(), NOW(), DATE_TRUNC('day', NOW())),
(1, 2, 'Keep calm and breath', '{}', NOW(), NOW(), DATE_TRUNC('day', NOW()));

-- Journal Notes
TRUNCATE public.journal_notes RESTART IDENTITY CASCADE;
INSERT INTO public.journal_notes VALUES
(1, 1, 'First log', null, 1, NOW() - INTERVAL '1d', 1, NOW() - INTERVAL '1d'),
(2, 1, 'Second log', null, 1, NOW(), 1, NOW());
ALTER SEQUENCE public.journal_notes_id_seq RESTART WITH 3;

-- App Settings
TRUNCATE public.app_settings CASCADE;
INSERT INTO public.app_settings VALUES
('client.web.build', '1');