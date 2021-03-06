import React, { useEffect } from "react";

import nativeApi from "../utils/nativeApi";
import AuthContext from "./AuthContext";

const Provider = AuthContext.Provider;

type AuthProviderProp = {
  children: React.ReactNode;
  isLogin: boolean;
};

const AuthProvider: React.FC<AuthProviderProp> = (props) => {
  const { children, isLogin: logged } = props;
  const [isLogin, setIsLogin] = React.useState<boolean>(logged);

  useEffect(() => {
    (async () => {
      const uid = await nativeApi.getStoreKey("currentUid");
      const logged = Boolean(uid);
      (logged ? login : logout)();
    })();
  }, []);

  const login = () => setIsLogin(true);
  const logout = async (uid?: string, isClear: boolean = false) => {
    setIsLogin(false);
    if (isClear) return;
    if (uid) {
      nativeApi.deleteUser(uid);
    } else {
      nativeApi.setStoreKey("currentUid", "");
    }
  };

  return <Provider value={{ isLogin, login, logout }}>{children}</Provider>;
};

export default AuthProvider;
