import React, { Fragment } from "react";
import moment from "moment";
import ReactMarkdown from "react-markdown";

const ReportedPost = ({ title, content, postedDate, edited, _id }) => {
  return (
    <Fragment>
      <div>
        <b>Title:</b> {title}
      </div>
      <div>
        <b>Posted:</b> {moment(postedDate).fromNow()} {edited && "(edited)"}
      </div>
      <section className="main-post-content">
        <b>Content below:</b>
        <ReactMarkdown source={content} />
      </section>
    </Fragment>
  );
};

export default ReportedPost;
