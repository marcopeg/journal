CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE "public"."users_deleted" (
    request_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id INTEGER NOT NULL,
    message text NOT NULL,
    data jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE OR REPLACE FUNCTION public.users_drop_by_id(hasura_session JSON, PAR_message TEXT)
    RETURNS SETOF users_deleted
    LANGUAGE plpgsql
    VOLATILE
AS $function$
DECLARE
    VAR_userId INTEGER;
	VAR_rec RECORD;
	VAR_rec_count NUMERIC;
	VAR_payload TEXT;
BEGIN
    VAR_userId := (hasura_session->>'x-hasura-user-id')::INTEGER;

	-- Validate the user exists:
    SELECT id INTO VAR_rec FROM public.users WHERE id = VAR_userId;
    GET DIAGNOSTICS VAR_rec_count := ROW_COUNT;
    IF VAR_rec_count = 0 THEN 
        --RAISE EXCEPTION 'Unknown user_id'; 
        RETURN QUERY
        INSERT INTO "public"."users_deleted" 
        ("user_id", "message", "data") 
        VALUES 
        (VAR_userId, PAR_message, '{"error": "user does not exists"}') 
        RETURNING *;
    ELSE
        -- Insert the tracking row for the specific user:
        INSERT INTO "public"."users_deleted" 
        ("user_id", "message", "data") 
        VALUES 
        (VAR_userId, PAR_message, '{}') 
        RETURNING * INTO VAR_rec;
        
        -- Compose a JSON report of the deletion:
        VAR_payload := '{';
        
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
        
        VAR_payload := VAR_payload || '}';
        -- RAISE EXCEPTION 'del %', VAR_payload;
        
        RETURN QUERY 
        UPDATE "public"."users_deleted"
        SET 
            data = VAR_payload::jsonb, 
            updated_at = NOW()
        WHERE request_id = VAR_rec.request_id 
        RETURNING *;
    END IF;
END
$function$;