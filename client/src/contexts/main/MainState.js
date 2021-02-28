import React, { useReducer } from "react";
import MainContext from "./mainContext";
import mainReducer from "./mainReducer";
import { registerUserDef, testFramework } from "./functions";
import {
  OAUTH_LOGIN_SUCCESS,
  ADD_POSTS,
  EDITED_POST,
  SET_CURRENT_POST,
  ADD_NEWS,
  EDITED_NEWS,
  TEST,
  LOGIN_SUCCESS,
  LOGOUT,
} from "../types";
import setAuthToken from "../../utils/setAuthToken";

export default (props) => {
  const initialState = {
    user: null,
    loggedIn: false,
    loading: false,
    oAuthProvider: null,
    posts: [],
    currentPost: null,
    news: [],
    token: null,
    testObj: "something",
  };

  const [state, dispatch] = useReducer(mainReducer, initialState);

  const login = (data) => {
    localStorage.setItem("token", data.token);
    setAuthToken(data.token);
    dispatch({ type: LOGIN_SUCCESS, payload: { user: data.user } });
  };

  const oAuthLogin = (data) => {
    localStorage.setItem("token", data.token);
    setAuthToken(data.token);
    dispatch({ type: OAUTH_LOGIN_SUCCESS, payload: { user: data.user } });
  };

  const logout = () => {
    dispatch({ type: LOGOUT });
    localStorage.removeItem("token");
    setAuthToken("");
  };

  const addPosts = (posts) => {
    dispatch({ type: ADD_POSTS, payload: posts });
  };

  const addNews = (news) => {
    dispatch({ type: ADD_NEWS, payload: news });
  };

  const updatePost = (postId, newPostContent, newPostTitle) => {
    dispatch({
      type: EDITED_POST,
      payload: { postId, newPostContent, newPostTitle },
    });
  };

  const setCurrentPost = (post) => {
    dispatch({ type: SET_CURRENT_POST, payload: post });
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
        posts: state.posts,
        currentPost: state.currentPost,
        news: state.news,
        test,
        login,
        oAuthLogin,
        logout,
        addPosts,
        addNews,
        updatePost,
        setCurrentPost,
      }}
    >
      {props.children}
    </MainContext.Provider>
  );
};
