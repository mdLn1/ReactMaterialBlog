import React, { useState } from "react";
import PropTypes from "prop-types";
import MultipleOptionsMenu from "./MultipleOptionsMenu";
import ReactMarkdown from "react-markdown";
import NewsForm from "./NewsForm";

const News = ({ title, content }) => {
  const [showNewsActions, toggleNewsActions] = useState(false);
  const [showEditPost, toggleEditPost] = useState(false);

  return showEditPost ? (
    <NewsForm
      isBeingEdited
      title={title}
      content={content}
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
              fontAwesomeIcon: "fas fa-trash-alt delete",
              text: "Delete",
              action: () => {},
            },
            {
              fontAwesomeIcon: "fas fa-flag",
              text: "Report",
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
