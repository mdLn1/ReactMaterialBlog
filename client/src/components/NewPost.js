import React, { useState } from "react";
import PropTypes from "prop-types";
import ReactMde from "react-mde";
import * as Showdown from "showdown";
import "react-mde/lib/styles/css/react-mde-all.css";
import { Button, Icon } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";

import ValidationTextField from "./customizedElements/ValidationTextField";

const useStyles = makeStyles((theme) => ({
  paper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: "10px"
  },
  form: {
    width: "100%",
    margin: theme.spacing(2, 0, 2),
  },
}));

const converter = new Showdown.Converter({
  tables: true,
  simplifiedAutoLink: true,
  strikethrough: true,
  tasklists: true,
});

const NewPost = (props) => {
  const classes = useStyles();

  let newPostTitleProps = {};
  const [isNewPostFormShown, toggleNewPostForm] = useState(false);
  const [value, setValue] = useState("");
  const [selectedTab, setSelectedTab] = useState("write");
  return (
    <div className={`new-post ${isNewPostFormShown ? "form-showing" : ""}`}>
      {isNewPostFormShown ? (
        <Container component="main">
          <CssBaseline />
          <div className={classes.paper}>
            <Typography component="h1" variant="h5">
              New Post
            </Typography>
            <form
              className={classes.form}
              onSubmit={(e) => {
                e.preventDefault();
              }}
              noValidate
              autoComplete="off"
            >
              <ValidationTextField
                variant="outlined"
                margin="normal"
                id="title"
                required
                fullWidth
                label="New Post Title"
                name="postTitle"
                {...newPostTitleProps}
              />
              <ReactMde
                value={value}
                onChange={setValue}
                selectedTab={selectedTab}
                onTabChange={setSelectedTab}
                generateMarkdownPreview={(markdown) =>
                  Promise.resolve(converter.makeHtml(markdown))
                }
              />

              <Grid container spacing={4} id="new-post-submission">
                <Grid item xs={12} sm={6} md={6} lg={6}>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => toggleNewPostForm(false)}
                    id="cancel-new-post-button"
                  >
                    {" "}
                    Cancel{" "}
                    <Icon
                      className="fas fa-times-circle"
                      style={{ marginLeft: "15px" }}
                    />
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={6}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={() => toggleNewPostForm(false)}
                  >
                    {" "}
                    Submit{" "}
                    <Icon
                      className="fas fa-check-circle"
                      style={{ marginLeft: "15px" }}
                    />
                  </Button>
                </Grid>
              </Grid>
            </form>
          </div>
        </Container>
      ) : (
        <div id="new-post-button">
          <Button
            color="secondary"
            variant="contained"
            onClick={() => toggleNewPostForm(true)}
          >
            <Icon
              className="fas fa-plus-circle"
              style={{ marginRight: "15px" }}
            />{" "}
            New Post
          </Button>
        </div>
      )}
    </div>
  );
};

NewPost.propTypes = {};

export default NewPost;
