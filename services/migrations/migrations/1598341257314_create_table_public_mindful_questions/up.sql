CREATE TABLE "public"."mindful_questions" (
  "id" SERIAL NOT NULL, 
  "bucket" TEXT NOT NULL, 
  "lang" TEXT NOT NULL, 
  "type" TEXT NOT NULL, 
  "text" TEXT NOT NULL, 
  "data" JSONB NOT NULL DEFAULT '{}', 
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(), 
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(), 
  PRIMARY KEY ("id") 
);

-- https://bucketlistjourney.net/365-thought-provoking-questions-answered/
-- How do you find the strength to do what you know in your heart is right?
INSERT INTO "public"."mindful_questions" ("bucket", "lang", "type", "text") VALUES
('life', 'en', 'text', 'When was the last time you tried something new?'),
('life', 'en', 'text', 'Who do you sometimes compare yourself to?'),
('life', 'en', 'text', 'What’s the most sensible thing you’ve ever heard someone say?'),
('life', 'en', 'text', 'What gets you excited about life?'),
('life', 'en', 'text', 'What life lesson did you learn the hard way?'),
('life', 'en', 'text', 'What do you wish you spent more time doing five years ago?'),
('life', 'en', 'text', 'Do you ask enough questions or do you settle for what you know?'),
('life', 'en', 'text', 'Who do you love and what are you doing about it?'),
('life', 'en', 'text', 'What’s a belief that you hold with which many people disagree?'),
('life', 'en', 'text', 'What can you do today that you were not capable of a year ago?'),
('life', 'en', 'text', 'Do you think crying is a sign of weakness or strength?'),
('life', 'en', 'text', 'What would you do differently if you knew nobody would judge you?'),
('life', 'en', 'text', 'Do you celebrate the things you do have?'),
('life', 'en', 'text', 'What is the difference between living and existing?'),
('life', 'en', 'text', 'Have you done anything lately worth remembering?'),
('life', 'en', 'text', 'What does your joy look like today?'),
('life', 'en', 'text', 'Is it possible to lie without saying a word?'),
('life', 'en', 'text', 'Which activities make you lose track of time?'),
('life', 'en', 'text', 'If you had to teach something, what would you teach?'),
('life', 'en', 'text', 'What would you regret not fully doing, being or having in your life?'),
('life', 'en', 'text', 'Are you holding onto something that you need to let go of?'),
('life', 'en', 'text', 'When you are 80-years-old, what will matter to you the most?'),
('life', 'en', 'text', 'When is it time to stop calculating risk and rewards and just do what you know is right?'),
('life', 'en', 'text', 'How old would you be if you didn’t know how old you are?'),
('life', 'en', 'text', 'Would you break the law to save a loved one?'),
('life', 'en', 'text', 'What makes you smile?'),
('life', 'en', 'text', 'When it’s all said and done, will you have said more than you’ve done?'),
('life', 'en', 'text', 'If you had the opportunity to get a message across to a large group of people, what would your message be?'),
('life', 'en', 'text', 'If the average human lifespan was 40 years, how would you live your life differently?'),
('life', 'en', 'text', 'If you could choose one book as a mandatory read for all high school students, which book would you choose?'),
('life', 'en', 'text', 'Would you rather have less work or more work you actually enjoy doing?'),
('life', 'en', 'text', 'Which is worse, failing or never trying?'),
('life', 'en', 'text', 'When was the last time you listened to the sound of your own breathing?'),
('life', 'en', 'text', 'What’s something you know you do differently than most people?'),
('life', 'en', 'text', 'Would you rather be a worried genius or a joyful simpleton?'),
('life', 'en', 'text', 'If you could instill one piece of advice in a newborn baby’s mind, what advice would you give?'),
('life', 'en', 'text', 'What is the most desirable trait another person can possess?'),
('life', 'en', 'text', 'What are you most grateful for?'),
('life', 'en', 'text', 'Are you more worried about doing things right, or doing the right things?'),
('life', 'en', 'text', 'What has life taught you recently?'),
('life', 'en', 'text', 'Can you describe your life in a six word sentence?'),
('life', 'en', 'text', 'What is the most defining moment of your life thus far?');


INSERT INTO "public"."mindful_questions" ("bucket", "lang", "type", "text") VALUES
('quick', 'en', 'text', 'How many coffee did you drink this morning?'),
('quick', 'en', 'text', 'What are the color of your socks?'),
('quick', 'en', 'text', 'What was your last though you remember from yesterday?'),
('quick', 'en', 'text', 'What did your partner wear this morning?'),
('quick', 'en', 'text', 'How many red lights did you get to reach the office?'),
('quick', 'en', 'text', 'What did you eat last night?'),
('quick', 'en', 'text', 'What did you eat yesterday at lunch?');
