import React, { useState } from "react";
import PropTypes from "prop-types";
import ReactMde from "react-mde";
import * as Showdown from "showdown";
import "react-mde/lib/styles/css/react-mde-all.css";
import { Button, Icon } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";

import ValidationTextField from "./customizedElements/ValidationTextField";

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
}));

const converter = new Showdown.Converter({
  tables: true,
  simplifiedAutoLink: true,
  strikethrough: true,
  tasklists: true,
});

const EditPost = ({ title, content, datePosted, author, pinned, cancelEditing, submitChanges}) => {
  const classes = useStyles();

  let editPostTitle = {};
  const [value, setValue] = useState(content);
  const [selectedTab, setSelectedTab] = useState("write");
  return (
    <div className="edit-post">
      <Container component="main">
        <CssBaseline />
        <div className={classes.paper}>
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
              label="Post Title"
              name="postTitle"
              defaultValue={title}
              {...editPostTitle}
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

            <Grid container spacing={4} id="edit-post-submission">
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => cancelEditing(false)}
                  id="cancel-edit-post-button"
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
                  onClick={() => submitChanges(false)}
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
    </div>
  );
};

EditPost.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
};

EditPost.defaultProps = {
  title: "Title",
  content:
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, ![image food](https://iso.500px.com/wp-content/uploads/2014/06/W4A2827-1-3000x2000.jpg) when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum",
  author: "author",
  datePosted: new Date().toUTCString(),
  pinned: false,
};

export default EditPost;
