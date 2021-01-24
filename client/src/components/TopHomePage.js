import React, { useState, useRef, Fragment } from "react";
import "react-mde/lib/styles/css/react-mde-all.css";
import { Button, Icon } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import PostForm from "./PostForm";

const options = [
  "Default Sort",
  "Most Recent",
  "Most Liked",
  "Most Commented",
  "Oldest",
];

const TopHomePage = (props) => {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isNewPostFormShown, toggleNewPostForm] = useState(false);

  const handleClick = () => {
    console.info(`You clicked ${options[selectedIndex]}`);
  };

  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index);
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  return (
    <Fragment>
      <div className="top-navigation">
        <Grid
          container
          justify={`${isNewPostFormShown ? "flex-end" : "space-between"}`}
        >
          {!isNewPostFormShown && (
            <Grid item xs={6} sm={6} md={6}>
              <Button
                color="secondary"
                variant="contained"
                onClick={() => toggleNewPostForm(true)}
              >
                <Icon
                  className="fas fa-plus-circle"
                  style={{ marginRight: "15px" }}
                />{" "}
                New Post
              </Button>
            </Grid>
          )}
          <Grid container xs={6} sm={6} md={6} justify="flex-end">
            <Grid item>
              <ButtonGroup
                variant="contained"
                color="primary"
                ref={anchorRef}
                aria-label="split button"
              >
                <Button variant="contained" onClick={handleClick}>
                  {options[selectedIndex]}
                </Button>
                <Button
                  color="primary"
                  size="small"
                  aria-controls={open ? "split-button-menu" : undefined}
                  aria-expanded={open ? "true" : undefined}
                  aria-label="select merge strategy"
                  aria-haspopup="menu"
                  onClick={handleToggle}
                >
                  <ArrowDropDownIcon />
                </Button>
              </ButtonGroup>
              <Popper
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
              >
                {({ TransitionProps, placement }) => (
                  <Grow
                    {...TransitionProps}
                    style={{
                      transformOrigin:
                        placement === "bottom" ? "center top" : "center bottom",
                    }}
                  >
                    <Paper>
                      <ClickAwayListener onClickAway={handleClose}>
                        <MenuList id="split-button-menu">
                          {options.map((option, index) => (
                            <MenuItem
                              key={option}
                              selected={index === selectedIndex}
                              onClick={(event) =>
                                handleMenuItemClick(event, index)
                              }
                            >
                              {option}
                            </MenuItem>
                          ))}
                        </MenuList>
                      </ClickAwayListener>
                    </Paper>
                  </Grow>
                )}
              </Popper>
            </Grid>
          </Grid>
        </Grid>
      </div>
      <div className={`new-post ${isNewPostFormShown ? "form-showing" : ""}`}>
        {isNewPostFormShown && (
          <PostForm
            cancelAction={() => toggleNewPostForm(false)}
            successAction={() => toggleNewPostForm(false)}
          />
        )}
      </div>
    </Fragment>
  );
};

TopHomePage.propTypes = {};

export default TopHomePage;
