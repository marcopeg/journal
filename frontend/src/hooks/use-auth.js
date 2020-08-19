import React, { useContext, createContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

const AuthContext = createContext();

const useAuthProvider = () => {
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

  return {
    hasChecked,
    user: data ? data.user : null,
    token: data ? data.token : null,
    login,
    logout
  };
};

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const auth = useAuthProvider();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export default useAuth;
