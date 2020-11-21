import React from "react";
import PropTypes from "prop-types";

const HotNews = ({ title }) => {
  return (
    <article className="hot-news">
      <b>{title}</b>
    </article>
  );
};

HotNews.propTypes = {
  title: PropTypes.string.isRequired,
};

HotNews.defaultProps = {
  title: "Flash hot news",
};

export default HotNews;
