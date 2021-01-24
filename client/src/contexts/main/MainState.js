import React, { useReducer } from "react";
import MainContext from "./mainContext";
import mainReducer from "./mainReducer";
import { loginUserDef, registerUserDef, testFramework } from "./functions";
import { OAUTH_LOGIN_SUCCESS, TEST, LOGIN_SUCCESS } from "../types";

export default (props) => {
  const initialState = {
    user: null,
    loggedIn: false,
    loading: false,
    oAuthProvider: null,
    token: null,
    testObj: "something",
  };

  const [state, dispatch] = useReducer(mainReducer, initialState);

  const login = (data) => {
    localStorage.setItem("token", data.token);
    dispatch({ type: LOGIN_SUCCESS, payload: data });
  };

  const oAuthLogin = (data) => {
    localStorage.setItem("token", data.token);
    dispatch({ type: OAUTH_LOGIN_SUCCESS, payload: data });
  };

  const registerUser = (user) => registerUserDef(user, dispatch);
  const test = (user) => testFramework(user, dispatch);

  return (
    <MainContext.Provider
      value={{
        user: state.user,
        loggedIn: state.loggedIn,
        loading: state.loading,
        oAuthProvider: state.oAuthProvider,
        testObj: state.testObj,
        test,
        login,
        oAuthLogin,
      }}
    >
      {props.children}
    </MainContext.Provider>
  );
};
