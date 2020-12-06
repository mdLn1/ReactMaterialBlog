import React from "react";
import PostReport from "./PostReport";

const ReportedPost = () => {
  return (
    <div className="reported-post">
      <div className="header">
          Post
      </div>
      <div className="body">
        {[0, 1, 2, 3].map((el) => (
          <PostReport />
        ))}
      </div>
    </div>
  );
};

export default ReportedPost;
