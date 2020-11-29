import React from "react";
import PropTypes from "prop-types";

const News = ({ title }) => {
  return (
    <article className="hot-news">
      <div>
        <b>{title}</b>
      </div>
    </article>
  );
};

News.propTypes = {
  title: PropTypes.string.isRequired,
};

News.defaultProps = {
  title: "Flash hot news",
};

export default News;
