DROP TRIGGER users_drop_by_id ON public.users_delete_requests;
DROP FUNCTION "public"."users_drop_by_id"();
DROP TABLE "public"."users_delete_requests";
DROP EXTENSION IF EXISTS "uuid-ossp" CASCADE;