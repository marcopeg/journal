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
