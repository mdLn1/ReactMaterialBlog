import React, { Fragment, useState, useContext, useEffect } from "react";
import SideContainer from "../components/SideContainer";
import SinglePost from "../components/SinglePost";
import MainContext from "../contexts/main/mainContext";
import asyncRequestSender from "../utils/asyncRequestSender";
import { useSnackbar } from "notistack";
import { POST_ROUTE } from "../httpRoutes";
import { SNACKBAR_AUTO_HIDE_DURATION } from "../AppSettings";

const ViewPost = ({ match }) => {
  const mainContext = useContext(MainContext);
  const { posts, currentPost, setCurrentPost } = mainContext;
  const { enqueueSnackbar } = useSnackbar();

  const [isLoading, toggleLoading] = useState(false);

  useEffect(() => {
    (async () => {
      toggleLoading(true);
      const { isSuccess, errors, status, data } = await asyncRequestSender(
        POST_ROUTE + match.params.id
      );
      if (!isSuccess) {
        errors.forEach((el) =>
          enqueueSnackbar(el, {
            variant: "error",
            autoHideDuration: SNACKBAR_AUTO_HIDE_DURATION,
          })
        );
      } else {
        setCurrentPost(data);
      }
      toggleLoading(false);
    })();
  }, []);

  return (
    <div className="home-container">
      <section className="center">
        {!isLoading && currentPost && <SinglePost {...currentPost} />}
      </section>
      <SideContainer />
    </div>
  );
};

export default ViewPost;
