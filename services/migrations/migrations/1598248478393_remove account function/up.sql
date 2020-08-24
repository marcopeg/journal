CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE "public"."users_delete_requests" (
    request_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id INTEGER NOT NULL,
    message text NOT NULL,
    data jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE OR REPLACE FUNCTION public.users_drop_by_id()
    RETURNS TRIGGER
    LANGUAGE plpgsql
    VOLATILE
AS $function$
DECLARE
    VAR_userId INTEGER;
	VAR_rec RECORD;
	VAR_rec_count NUMERIC;
	VAR_payload TEXT;
BEGIN
    VAR_userId := NEW.user_id;

    -- Validate the user exists:
    SELECT id INTO VAR_rec FROM public.users WHERE id = VAR_userId;
    GET DIAGNOSTICS VAR_rec_count := ROW_COUNT;
    IF VAR_rec_count = 0 THEN 
        VAR_payload := '{"success": false, "error": "user does not exists", "data": {}}';
    ELSE
        -- Compose a JSON report of the deletion:
        VAR_payload := '{"success": true, "error": null, "data": {';
        
        DELETE FROM "public"."journal_notes" WHERE "created_by" = VAR_userId;
        GET DIAGNOSTICS VAR_rec_count := ROW_COUNT;
        VAR_payload := VAR_payload || '"journal_notes":' || VAR_rec_count;
        
        DELETE FROM "public"."journal_logs" WHERE "user_id" = VAR_userId;
        GET DIAGNOSTICS VAR_rec_count := ROW_COUNT;
        VAR_payload := VAR_payload || ', "journal_logs":' || VAR_rec_count;
        
        DELETE FROM "public"."journal_questions" WHERE "user_id" = VAR_userId;
        GET DIAGNOSTICS VAR_rec_count := ROW_COUNT;
        VAR_payload := VAR_payload || ', "journal_questions":' || VAR_rec_count;
        
        DELETE FROM "public"."users_settings" WHERE "user_id" = VAR_userId;
        GET DIAGNOSTICS VAR_rec_count := ROW_COUNT;
        VAR_payload := VAR_payload || ', "users_settings":' || VAR_rec_count;
        
        DELETE FROM "public"."users" WHERE "id" = VAR_userId;
        GET DIAGNOSTICS VAR_rec_count := ROW_COUNT;
        VAR_payload := VAR_payload || ', "users":' || VAR_rec_count;
        
        VAR_payload := VAR_payload || '}}';
    END IF;
    
    
    -- RAISE EXCEPTION 'del %', VAR_payload;
    
    UPDATE "public"."users_delete_requests"
    SET 
        data = VAR_payload::jsonb, 
        updated_at = NOW()
    WHERE request_id = NEW.request_id;

    RETURN NEW;
END
$function$;

CREATE TRIGGER users_drop_by_id AFTER INSERT ON public.users_delete_requests FOR EACH ROW EXECUTE PROCEDURE public.users_drop_by_id();