import React, { useContext, createContext, useState } from "react";

const defaults = {
  title: "IonicAPP",
  menu: "Menu",
  login: "Login"
};

const I18NContext = createContext();

const useI18NProvider = () => {
  const [values] = useState(defaults);

  const get = (key) => {
    if (values[key]) {
      return values[key];
    }

    if (defaults[key]) {
      console.warn(`Missing translation for: "${key}"`);
      return defaults[key];
    }

    console.error("Missing default", key);
    return key;
  };

  return {
    get
  };
};

export const useI18N = () => useContext(I18NContext);

export const I18NProvider = ({ children }) => {
  const i18n = useI18NProvider();
  return <I18NContext.Provider value={i18n}>{children}</I18NContext.Provider>;
};

export default useI18N;
