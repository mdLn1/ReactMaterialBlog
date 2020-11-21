import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";
import ReactMarkdown from "react-markdown";
import containsMDImage from "../utils/matchMDImagePattern";
import CssBaseline from "@material-ui/core/CssBaseline";
import EditPost from "./EditPost";

const MainPost = ({ title, content, datePosted, author, pinned }) => {
  const [dropped, setDrop] = useState(false);
  const [pinApplied, setPin] = useState(pinned);
  const [isPostBeingEdited, toggleEditMode] = useState(false);

  return isPostBeingEdited ? (
    <EditPost
      title={title}
      content={content}
      cancelEditing={() => toggleEditMode(false)}
      submitChanges={() => toggleEditMode(false)}
    />
  ) : (
    <article className="main-post">
      <CssBaseline />
      <span className="post-options">
        <i
          className="fas fa-edit edit"
          onClick={() => toggleEditMode(!isPostBeingEdited)}
        ></i>
        <i class="fas fa-trash-alt delete"></i>
      </span>
      <div className="main-post-header">
        <i
          className={`fas fa-thumbtack pin ${pinApplied ? "pinned" : ""}`}
          onClick={() => setPin(!pinApplied)}
        ></i>
        <h1>{title}</h1>
        <small>Posted on {datePosted}</small>
      </div>
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

        <div className="main-post-user-engagement"></div>
      </section>
      <div className="main-post-footer">
        <div className="main-post-social-shares"></div>
      </div>
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
};

export default MainPost;
