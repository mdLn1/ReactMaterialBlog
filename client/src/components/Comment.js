import React, { Fragment } from "react";
import PropTypes from "prop-types";
import Tooltip from '@material-ui/core/Tooltip';

const Comment = ({ author, datePosted, content }) => {
  return (
    <Fragment>
      <div className="comment">
        <div className="comment-header">
          <span className="author">{author}</span>
          <span className="date-posted">{datePosted}</span>
          <Tooltip title="Report" arrow interactive>
          <i className="far fa-flag"></i>
          </Tooltip>
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
    datePosted: new Date().toUTCString()
};

export default Comment;
