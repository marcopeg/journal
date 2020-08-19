CREATE FUNCTION public.expense_create_default_project_category() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    DECLARE
      rec RECORD;
    BEGIN
      INSERT INTO public.expense_categories
      ( project_id, name,      created_by,     updated_by )
      VALUES
      ( NEW.id,     'Extra',   NEW.created_by, NEW.created_by );
      RETURN NEW;
    END;
    $$;
CREATE FUNCTION public.expense_create_projects_members_owner() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    DECLARE
      rec RECORD;
    BEGIN
      INSERT INTO public.expense_projects_users
      ( project_id, member_id,      created_by,     is_owner )
      VALUES
      ( NEW.id,     NEW.created_by, NEW.created_by, true );
      RETURN NEW;
    END;
    $$;
CREATE TABLE public.expense_projects_by_user (
    id integer NOT NULL,
    name text,
    data jsonb,
    categories json[],
    members json[]
);
CREATE FUNCTION public.expense_projects_list_by_user(hasura_session json, dummy text) RETURNS SETOF public.expense_projects_by_user
    LANGUAGE plpgsql STABLE
    AS $$
    BEGIN
      RETURN QUERY
      SELECT
        t1.id,
        t1.name,
        t1.data,
        ARRAY (
          SELECT
            json_build_object (
              'id', t2.id,
              'name', t2.name,
              'notes', t2.notes
            ) AS category
          FROM expense_categories AS t2
          WHERE t2.project_id = t1.id
            AND t2.is_active = true
          ORDER BY t2.order ASC
        ) AS categories,
        ARRAY (
          SELECT
            json_build_object (
              'member_id', t3.id,
              'email', t3.email
            ) AS member
          FROM users AS t3
          JOIN expense_projects_users AS t4 ON t3.id = t4.member_id
          JOIN expense_projects AS t5 ON t4.project_id = t5.id
          WHERE t5.id = t1.id
        ) AS members
      FROM expense_projects AS t1
      JOIN expense_projects_users AS t2 ON t1.id = t2.project_id
      WHERE t2.member_id = (hasura_session->>'x-hasura-user-id')::INTEGER
      ORDER BY t1.order ASC;
    END
    $$;
CREATE TABLE public.expense_transactions_by_user (
    id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    amount numeric(10,2) NOT NULL,
    notes text,
    data jsonb,
    reporter json,
    category json,
    CONSTRAINT expense_transactions_by_user_amount_check CHECK ((amount <> (0)::numeric))
);
CREATE FUNCTION public.expense_transactions_list_by_user(hasura_session json, project_id integer, last_date timestamp with time zone DEFAULT now(), page_size smallint DEFAULT 20) RETURNS SETOF public.expense_transactions_by_user
    LANGUAGE plpgsql STABLE
    AS $$
    DECLARE
      VAR_projectId INTEGER := project_id;
    BEGIN
      RETURN QUERY
      WITH
      granted_projects_ids AS (
        SELECT t1.project_id FROM expense_projects_users AS t1
        WHERE t1.project_id = VAR_projectId AND member_id = (hasura_session->>'x-hasura-user-id')::INTEGER
      ),
      granted_expenses AS (
        SELECT
          t1.*,
          (hasura_session->>'x-hasura-user-id')::INTEGER AS user_id
        FROM expense_transactions AS t1
        WHERE t1.project_id IN (SELECT * FROM granted_projects_ids)
      )
      SELECT
        t1.id,
        t1.created_at,
        t1.amount,
        t1.notes,
        t1.data,
        json_build_object('email', t2.email) AS reporter,
        json_build_object('name', t3.name) AS category
      FROM granted_expenses AS t1
      JOIN users AS t2 ON t2.id = t1.member_id
      JOIN expense_categories AS t3 ON t3.id = t1.category_id
      WHERE t1.created_at < last_date
      ORDER BY t1.created_at DESC
      LIMIT page_size;
    END
    $$;
CREATE FUNCTION public.populate_users_settings() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  INSERT INTO users_settings (user_id) VALUES (NEW.id);
  RETURN NEW;
