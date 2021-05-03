import React, { useState, useContext } from "react";
import PropTypes from "prop-types";
import MultipleOptionsMenu from "../customizedElements/MultipleOptionsMenu";
import ReactMarkdown from "react-markdown";
import NewsForm from "./NewsForm";
import MainContext from "../../contexts/main/mainContext";
import { CONTENT_TYPES } from "../../constants";

const News = ({ _id, title, content, displayFromDate, displayUntilDate }) => {
  const [showNewsActions, toggleNewsActions] = useState(false);
  const [showEditPost, toggleEditPost] = useState(false);
  const mainContext = useContext(MainContext);
  const { createReport } = mainContext;

  return showEditPost ? (
    <NewsForm
      isBeingEdited
      title={title}
      content={content}
      newsId={_id}
      displayFromDate={displayFromDate}
      displayUntilDate={displayUntilDate}
      cancelAction={() => toggleEditPost(false)}
      successAction={() => toggleEditPost(false)}
    />
  ) : (
    <article
      className="hot-news"
      onClick={() => {
        if (showNewsActions) toggleNewsActions(false);
      }}
    >
      <span className="post-options">
        <MultipleOptionsMenu
          options={[
            {
              fontAwesomeIcon: "fas fa-edit edit",
              text: "Edit",
              action: () => {
                toggleEditPost(true);
              },
            },
            {
              fontAwesomeIcon: "fas fa-flag",
              text: "Report",
              action: () => {
                createReport(CONTENT_TYPES[1], _id);
              },
            },
            {
              fontAwesomeIcon: "fas fa-trash-alt delete",
              text: "Delete",
              action: () => {},
            },
          ]}
        />
      </span>
      <div>
        <b>{title}</b>
      </div>
      <ReactMarkdown source={content} />
    </article>
  );
};

News.propTypes = {
  title: PropTypes.string.isRequired,
};

News.defaultProps = {
  title: "Flash hot news",
  content: "fadsfas",
};

export default News;
