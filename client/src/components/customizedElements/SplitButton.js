import React, { useState, useRef, useEffect, Fragment } from "react";
import "react-mde/lib/styles/css/react-mde-all.css";
import PropTypes from "prop-types";

import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import {
  Grow,
  Grid,
  ButtonGroup,
  Paper,
  Popper,
  MenuItem,
  MenuList,
  Button,
  ClickAwayListener,
} from "@material-ui/core";

const SplitButton = ({ options, selectedItemIndexChanged }) => {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleClick = () => {
    console.info(`You clicked ${options[selectedIndex]}`);
  };

  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index);
    if (selectedItemIndexChanged) selectedItemIndexChanged(index);
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
      <ButtonGroup
        variant="contained"
        color="primary"
        ref={anchorRef}
        className="split-button"
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
        className="popper-split-button"
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
                      onClick={(event) => handleMenuItemClick(event, index)}
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
    </Fragment>
  );
};

SplitButton.propTypes = {
  options: PropTypes.array.isRequired,
};

SplitButton.defaultProps = {
  options: ["No", "options", "added"],
};

export default SplitButton;
