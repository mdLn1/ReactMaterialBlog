import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";
import Tooltip from "@material-ui/core/Tooltip";

const Comment = ({ author, datePosted, content }) => {
  const [showCommentActions, toggleShowActions] = useState(false);
  function toggleActions() {
    toggleShowActions(true);
    setTimeout(() => {
      toggleShowActions(false);
    }, 5000);
  }
  return (
    <Fragment>
      <div className="comment">
        <div className="comment-header">
          <span className="author">{author}</span>
          <span className="date-posted">{datePosted}</span>
          <span className="comment-options">
            <Tooltip title="Actions" arrow interactive>
              <i
                className="fas fa-ellipsis-v"
                onClick={() => toggleActions()}
              ></i>
            </Tooltip>
            {showCommentActions && (
              <div className="dropleft">
                <p>
                  {" "}
                  <i className="fas fa-edit edit"></i>
                  <span>Edit</span>
                </p>
                <p>
                  <i className="fas fa-trash-alt delete"></i>
                  <span>Delete</span>
                </p>
                <p>
                  <i className="far fa-flag"></i>
                  <span>Report</span>
                </p>
              </div>
            )}
          </span>
        </div>
        <div className="comment-content">{content}</div>
      </div>
    </Fragment>
  );
};
Comment.propTypes = {
  author: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  datePosted: PropTypes.object.isRequired,
};

Comment.defaultProps = {
  author: "John Doe",
  content: "default content comment content",
  datePosted: new Date().toUTCString(),
};

export default Comment;
