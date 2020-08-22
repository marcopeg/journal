/**
 * RULE DEFINITION
 * (copy this to Auth0 Rules)
 */

function hasuraClaimsRule(user, context, callback) {
  const query = `
          query getUserId ($auth0Id:String!) {
              users(where: { auth0_id: { _eq: $auth0Id }}) { id }
      }
    `;

  const variables = {
    auth0Id: user.user_id
  };

  const payload = {
    headers: {
      "content-type": "application/json",
      "x-hasura-admin-secret": configuration.ACCESS_KEY
    },
    url: `${configuration.BASE_URL}/v1/graphql`,
    body: JSON.stringify({ query, variables })
  };

  request.post(payload, (error, response, body) => {
    if (error) {
      callback(error);
      return;
    }

    try {
      context.accessToken["https://hasura.io/jwt/claims"] = {
        "x-hasura-default-role": "user",
        "x-hasura-allowed-roles": ["user"],
        "x-hasura-user-id": JSON.parse(body).data.users[0].id.toString(),
        "x-auth0-user-id": user.user_id
      };

      callback(null, user, context);
    } catch (err) {
      callback(err);
    }
  });
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
  context: {
    accessToken: {}
  },
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

hasuraClaimsRule(auth0.user, auth0.context, auth0.callback);
