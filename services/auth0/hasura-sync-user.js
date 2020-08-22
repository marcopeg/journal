/**
 * RULE DEFINITION
 * (copy this to Auth0 Rules)
 */

function hasuraSyncUserV3(user, context, callback) {
  const insertQuery = `
    mutation($userId: String!, $email: String) {
      insert_users(
        objects: [{
            auth0_id: $userId
            email: $email
        }],
        on_conflict: {
            constraint: users_auth0_id_key,
            update_columns: []
        }) {
            affected_rows
      }
    }
  `;

  const updateQuery = `
    mutation ($userId: String!, $email: String) {
      update_users(
        where: {
          auth0_id: {_eq: $userId}
        }, 
        _set: {
          email: $email
        }
      ) {
        affected_rows
      }
    }
  `;

  const variables = {
    userId: user.user_id,
    email: user.email
  };

  const params = {
    url: `${configuration.BASE_URL}/v1/graphql`,
    headers: {
      "content-type": "application/json",
      "x-hasura-admin-secret": configuration.ACCESS_KEY
    }
  };

  // Try to update in case of login
  request.post(
    {
      ...params,
      body: JSON.stringify({ query: updateQuery, variables })
    },
    (error, response, body) => {
      if (error) return callback(error, null, null);
      if (JSON.parse(body).data.update_users.affected_rows > 0) {
        return callback(error, user, context);
      }

      // Try to INSERT in case of first login/signup
      request.post(
        {
          ...params,
          body: JSON.stringify({ query: insertQuery, variables })
        },
        (error, response, body) => {
          if (error) return callback(error, null, null);
          if (JSON.parse(body).data.insert_users.affected_rows > 0) {
            return callback(error, user, context);
          }

          throw new Error(
            `It was not possible to create the user: ${user.user_id} / ${user.email}`
          );
        }
      );
    }
  );
}

/**
 * RUN THE RULE
 */

const fetch = require("cross-fetch");

const auth0 = {
  user: {
    user_id: "test-3",
    email: "test@test.com"
  },
  context: {},
  callback: (error, user, context) => {
    if (error) throw error;
    console.log(user);
    console.log(context);
  }
};

const configuration = {
  ACCESS_KEY: "gitpod-hasura-demo",
  BASE_URL: "http://localhost:8080"
};

const request = {
  post: async (payload, callback) => {
    const { url, ...params } = payload;

    try {
      const response = await fetch(url, { ...params, method: "POST" });
      const body = await response.text();
      callback(null, response, body);
    } catch (err) {
      callback(err, null, null);
    }
  }
};

hasuraSyncUserV3(auth0.user, auth0.context, auth0.callback);
