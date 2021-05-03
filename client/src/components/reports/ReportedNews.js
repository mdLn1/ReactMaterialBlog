import React, { useState, useContext } from "react";
import PropTypes from "prop-types";
import MultipleOptionsMenu from "../customizedElements/MultipleOptionsMenu";
import ReactMarkdown from "react-markdown";
import NewsForm from "../../components/news/NewsForm";
import MainContext from "../../contexts/main/mainContext";
import { CONTENT_TYPES } from "../../constants";

const ReportedNews = ({
  _id,
  title,
  content,
  displayFromDate,
  displayUntilDate,
}) => {
  const [showNewsActions, toggleNewsActions] = useState(false);
  const [showEditNews, toggleEditNews] = useState(false);
  const mainContext = useContext(MainContext);
  const { createReport } = mainContext;

  return showEditNews ? (
    <NewsForm
      isBeingEdited
      title={title}
      content={content}
      newsId={_id}
      displayFromDate={displayFromDate}
      displayUntilDate={displayUntilDate}
      cancelAction={() => toggleEditNews(false)}
      successAction={() => toggleEditNews(false)}
    />
  ) : (
    <article
      className="hot-news"
      onClick={() => {
        if (showNewsActions) toggleNewsActions(false);
      }}
    >
      <div>
        <b>Title:</b> {title}
      </div>
      <div>
        <b>Content below:</b>
        <ReactMarkdown source={content} />
      </div>
    </article>
  );
};

ReportedNews.propTypes = {
  title: PropTypes.string.isRequired,
};

ReportedNews.defaultProps = {
  title: "Flash hot news",
  content: "fadsfas",
};

export default ReportedNews;
