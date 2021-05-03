import React, { Fragment, useState, useContext, useEffect } from "react";
import axios from "axios";
import SideContainer from "../components/SideContainer";
import SinglePost from "../components/posts/SinglePost";
import MainContext from "../contexts/main/mainContext";
import { asyncRequestErrorHandler } from "../utils/asyncRequestHelper";
import { useSnackbar } from "notistack";
import { POST_ROUTE } from "../httpRoutes";
import { SNACKBAR_AUTO_HIDE_DURATION } from "../AppSettings";

const ViewPost = ({ match }) => {
  const mainContext = useContext(MainContext);
  const { posts, currentPost, setCurrentPost } = mainContext;
  const { enqueueSnackbar } = useSnackbar();
  const source = axios.CancelToken.source();

  const [isLoading, toggleLoading] = useState(false);

  useEffect(() => {
    toggleLoading(true);
    axios
      .get(POST_ROUTE + match.params.id, { cancelToken: source.token })
      .then((response) => {
        setCurrentPost(response.data);
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
      })
      .finally(() => {
        toggleLoading(false);
      });

    return () => {
      toggleLoading(false);
      source.cancel();
    };
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
