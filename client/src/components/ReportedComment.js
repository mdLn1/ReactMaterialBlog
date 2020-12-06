import React from "react";
import CommentReport from "./CommentReport";

const ReportedComment = () => {
  return (
    <div className="reported-comment">
      <div className="header">
          Comment
      </div>
      <div className="body">
        {[0, 1, 2, 3].map((el) => (
          <CommentReport />
        ))}
      </div>
    </div>
  );
};

export default ReportedComment;
