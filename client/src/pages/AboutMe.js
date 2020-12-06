import React from "react";
import MultipleOptionsMenu from "../components/MultipleOptionsMenu";

const AboutMe = () => {
  return (
    <div>
      about me
      <MultipleOptionsMenu
        options={[
          {
            fontAwesomeIcon: "fab fa-github",
            text: "Github",
            action: () => {
              console.log("play-doh");
            },
          },
        ]}
      />
    </div>
  );
};

export default AboutMe;
