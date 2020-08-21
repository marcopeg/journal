/* eslint-disable */

import React, {
  useContext,
  createContext,
  useEffect,
  useState,
  useMemo
} from "react";
import { useHistory } from "react-router-dom";
import createAuth0Client from "@auth0/auth0-spa-js";

const AuthContext = createContext();
const LOCAL_STORAGE_KEY = "auth.user";

const AuthProviderDev = ({ children }) => {
  const history = useHistory();
  const [hasChecked, setHasChecked] = useState(null);
  const [data, setData] = useState(null);

  // Check user's login at boot time
  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem("login"));
      setData(data);
    } catch (err) {
      setData(null);
    } finally {
      setHasChecked(true);
    }
  }, []);

  // Fake method to attempt to log the user in
  const login = () => {
    const data = {
      user: {
        id: 1,
        name: "Marco"
      },
      token: {
        "x-hasura-admin-secret": "gitpod-hasura-demo",
        "x-hasura-role": "user",
        "x-hasura-user-id": 1
      }
    };
    localStorage.setItem("login", JSON.stringify(data));
    setData(data);
    history.push("/");
  };

  const logout = () => {
    localStorage.removeItem("login");
    setData(null);
    history.push("/");
  };

  const auth = {
    hasChecked,
    user: data ? data.user : null,
    token: data ? data.token : null,
    login,
    logout
  };
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

const AuthProviderProd = ({
  children,
  rootURL = window.location.origin,
  rootURI = window.location.pathname,
  ...initOptions
}) => {
  const history = useHistory();

  // compute the localStorage cached user just once per page load.
  // this is just to avoid the initial login
  const cachedUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    } catch (err) {
      return null;
    }
  }, []);

  // the initial state depends on the user that's been cached in localStorage
  const [isReady, setIsReady] = useState(cachedUser !== null);
  const [isLoading, setIsLoading] = useState(cachedUser === null);
  const [isAuthenticated, setIsAuthenticated] = useState(cachedUser !== null);
  const [client, setClient] = useState(null);
  const [user, setUser] = useState(cachedUser);
  const [token, setToken] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        // console.log("@auth::init");
        const client = await createAuth0Client(initOptions);

        // Handle a login callback url
        if (window.location.search.includes("code=")) {
          // console.log("@@callback");
          try {
            const { appState } = await client.handleRedirectCallback();
            if (appState && appState.returnTo) {
              history.replace(appState.returnTo);
            } else {
              history.replace(rootURI);
            }
          } catch (err) {
            console.log("Error handling callbaclk", err.message);
          }

          // not sure why, but this won't work without a delay here
          await setTimeout((r) => r, 100);
        }

        // Figure out login state
        const isAuthenticated = await client.isAuthenticated(false);
        setClient(client);

        // Try to retrieve login info
        if (isAuthenticated) {
          const [user, token] = await Promise.all([
            client.getUser(),
            client.getTokenSilently()
          ]);

          // Persist in memory
          setUser(user);
          setToken(token);
          setIsAuthenticated(true);

          // Persist in local storage
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(user));
        } else {
          // Clean up local storage and in-memory auth cache
          setToken(null);
          setIsAuthenticated(false);
          localStorage.removeItem(LOCAL_STORAGE_KEY);
        }
      } catch (err) {
        console.log("!!!!!!!!!!!!");
        console.error(err);
      } finally {
        setIsLoading(false);
        setIsReady(true);
      }
    })();
  }, []);

  const login = (payload) => {
    setIsLoading(true);
    client.loginWithRedirect(payload);
  };

  const logout = () => {
    setIsLoading(true);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    client.logout({ returnTo: rootURL });
  };

  const auth = {
    hasChecked: isReady,
    user,
    token,
    login,
    logout
  };

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const AuthProvider = process.env.REACT_APP_HASURA_DEV_TOKEN
  ? AuthProviderDev
  : AuthProviderProd;

export const useAuth = () => useContext(AuthContext);
export default useAuth;
