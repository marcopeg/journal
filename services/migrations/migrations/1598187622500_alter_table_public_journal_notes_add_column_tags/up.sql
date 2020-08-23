ALTER TABLE "public"."journal_notes" ADD COLUMN "tags" text[] DEFAULT '{}';
UPDATE "public"."journal_notes" SET tags = '{''free-text''}' WHERE tags = '{}';