END;
$$;
CREATE FUNCTION public.set_current_timestamp_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$$;
CREATE TABLE public.app_settings (
    key character varying(25) NOT NULL,
    value jsonb DEFAULT '{}'::jsonb
);
CREATE TABLE public.expense_categories (
    id integer NOT NULL,
    project_id integer,
    name text NOT NULL,
    notes text,
    data jsonb,
    is_active boolean DEFAULT true NOT NULL,
    "order" smallint DEFAULT 9999 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    created_by integer NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_by integer NOT NULL,
    CONSTRAINT expense_categories_name_check CHECK ((name <> ''::text))
);
CREATE SEQUENCE public.expense_categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.expense_categories_id_seq OWNED BY public.expense_categories.id;
CREATE TABLE public.expense_projects (
    id integer NOT NULL,
    name text NOT NULL,
    notes text,
    data jsonb,
    is_active boolean DEFAULT true NOT NULL,
    "order" smallint DEFAULT 9999 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    created_by integer NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_by integer NOT NULL,
    CONSTRAINT expense_projects_name_check CHECK ((name <> ''::text))
);
CREATE SEQUENCE public.expense_projects_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.expense_projects_id_seq OWNED BY public.expense_projects.id;
CREATE TABLE public.expense_projects_users (
    project_id integer NOT NULL,
    member_id integer NOT NULL,
    is_owner boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    created_by integer NOT NULL
);
CREATE TABLE public.expense_transactions (
    id integer NOT NULL,
    project_id integer,
    category_id integer,
    member_id integer NOT NULL,
    amount numeric(10,2) NOT NULL,
    notes text,
    data jsonb,
    is_confirmed boolean DEFAULT false NOT NULL,
    created_by integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_by integer NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT expense_transactions_amount_check CHECK ((amount <> (0)::numeric))
);
CREATE SEQUENCE public.expense_transactions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.expense_transactions_id_seq OWNED BY public.expense_transactions.id;
CREATE TABLE public.journal_logs (
    user_id integer NOT NULL,
    question_id integer NOT NULL,
    text text,
    data jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    created_at_day date DEFAULT now() NOT NULL
);
CREATE TABLE public.journal_notes (
    id integer NOT NULL,
    user_id integer,
    text text NOT NULL,
    data jsonb,
    created_by integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_by integer NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT journal_notes_text_check CHECK ((text <> ''::text))
);
CREATE SEQUENCE public.journal_notes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.journal_notes_id_seq OWNED BY public.journal_notes.id;
CREATE TABLE public.journal_questions (
    id integer NOT NULL,
    user_id integer NOT NULL,
    "order" smallint NOT NULL,
    type text NOT NULL,
    text text NOT NULL,
    data jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    show_in_journal boolean DEFAULT false NOT NULL
);
CREATE SEQUENCE public.journal_questions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.journal_questions_id_seq OWNED BY public.journal_questions.id;
CREATE TABLE public.users (
    id integer NOT NULL,
    auth0_id text NOT NULL,
    email text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);
CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;
CREATE TABLE public.users_settings (
    user_id integer NOT NULL,
    data jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);
ALTER TABLE ONLY public.expense_categories ALTER COLUMN id SET DEFAULT nextval('public.expense_categories_id_seq'::regclass);
ALTER TABLE ONLY public.expense_projects ALTER COLUMN id SET DEFAULT nextval('public.expense_projects_id_seq'::regclass);
ALTER TABLE ONLY public.expense_transactions ALTER COLUMN id SET DEFAULT nextval('public.expense_transactions_id_seq'::regclass);
ALTER TABLE ONLY public.journal_notes ALTER COLUMN id SET DEFAULT nextval('public.journal_notes_id_seq'::regclass);
ALTER TABLE ONLY public.journal_questions ALTER COLUMN id SET DEFAULT nextval('public.journal_questions_id_seq'::regclass);
ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);
ALTER TABLE ONLY public.app_settings
    ADD CONSTRAINT app_settings_pkey PRIMARY KEY (key);
