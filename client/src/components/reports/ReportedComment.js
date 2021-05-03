import React, { Fragment, useContext } from "react";
import PropTypes from "prop-types";
import moment from "moment";

const ReportedComment = ({ _id, author, postedDate, content, edited }) => {
  return (
    <div className="reported-comment">
      <div className="author"><b>Created by:</b> {author.username}</div>
      <div className="date-posted">
        <b>Posted: </b> {moment(postedDate).fromNow()} {edited && "(edited)"}
      </div>
      <div className="content">
        <b>Content:</b> {content}
      </div>
    </div>
  );
};
ReportedComment.propTypes = {
  author: PropTypes.object.isRequired,
  content: PropTypes.string.isRequired,
  postedDate: PropTypes.string.isRequired,
};

ReportedComment.defaultProps = {
  author: { username: "John Doe" },
  content: "default content comment content",
  postedDate: new Date().toUTCString(),
};

export default ReportedComment;
