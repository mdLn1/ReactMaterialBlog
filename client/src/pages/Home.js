import React, { useContext, useEffect } from "react";
import MainPost from "../components/MainPost";
import NewPost from "../components/NewPost";
import SideContainer from "../components/SideContainer";
import MainContext from "../contexts/main/mainContext";

const Home = () => {
  const mainContext = useContext(MainContext);

  const { test, testObj } = mainContext;

  return (
    <div className="home-container">
      <section className="center">
        <NewPost />
        {[1, 2, 3, 4].map((el, index) => (
          <MainPost key={index} />
        ))}
      </section>
      <SideContainer />
    </div>
  );
};

export default Home;
