import React, { useState, Fragment } from "react";
import "react-mde/lib/styles/css/react-mde-all.css";
import { Grid, Button, Icon } from "@material-ui/core";
import PostForm from "./posts/PostForm";
import SplitButton from "../components/customizedElements/SplitButton";

const options = [
  "Default Sort",
  "Most Recent",
  "Most Liked",
  "Most Commented",
  "Oldest",
];

const TopHomePage = (props) => {
  // state changes
  const [isNewPostFormShown, toggleNewPostForm] = useState(false);

  // action handlers
  const handleSearch = (searchOption) => {
    console.log(searchOption);
  };

  return (
    <Fragment>
      <div className="top-navigation">
        <Grid
          container
          justify={`${isNewPostFormShown ? "flex-end" : "space-between"}`}
        >
          {!isNewPostFormShown && (
            <Grid item xs={6} sm={6} md={6}>
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
            </Grid>
          )}
          <Grid container item xs={6} sm={6} md={6} justify="flex-end">
            <Grid item>
              <SplitButton
                options={options}
                selectedItemIndexChanged={handleSearch}
              />
            </Grid>
          </Grid>
        </Grid>
      </div>
      <div className={`new-post ${isNewPostFormShown ? "form-showing" : ""}`}>
        {isNewPostFormShown && (
          <PostForm
            cancelAction={() => toggleNewPostForm(false)}
            successAction={() => toggleNewPostForm(false)}
          />
        )}
      </div>
    </Fragment>
  );
};

TopHomePage.propTypes = {};

export default TopHomePage;
