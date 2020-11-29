import React from "react";
import { Button, Icon } from "@material-ui/core";
import News from "./News";
import NewQuickNews from "./NewQuickNews";

const SideContainer = () => {
  return (
    <section className="right">
      <div className="subscribe-prompt">
        <div>If you want to receive email updates you can subscribe below.</div>
        <div>
          <Button color="primary">Subscribe</Button>
        </div>
      </div>
      <NewQuickNews />
      {[1, 2, 3, 4].map((el, index) => (
        <News key={index} />
      ))}
    </section>
  );
};

export default SideContainer;
