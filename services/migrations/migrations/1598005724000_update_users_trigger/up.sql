CREATE OR REPLACE FUNCTION public.populate_users_settings() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  INSERT INTO public.users_settings (user_id) VALUES (NEW.id)
	ON CONFLICT ON CONSTRAINT "users_settings_pkey" DO NOTHING ;
  RETURN NEW;
END;
$$;
