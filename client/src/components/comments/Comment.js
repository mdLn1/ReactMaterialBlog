import React, { Fragment, useContext } from "react";
import PropTypes from "prop-types";
import MultipleOptionsMenu from "../customizedElements/MultipleOptionsMenu";
import moment from "moment";
import MainContext from "../../contexts/main/mainContext";
import { CONTENT_TYPES } from "../../constants";

const Comment = ({ _id, author, postedDate, content, edited }) => {
  const mainContext = useContext(MainContext);

  const { createReport } = mainContext;

  return (
    <Fragment>
      <div className="comment">
        <div className="comment-header">
          <span className="author">{author.username}</span>
          <span className="date-posted">
            {moment(postedDate).fromNow()} {edited && "(edited)"}
          </span>
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
                  fontAwesomeIcon: "fas fa-flag",
                  text: "Report",
                  action: () => {
                    createReport(CONTENT_TYPES[2], _id);
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
        </div>
        <div className="comment-content">{content}</div>
      </div>
    </Fragment>
  );
};
Comment.propTypes = {
  author: PropTypes.object.isRequired,
  content: PropTypes.string.isRequired,
  postedDate: PropTypes.string.isRequired,
};

Comment.defaultProps = {
  author: { username: "John Doe" },
  content: "default content comment content",
  postedDate: new Date().toUTCString(),
};

export default Comment;
