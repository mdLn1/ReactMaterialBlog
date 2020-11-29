import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";
import ReactMarkdown from "react-markdown";
import { containsMDImage } from "../utils/matchMDImagePattern";
import CssBaseline from "@material-ui/core/CssBaseline";
import EditPost from "./EditPost";
import { Link } from "react-router-dom";
import Tooltip from "@material-ui/core/Tooltip";

const MainPost = ({
  title,
  content,
  datePosted,
  author,
  pinned,
  likes,
  noTotalComments,
  id,
}) => {
  const [dropped, setDrop] = useState(false);
  const [pinApplied, setPin] = useState(pinned);
  const [isPostBeingEdited, toggleEditMode] = useState(false);
  const [isLiked, toggleLike] = useState(false);
  const [linkCopied, toggleLinkCopy] = useState(false);
  const [showPostActions, toggleShowActions] = useState(false);

  function copyLink() {
    toggleLinkCopy(true);
    setTimeout(() => {
      toggleLinkCopy(false);
    }, 3000);
  }

  function toggleActions() {
    toggleShowActions(true);
    setTimeout(() => {
      toggleShowActions(false);
    }, 7000);
  }

  return isPostBeingEdited ? (
    <EditPost
      title={title}
      content={content}
      cancelEditing={() => toggleEditMode(false)}
      submitChanges={() => toggleEditMode(false)}
    />
  ) : (
    <article
      className="main-post"
      onClick={() => {
        if (showPostActions) toggleShowActions(false);
      }}
    >
      <CssBaseline />

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
          <Tooltip title="Actions" arrow interactive>
            <i
              className="fas fa-ellipsis-v"
              onClick={() => toggleActions()}
            ></i>
          </Tooltip>
          {showPostActions && (
            <div className="dropleft">
              <p onClick={() => toggleEditMode(!isPostBeingEdited)}>
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

        <h1>
          {" "}
          <Link to={`/post/${id}`}>{title}</Link>
        </h1>
        <small>Posted on {datePosted}</small>
      </section>
      <hr />
      <section className="main-post-content">
        {containsMDImage(content) || content.length > 600 ? (
          dropped ? (
            <Fragment>
              <ReactMarkdown source={content} />
              <div className="add-fade">
                <i
                  className="fas fa-chevron-up"
                  onClick={() => setDrop(!dropped)}
                ></i>
              </div>
            </Fragment>
          ) : (
            <Fragment>
              <div className="markdown-limiter">
                <ReactMarkdown source={content} />
              </div>
              <div className="remove-fade">
                <i
                  className="fas fa-chevron-down"
                  onClick={() => setDrop(!dropped)}
                ></i>
              </div>
            </Fragment>
          )
        ) : (
          <ReactMarkdown source={content} />
        )}
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
          <span className="total-items-indicator">{likes}</span>
          <Link to={`/post/${id}`}>
            <Tooltip title="Comments" arrow interactive>
              <i className="far fa-comment"></i>
            </Tooltip>
          </Link>
          <span className="total-items-indicator">{noTotalComments}</span>
        </span>
        <Tooltip title="Share" arrow interactive>
          <span className="main-post-social-shares">
            <i
              className="fas fa-share-alt"
              onClick={() => {
                copyLink();
              }}
            ></i>
            {linkCopied && (
              <div className="dropleft">
                <p>
                  <i className="fas fa-link"></i>Link Copied!
                </p>
              </div>
            )}
          </span>
        </Tooltip>
      </section>
    </article>
  );
};

MainPost.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
};

MainPost.defaultProps = {
  title: "Title",
  content:
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, ![image food](https://iso.500px.com/wp-content/uploads/2014/06/W4A2827-1-3000x2000.jpg) when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum",
  author: "author",
  datePosted: new Date().toUTCString(),
  pinned: false,
  likes: 12,
  noTotalComments: 1,
  id: 1,
};

export default MainPost;
