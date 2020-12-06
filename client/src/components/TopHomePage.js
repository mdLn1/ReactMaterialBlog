import React, { useState, Fragment } from "react";
import PropTypes from "prop-types";
import ReactMde from "react-mde";
import * as Showdown from "showdown";
import "react-mde/lib/styles/css/react-mde-all.css";
import { Button, Icon } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import ValidationTextField from "./customizedElements/ValidationTextField";
import CustomContainedButton from "./customizedElements/CustomContainedButton";

const useStyles = makeStyles((theme) => ({
  paper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: "10px",
  },
  form: {
    width: "100%",
    margin: theme.spacing(2, 0, 2),
  },
}));

const converter = new Showdown.Converter({
  tables: true,
  simplifiedAutoLink: true,
  strikethrough: true,
  tasklists: true,
});

const options = [
  "Default Sort",
  "Most Recent",
  "Most Liked",
  "Most commented",
  "Oldest",
];

const TopHomePage = (props) => {
  const classes = useStyles();

  let newPostTitleProps = {};
  const [isNewPostFormShown, toggleNewPostForm] = useState(false);
  const [value, setValue] = useState("");
  const [selectedTab, setSelectedTab] = useState("write");
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0);

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
        <Grid container justify={`${isNewPostFormShown ? "flex-end" : "space-between"}`}>
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
          <Container component="main">
            <div className={classes.paper}>
              <Typography component="h1" variant="h5">
                New Post
              </Typography>
              <form
                className={classes.form}
                onSubmit={(e) => {
                  e.preventDefault();
                }}
                noValidate
                autoComplete="off"
              >
                <ValidationTextField
                  variant="outlined"
                  margin="normal"
                  id="title"
                  required
                  fullWidth
                  label="New Post Title"
                  name="postTitle"
                  {...newPostTitleProps}
                />
                <ReactMde
                  value={value}
                  onChange={setValue}
                  selectedTab={selectedTab}
                  onTabChange={setSelectedTab}
                  generateMarkdownPreview={(markdown) =>
                    Promise.resolve(converter.makeHtml(markdown))
                  }
                />

                <Grid container spacing={4} id="new-post-submission">
                  <Grid item xs={12} sm={6} md={6} lg={6}>
                    <CustomContainedButton
                      variant="contained"
                      fullWidth
                      onClick={() => toggleNewPostForm(false)}
                      color="error"
                    >
                      {" "}
                      Cancel{" "}
                      <Icon
                        className="fas fa-times-circle"
                        style={{ marginLeft: "15px" }}
                      />
                    </CustomContainedButton>
                  </Grid>
                  <Grid item xs={12} sm={6} md={6} lg={6}>
                    <CustomContainedButton
                      fullWidth
                      variant="contained"
                      color="success"
                      onClick={() => toggleNewPostForm(false)}
                    >
                      {" "}
                      Submit{" "}
                      <Icon
                        className="fas fa-check-circle"
                        style={{ marginLeft: "15px" }}
                      />
                    </CustomContainedButton>
                  </Grid>
                </Grid>
              </form>
            </div>
          </Container>
        )}
      </div>
    </Fragment>
  );
};

TopHomePage.propTypes = {};

export default TopHomePage;
