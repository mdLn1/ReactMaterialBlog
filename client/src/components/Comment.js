import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";
import MultipleOptionsMenu from "./MultipleOptionsMenu";
import moment from "moment";


const Comment = ({ author, postedDate, content, edited }) => {

  return (
    <Fragment>
      <div className="comment">
        <div className="comment-header">
          <span className="author">{author.username}</span>
          <span className="date-posted">{moment(postedDate).fromNow()} {edited && "(edited)"}</span>
          <span className="comment-options">
            <MultipleOptionsMenu
              iconStyle={{ fontSize: ".8rem" }}
              options={[
                {
                  fontAwesomeIcon: "fas fa-edit edit",
                  text: "Edit",
                  action: () => {},
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
        </div>
        <div className="comment-content">{content}</div>
      </div>
    </Fragment>
  );
};
Comment.propTypes = {
  author: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  postedDate: PropTypes.string.isRequired,
};

Comment.defaultProps = {
  author: "John Doe",
  content: "default content comment content",
  postedDate: new Date().toUTCString(),
};

export default Comment;
