import React, { useContext, useEffect } from "react";
import HotNews from "../components/HotNews";
import MainPost from "../components/MainPost";
import NewPost from "../components/NewPost";
import SinglePost from "../components/SinglePost";
import MainContext from "../contexts/main/mainContext";

const Home = () => {
  const mainContext = useContext(MainContext);

  const { test, testObj } = mainContext;

  return (
    <div className="home-container">
      <section className="left">
        {[1, 2, 3, 4].map((el, index) => (
          <HotNews key={index} />
        ))}
      </section>
      <section className="center">
        <SinglePost />
      </section>
      <section className="right">
        {[1, 2, 3, 4].map((el, index) => (
          <HotNews key={index} />
        ))}
      </section>
    </div>
  );
};

export default Home;
