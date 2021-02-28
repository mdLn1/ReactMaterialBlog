import React, { useContext, useEffect } from "react";
import MainPost from "../components/MainPost";
import TopHomePage from "../components/TopHomePage";
import SideContainer from "../components/SideContainer";
import MainContext from "../contexts/main/mainContext";
import { useSnackbar } from "notistack";
import { SNACKBAR_AUTO_HIDE_DURATION } from "../AppSettings";
import asyncRequestSender from "../utils/asyncRequestSender";
import { POST_ROUTE } from "../httpRoutes";

const Home = () => {
  const mainContext = useContext(MainContext);
  const { enqueueSnackbar } = useSnackbar();

  const { posts, addPosts } = mainContext;

  const { test, testObj } = mainContext;

  useEffect(() => {
    if (!posts?.length)
      (async () => {
        const { isSuccess, errors, status, data } = await asyncRequestSender(
          POST_ROUTE,
          0
        );
        if (!isSuccess) {
          errors.forEach((el) =>
            enqueueSnackbar(el, {
              variant: "error",
              autoHideDuration: SNACKBAR_AUTO_HIDE_DURATION,
            })
          );
        } else {
          addPosts(data.posts);
        }
      })();
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
