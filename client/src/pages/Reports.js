import React, { useState, useRef, useEffect } from "react";
import "react-mde/lib/styles/css/react-mde-all.css";
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
import { REPORT_ROUTE } from "../httpRoutes";
import asyncRequestSender from "../utils/asyncRequestSender";
import { useSnackbar } from "notistack";
import MainContext from "../contexts/main/mainContext";
import { SNACKBAR_AUTO_HIDE_DURATION } from "../AppSettings";

const options = [
  "Most Recent",
  "Comment Reports",
  "Post Reports",
  "News Reports",
  "Most Recent Dismissed",
];

const Reports = () => {
  const [reports, setReports] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (!reports?.length)
      (async () => {
        const { isSuccess, errors, status, data } = await asyncRequestSender(
          `${REPORT_ROUTE}`,
          0
        );
        if (!isSuccess) {
          errors.forEach((el) =>
            enqueueSnackbar(el, {
              variant: "error",
              autoHideDuration: SNACKBAR_AUTO_HIDE_DURATION,
            })
          );
        } else {
          setReports(data.reports);
        }
      })();
  }, []);

  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

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
    <div className="reports-container">
      <Grid container justify="space-around" spacing={2}>
        <Grid container item xs={12} sm={6} md={6} lg={6} justify="flex-end">
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
          </ButtonGroup>
        </Grid>
        <Grid container item sm={6} md={6} lg={6}></Grid>
      </Grid>
      <Grid container justify="space-around" spacing={2}>
        <Grid direction="column" container item xs={12} sm={6} md={6} lg={5}>
          {reports.map((el) => (
            <div key={el._id}>{el.reason}</div>
          ))}
        </Grid>
        <Grid direction="column" container item xs={12} sm={6} md={6} lg={5}>
          blah
        </Grid>
      </Grid>
    </div>
  );
};

export default Reports;
