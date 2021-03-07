import React, { Fragment, useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import ReactMarkdown from "react-markdown";
import CommentsSection from "./CommentsSection";
import Tooltip from "@material-ui/core/Tooltip";
import MultipleOptionsMenu from "./MultipleOptionsMenu";
import { secondary } from "../AppColors";
import PostForm from "./PostForm";
import moment from "moment";
import MainContext from "../contexts/main/mainContext";
import { CONTENT_TYPES } from "../constants";

const SinglePost = ({
  title,
  content,
  postedDate,
  likes,
  comments,
  edited,
  pinned,
  _id,
}) => {
  const mainContext = useContext(MainContext);

  const [pinApplied, setPin] = useState(pinned);
  const [isPostBeingEdited, toggleEditMode] = useState(false);
  const [isLiked, toggleLike] = useState(false);
  const [linkCopied, toggleLinkCopy] = useState(false);
  const [showPostActions, toggleShowActions] = useState(false);

  const { createReport } = mainContext;

  function copyLink() {
    toggleLinkCopy(true);
    setTimeout(() => {
      toggleLinkCopy(false);
    }, 3000);
  }

  return isPostBeingEdited ? (
    <div className="edit-post">
      <PostForm
        isBeingEdited
        title={title}
        content={content}
        cancelAction={() => toggleEditMode(false)}
        successAction={() => toggleEditMode(false)}
      />
    </div>
  ) : (
    <article
      className="main-post single-post"
      onClick={() => {
        if (showPostActions) toggleShowActions(false);
      }}
    >
      <section className="main-post-header">
        <span className="post-options">
          <Tooltip
            title={`${pinApplied ? "Post Pinned" : "Pin Post"}`}
            arrow
            interactive
          >
            <i
              className={`fas fa-thumbtack pin ${pinApplied ? "pinned" : ""}`}
              onClick={() => setPin(!pinApplied)}
            ></i>
          </Tooltip>
          <MultipleOptionsMenu
            options={[
              {
                fontAwesomeIcon: "fas fa-edit edit",
                text: "Edit",
                action: () => {
                  toggleEditMode(!isPostBeingEdited);
                },
              },
              {
                fontAwesomeIcon: "fas fa-flag",
                text: "Report",
                action: () => {
                  createReport(CONTENT_TYPES[0], _id);
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
        <h1>{title}</h1>
        <small>
          Posted {moment(postedDate).fromNow()} {edited && "(edited)"}
        </small>
      </section>
      <hr />
      <section className="main-post-content">
        <ReactMarkdown source={content} />
      </section>
      <section className="main-post-footer">
        <span className="main-post-user-engagement">
          {isLiked ? (
            <Tooltip title="You liked this post!" arrow interactive>
              <i
                className="fas fa-thumbs-up"
                onClick={() => toggleLike(!isLiked)}
              ></i>
            </Tooltip>
          ) : (
            <Tooltip title="Like" arrow interactive>
              <i
                className="far fa-thumbs-up"
                onClick={() => toggleLike(!isLiked)}
              ></i>
            </Tooltip>
          )}
          <span className="total-items-indicator">{likes?.length}</span>
          <Tooltip title="Comments" arrow interactive>
            <i className="far fa-comment"></i>
          </Tooltip>
          <span className="total-items-indicator">{comments?.length}</span>
        </span>
        <span className="main-post-social-shares">
          <MultipleOptionsMenu
            options={[
              {
                text: "Copy Link",
                action: () => {
                  copyLink();
                },
              },
            ]}
            tooltipTitle="Share"
            iconStyle={{ color: secondary }}
            iconClass="fas fa-share-alt"
          />
        </span>
      </section>
      <section className="single-post-comments">
        <CommentsSection comments={comments} />
      </section>
    </article>
  );
};

SinglePost.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  author: PropTypes.object.isRequired,
};

SinglePost.defaultProps = {
  title: "Title",
  content:
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, ![image food](https://iso.500px.com/wp-content/uploads/2014/06/W4A2827-1-3000x2000.jpg) when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum",
  author: {},
  postedDate: new Date().toUTCString(),
  pinned: false,
  likes: new Array(10),
};

export default SinglePost;
