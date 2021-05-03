import React, { Fragment } from "react";
import Comment from "./Comment";
import { Icon } from "@material-ui/core";
import Button from "@material-ui/core/Button";

const CommentsSection = ({ comments }) => {
  return (
    <Fragment>
      <div className="comment-creation">
        <h3>Add a comment</h3>
        <hr />
        <textarea className="comment-text" placeholder="Write a comment..." />
        <div className="comment-submit">
          <Button color="primary" variant="contained">
            <Icon
              className="fas fa-plus-circle"
              style={{ marginRight: "10px" }}
            />
            Post Comment
          </Button>
        </div>
      </div>
      <h3>Comments</h3>
      <hr />
      {comments.length === 0 && (
        <h3 className="centered-text">No comments yet</h3>
      )}
      {comments.map((el, index) => (
        <Comment key={el._id} {...el}/>
      ))}
    </Fragment>
  );
};

CommentsSection.defaultProps = {
  comments: [],
};

export default CommentsSection;
