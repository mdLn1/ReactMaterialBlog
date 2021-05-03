import React, { useState, Fragment, useContext, useEffect } from "react";
import ReactMde from "react-mde";
import * as Showdown from "showdown";
import "react-mde/lib/styles/css/react-mde-all.css";
import {
  Icon,
  Typography,
  Container,
  Grid,
  CircularProgress,
} from "@material-ui/core";
import axios from "axios";
import { asyncRequestErrorHandler } from "../../utils/asyncRequestHelper";
import { makeStyles } from "@material-ui/core/styles";
import ValidationTextField from "../customizedElements/ValidationTextField";
import CustomContainedButton from "../customizedElements/CustomContainedButton";
import { POST_ROUTE } from "../../httpRoutes";
import {
  isPostContentValid,
  isPostTitleValid,
} from "../../utils/customValidators";
import {
  POST_TITLE_ERROR,
  POST_CONTENT_ERROR,
} from "../../utils/inputErrorMessages";
import { useSnackbar } from "notistack";
import MainContext from "../../contexts/main/mainContext";

const useStyles = makeStyles((theme) => ({
  paper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: "10px",
  },
  form: {
    width: "100%",
    margin: theme.spacing(2, 0, 2),
  },
  loader: {
    margin: theme.spacing(2, 1, 1),
  },
}));

const converter = new Showdown.Converter({
  tables: true,
  simplifiedAutoLink: true,
  strikethrough: true,
  tasklists: true,
});

const PostForm = ({
  isBeingEdited,
  title,
  content,
  postId,
  cancelAction,
  successAction,
}) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const mainContext = useContext(MainContext);
  const { updatePost } = mainContext;
  const source = axios.CancelToken.source();

  let newPostTitleProps = {};
  let submissionButtonProps = { disabled: true };
  const [postContent, setPostContent] = useState(isBeingEdited ? content : "");
  const [postTitle, setPostTitle] = useState(isBeingEdited ? title : "");
  const [isPostTitleError, togglePostTitleError] = useState(false);
  const [isPostContentError, togglePostContentError] = useState(false);
  const [responseErrors, setResponseErrors] = useState([]);
  const [isLoading, toggleLoading] = useState(false);

  const [selectedTab, setSelectedTab] = useState("write");

  // events
  useEffect(() => {
    return () => {
      toggleLoading(false);
      source.cancel();
    };
  }, []);

  // action handlers

  const validatePostTitle = ({ target: { value } }) => {
    setPostTitle(value);
    togglePostTitleError(!isPostTitleValid(value));
  };

  const handleSubmitNewPost = async (e) => {
    e.preventDefault();
    toggleLoading(true);
    if (isPostContentValid(postContent) && isPostTitleValid(postTitle)) {
      const requestData = {
        title: postTitle,
        content: postContent,
      };

      let axiosRequestConfig = {
        data: requestData,
        cancelToken: source.token,
      };

      if (isBeingEdited) {
        axiosRequestConfig.url = POST_ROUTE + postId;
        axiosRequestConfig.method = "patch";
      } else {
        axiosRequestConfig.url = POST_ROUTE;
        axiosRequestConfig.method = "post";
      }

      axios
        .request(axiosRequestConfig)
        .then((response) => {
          enqueueSnackbar(
            isBeingEdited
              ? "You've saved the changes."
              : "You've posted new content.",
            { variant: "success" }
          );
          if (isBeingEdited) updatePost(postId, postContent, postTitle);
          if (successAction) successAction();
        })
        .catch((error) => {
          if (axios.isCancel(error)) {
            console.log("request canceled");
          } else {
            const { errors, status } = asyncRequestErrorHandler(error);
            if (status === 400) {
              setResponseErrors(errors);
            } else {
              errors.forEach((el) => enqueueSnackbar(el, { variant: "error" }));
            }
          }
        })
        .finally(() => {
          toggleLoading(false);
        });
    } else {
      togglePostContentError(!isPostContentValid(postContent));
      togglePostTitleError(!isPostTitleValid(postTitle));
    }
  };

  if (isPostTitleError) {
    newPostTitleProps = {
      error: true,
      helperText: POST_TITLE_ERROR,
    };
  }

  if (isPostTitleError || isPostContentError) {
    submissionButtonProps.disabled = true;
  } else {
    submissionButtonProps.disabled = false;
  }

  return (
    <Container component="main">
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          {isBeingEdited ? "Editing Post" : "New Post"}
        </Typography>
        {isLoading && <CircularProgress className={classes.loader} />}
        {responseErrors.length > 0 && (
          <ul className="errors">
            {responseErrors.map((el, index) => (
              <li key={index}>{el}</li>
            ))}
          </ul>
        )}
        <form
          className={classes.form}
          onSubmit={handleSubmitNewPost}
          noValidate
          autoComplete="off"
        >
          <ValidationTextField
            variant="outlined"
            margin="normal"
            id="title"
            required
            value={postTitle}
            fullWidth
            label="Post Title"
            name="postTitle"
            onChange={(e) => validatePostTitle(e)}
            {...newPostTitleProps}
          />

          <ReactMde
            value={postContent}
            id="content"
            onChange={(val) => {
              setPostContent(val);
              togglePostContentError(!isPostContentValid(val));
            }}
            selectedTab={selectedTab}
            onTabChange={setSelectedTab}
            generateMarkdownPreview={(markdown) =>
              Promise.resolve(converter.makeHtml(markdown))
            }
          />
          {isPostContentError && <p className="error">{POST_CONTENT_ERROR}</p>}

          <Grid
            container
            spacing={4}
            id={isBeingEdited ? "edit-post-submission" : "new-post-submission"}
          >
            <Grid item xs={12} sm={6} md={6} lg={6}>
              <CustomContainedButton
                variant="contained"
                fullWidth
                onClick={() => {
                  if (cancelAction) cancelAction();
                }}
                color="error"
              >
                {" "}
                Cancel{" "}
                <Icon
                  className="fas fa-times-circle"
                  style={{ marginLeft: "15px" }}
                />
              </CustomContainedButton>
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={6}>
              <CustomContainedButton
                fullWidth
                type="submit"
                variant="contained"
                color="success"
                {...submissionButtonProps}
              >
                {isBeingEdited ? "Save Changes" : "Submit"}
                <Icon
                  className="fas fa-check-circle"
                  style={{ marginLeft: "15px" }}
                />
              </CustomContainedButton>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
};

PostForm.propTypes = {};

PostForm.defaultProps = {
  title: "Title",
  content:
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, ![image food](https://iso.500px.com/wp-content/uploads/2014/06/W4A2827-1-3000x2000.jpg) when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum",
  author: "author",
  datePosted: new Date().toUTCString(),
  pinned: false,
};

export default PostForm;
