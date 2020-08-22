

CREATE OR REPLACE FUNCTION public.expense_projects_list_by_user(hasura_session json, dummy text)
 RETURNS SETOF expense_projects_by_user
 LANGUAGE plpgsql
 STABLE
AS $function$
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
    $function$;

CREATE OR REPLACE FUNCTION public.expense_transactions_list_by_user(hasura_session json, project_id integer, last_date timestamp with time zone DEFAULT now(), page_size smallint DEFAULT 20)
 RETURNS SETOF expense_transactions_by_user
 LANGUAGE plpgsql
 STABLE
AS $function$
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
    $function$;
