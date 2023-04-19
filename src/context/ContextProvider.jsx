import { createContext, useContext, useState } from "react";

export const ACCESS_TOKEN = "ACCESS_TOKEN";

const StateContext = createContext({
  user: null,
  token: null,
  c: true,
  setUser: () => {},
  setToken: () => {},
  setLoading: () => {},
});

export const ContextProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [token, _setToken] = useState(localStorage.getItem(ACCESS_TOKEN));
  const [loading, setLoading] = useState(false);

  const setToken = (token) => {
    _setToken(token);
    if (token) {
      localStorage.setItem(ACCESS_TOKEN, token);
    } else {
      localStorage.removeItem(ACCESS_TOKEN);
    }
  };

  return (
    <StateContext.Provider
      value={{
        user,
        token,
        loading,
        setUser,
        setToken,
        setLoading,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
