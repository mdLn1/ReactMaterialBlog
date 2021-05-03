import React, { useContext, useEffect } from "react";
import MainPost from "../components/posts/MainPost";
import TopHomePage from "../components/TopHomePage";
import SideContainer from "../components/SideContainer";
import MainContext from "../contexts/main/mainContext";
import { useSnackbar } from "notistack";
import { SNACKBAR_AUTO_HIDE_DURATION } from "../AppSettings";
import { asyncRequestErrorHandler } from "../utils/asyncRequestHelper";
import axios from "axios";
import { POST_ROUTE } from "../httpRoutes";

const Home = () => {
  const mainContext = useContext(MainContext);
  const { enqueueSnackbar } = useSnackbar();
  const source = axios.CancelToken.source();
  const { posts, addPosts } = mainContext;

  const { test, testObj } = mainContext;

  useEffect(() => {
    if (!posts?.length)
      axios
        .get(`${POST_ROUTE}`, { cancelToken: source.token })
        .then((response) => {
          addPosts(response.data.posts);
        })
        .catch((error) => {
          if (axios.isCancel(error)) {
            console.log("request canceled");
          } else {
            const { errors, status } = asyncRequestErrorHandler(error);
            errors.forEach((el) =>
              enqueueSnackbar(el, {
                variant: "error",
                autoHideDuration: SNACKBAR_AUTO_HIDE_DURATION,
              })
            );
          }
        });

    return () => {
      source.cancel();
    };
  }, []);

  return (
    <div className="home-container">
      <section className="center">
        <TopHomePage />
        {posts.map((el, index) => (
          <MainPost key={el._id} {...el} />
        ))}
      </section>
      <SideContainer />
    </div>
  );
};

export default Home;
