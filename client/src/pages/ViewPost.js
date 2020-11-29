import React, { useContext, useEffect } from "react";
import SideContainer from '../components/SideContainer'
import SinglePost from "../components/SinglePost";
import MainContext from "../contexts/main/mainContext";

const Home = () => {
  const mainContext = useContext(MainContext);

  const { test, testObj } = mainContext;

  return (
    <div className="home-container">
      <section className="center">
        <SinglePost />
      </section>
      <SideContainer />
    </div>
  );
};

export default Home;
