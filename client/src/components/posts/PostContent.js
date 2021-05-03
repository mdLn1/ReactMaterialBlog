import React, { Fragment } from "react";
import moment from "moment";
import ReactMarkdown from "react-markdown";

const PostContent = ({
  title,
  content,
  postedDate,
  edited,
  _id,
}) => {
  return (
    <Fragment>
      <section className="main-post-header">
        <h1>{title}</h1>
        <small>
          Posted {moment(postedDate).fromNow()} {edited && "(edited)"}
        </small>
      </section>
      <hr />
      <section className="main-post-content">
        <ReactMarkdown source={content} />
      </section>
    </Fragment>
  );
};

export default PostContent;
