-- Users & Settings
-- (settings is created via trigger, in case you need to alter the table to apply custom settings)
TRUNCATE public.users RESTART IDENTITY CASCADE;
INSERT INTO public.users VALUES 
(1, 'auth0|0123456789', 'jdoe@foobar.com', '2020-01-01 08:54:49.275948+00', '2020-01-03 09:52:30.695674+00'),
(3, 'facebook|10221765877087248', 'marco.pegoraro@gmail.com', '2019-12-27 13:49:08.694295+00', '2020-08-18 05:31:27.229456+00');
ALTER SEQUENCE public.users_id_seq RESTART WITH 4;

-- Journal Questions & Logs
TRUNCATE public.journal_questions RESTART IDENTITY CASCADE;
INSERT INTO public.journal_questions VALUES
    -- JDoe Data 
    (1, 1, 1, 'text', '[jdoe] What was today''s best happening?', '{"rows": 2, "maxlength": 140}', '2019-12-30 07:44:47.892977+00', '2020-01-01 21:31:52.432049+00', true),
    (2, 1, 2, 'text', '[jdoe] What can you improve?', '{"rows": 2, "maxlength": 140}', '2019-12-30 07:44:47.892977+00', '2020-01-01 21:31:52.432049+00', false),
    -- Marcopeg Data
    (3, 3, 1, 'text', '[mpeg] What was today''s best happening?', '{"rows": 2, "maxlength": 140}', '2019-12-30 07:44:47.892977+00', '2020-01-01 21:31:52.432049+00', true),
    (4, 3, 2, 'text', '[mpeg] What can you improve?', '{"rows": 2, "maxlength": 140}', '2019-12-30 07:44:47.892977+00', '2020-01-01 21:31:52.432049+00', false);
ALTER SEQUENCE public.journal_questions_id_seq RESTART WITH 5;

TRUNCATE public.journal_logs RESTART IDENTITY CASCADE;
INSERT INTO public.journal_logs VALUES
    -- JDoe Data 
    (1, 1, '[jdoe] Got promoted', '{}', NOW() - INTERVAL '1d', NOW(), DATE_TRUNC('day', NOW())),
    (1, 2, '[jdoe] Keep calm and breath', '{}', NOW() - INTERVAL '1d', NOW(), DATE_TRUNC('day', NOW())),
    -- Marcopeg Data
    (3, 3, '[mpeg] Got promoted', '{}', NOW() - INTERVAL '1d', NOW(), DATE_TRUNC('day', NOW())),
    (3, 4, '[mpeg] Keep calm and breath', '{}', NOW() - INTERVAL '1d', NOW(), DATE_TRUNC('day', NOW()));

-- Journal Notes
TRUNCATE public.journal_notes RESTART IDENTITY CASCADE;
INSERT INTO public.journal_notes VALUES
    -- JDoe Data 
    (1, 1, '\[jdoe\] First log', null, 1, NOW() - INTERVAL '1d', 1, NOW() - INTERVAL '1d'),
    (2, 1, '\[jdoe\] Second log', null, 1, NOW(), 1, NOW()),
    -- Marcopeg Data
    (3, 3, '\[mpeg\] First log', null, 3, NOW() - INTERVAL '1d', 3, NOW() - INTERVAL '1d'),
    (4, 3, '\[mpeg\] Second log', null, 3, NOW(), 3, NOW());
ALTER SEQUENCE public.journal_notes_id_seq RESTART WITH 5;

-- App Settings
TRUNCATE public.app_settings CASCADE;
INSERT INTO public.app_settings VALUES
('client.web.build', '1');