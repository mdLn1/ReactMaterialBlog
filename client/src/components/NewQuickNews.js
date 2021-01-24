// libraries
import React, { useState } from "react";
import "react-mde/lib/styles/css/react-mde-all.css";
import { Button, Icon } from "@material-ui/core";

// project items
import NewsForm from "./NewsForm";

const NewQuickNews = (props) => {
  const [isNewQuickNewsFormShown, toggleAddNewsForm] = useState(false);

  // ui component
  return (
    <div
      className={`post-news ${isNewQuickNewsFormShown ? "form-showing" : ""}`}
    >
      {isNewQuickNewsFormShown ? (
        <NewsForm
          cancelAction={() => toggleAddNewsForm(false)}
          successAction={() => toggleAddNewsForm(false)}
        />
      ) : (
        <div id="new-news-button">
          <Button
            color="primary"
            variant="contained"
            onClick={() => toggleAddNewsForm(true)}
          >
            <Icon
              className="fas fa-plus-circle"
              style={{ marginRight: "15px" }}
            />{" "}
            Add News
          </Button>
        </div>
      )}
    </div>
  );
};

NewQuickNews.propTypes = {};

export default NewQuickNews;