ALTER TABLE ONLY public.expense_categories
    ADD CONSTRAINT expense_categories_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.expense_projects_by_user
    ADD CONSTRAINT expense_projects_by_user_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.expense_projects
    ADD CONSTRAINT expense_projects_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.expense_projects_users
    ADD CONSTRAINT expense_projects_users_pkey PRIMARY KEY (project_id, member_id);
ALTER TABLE ONLY public.expense_transactions_by_user
    ADD CONSTRAINT expense_transactions_by_user_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.expense_transactions
    ADD CONSTRAINT expense_transactions_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.journal_logs
    ADD CONSTRAINT journal_logs_pkey PRIMARY KEY (user_id, question_id, created_at_day);
ALTER TABLE ONLY public.journal_notes
    ADD CONSTRAINT journal_notes_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.journal_questions
    ADD CONSTRAINT journal_questions_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.journal_questions
    ADD CONSTRAINT journal_questions_user_id_type_text_key UNIQUE (user_id, type, text);
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_auth0_id_key UNIQUE (auth0_id);
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.users_settings
    ADD CONSTRAINT users_settings_pkey PRIMARY KEY (user_id);
CREATE TRIGGER expense_create_default_project_category_trigger AFTER INSERT ON public.expense_projects FOR EACH ROW EXECUTE PROCEDURE public.expense_create_default_project_category();
CREATE TRIGGER expense_create_projects_members_owner_trigger AFTER INSERT ON public.expense_projects FOR EACH ROW EXECUTE PROCEDURE public.expense_create_projects_members_owner();
CREATE TRIGGER populate_users_settings_trigger AFTER INSERT ON public.users FOR EACH ROW EXECUTE PROCEDURE public.populate_users_settings();
CREATE TRIGGER set_public_journal_logs_updated_at BEFORE UPDATE ON public.journal_logs FOR EACH ROW EXECUTE PROCEDURE public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_journal_logs_updated_at ON public.journal_logs IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_journal_questions_updated_at BEFORE UPDATE ON public.journal_questions FOR EACH ROW EXECUTE PROCEDURE public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_journal_questions_updated_at ON public.journal_questions IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE PROCEDURE public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_users_updated_at ON public.users IS 'trigger to set value of column "updated_at" to current timestamp on row update';
ALTER TABLE ONLY public.expense_categories
    ADD CONSTRAINT expense_categories_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.expense_categories
    ADD CONSTRAINT expense_categories_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.expense_projects(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.expense_categories
    ADD CONSTRAINT expense_categories_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.expense_projects
    ADD CONSTRAINT expense_projects_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.expense_projects
    ADD CONSTRAINT expense_projects_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.expense_projects_users
    ADD CONSTRAINT expense_projects_users_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.expense_projects_users
    ADD CONSTRAINT expense_projects_users_member_id_fkey FOREIGN KEY (member_id) REFERENCES public.users(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.expense_projects_users
    ADD CONSTRAINT expense_projects_users_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.expense_projects(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.expense_transactions
    ADD CONSTRAINT expense_transactions_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.expense_categories(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.expense_transactions
    ADD CONSTRAINT expense_transactions_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.expense_transactions
    ADD CONSTRAINT expense_transactions_member_id_fkey FOREIGN KEY (member_id) REFERENCES public.users(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.expense_transactions
    ADD CONSTRAINT expense_transactions_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.expense_projects(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.expense_transactions
    ADD CONSTRAINT expense_transactions_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.journal_logs
    ADD CONSTRAINT journal_logs_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.journal_questions(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.journal_logs
    ADD CONSTRAINT journal_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.journal_notes
    ADD CONSTRAINT journal_notes_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.journal_notes
    ADD CONSTRAINT journal_notes_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.journal_notes
    ADD CONSTRAINT journal_notes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.journal_questions
    ADD CONSTRAINT journal_questions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.users_settings
    ADD CONSTRAINT users_settings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
