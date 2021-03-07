import {
  LOGIN_FAILED,
  LOGIN_SUCCESS,
  OAUTH_LOGIN_SUCCESS,
  OAUTH_LOGIN_FAILED,
  LOGOUT,
  REGISTER_FAILED,
  REGISTER_SUCCESS,
  TEST,
  ADD_POSTS,
  EDITED_POST,
  ADD_NEWS,
  EDITED_NEWS,
  SET_CURRENT_POST,
  CLOSE_REPORT,
  CREATE_REPORT,
} from "../types";

export default (state, action) => {
  switch (action.type) {
    case CREATE_REPORT:
      return {
        ...state,
        report: { open: true, ...action.payload },
        loading: false,
      };
    case CLOSE_REPORT:
      return {
        ...state,
        report: { open: false, contentTye: "", contentId: "" },
        loading: false,
      };
    case LOGIN_SUCCESS:
      return { ...state, ...action.payload, loading: false };
    case LOGIN_FAILED:
      return { ...state, user: null, errors: action.payload, loading: false };
    case LOGOUT:
      return {
        ...state,
        user: null,
        errors: null,
        loading: false,
        loggedIn: false,
      };
    case ADD_POSTS:
      return { ...state, posts: state.posts.concat(action.payload) };
    case EDITED_POST:
      const posts = [].concat(state.posts);
      const posPost = posts.findIndex((el) => el._id === action.payload.postId);
      if (posPost > -1) {
        posts[posPost].content = action.payload.newPostContent;
        posts[posPost].title = action.payload.newPostTitle;
      }
      return { ...state, posts: posts };
    case SET_CURRENT_POST:
      return { ...state, currentPost: action.payload };
    case ADD_NEWS:
      return { ...state, news: state.news.concat(action.payload) };
    case EDITED_NEWS:
      const news = [].concat(state.news);
      const posNews = news.findIndex((el) => el._id === action.payload.newsId);
      if (posNews > -1) {
        news[posNews].content = action.payload.newPostContent;
        news[posNews].title = action.payload.newPostTitle;
      }
      return { ...state, news: news };
    case OAUTH_LOGIN_SUCCESS:
      return { ...state, ...action.payload, loading: false };
    case OAUTH_LOGIN_FAILED:
      return { ...state, user: null, errors: action.payload, loading: false };
    case REGISTER_SUCCESS:
      return { ...state, user: action.payload, loading: false };
    case REGISTER_FAILED:
      return { ...state, user: null, errors: action.payload, loading: false };
    case TEST:
      return { ...state, testObj: action.payload };
    default:
      return state;
  }
};
