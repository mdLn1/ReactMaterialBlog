import {
  Grid,
  IconButton,
  FormControlLabel,
  Switch,
  Checkbox,
} from "@material-ui/core";
import React, { useState } from "react";
import MultipleOptionsMenu from "../customizedElements/MultipleOptionsMenu";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowDropUpSharpIcon from "@material-ui/icons/ArrowDropUpSharp";
import moment from "moment";

const RelatedReport = ({
  _id,
  reason,
  contentId,
  reportedDate,
  selectedReportId,
  handleSelect,
  isSelected,
}) => {
  const [isReasonRevealed, toggleReasonRevealed] = useState(false);

  const menuOptions = [
    {
      fontAwesomeIcon: "fas fa-minus-circle",
      text: "Ignore",
      action: () => {},
    },
    {
      fontAwesomeIcon: "fas fa-user",
      text: "View Reporter",
      action: () => {},
    },
  ];

  return (
    <div
      className={_id === selectedReportId ? "report selected-report" : "report"}
    >
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="center"
        className="report-header"
      >
        <Grid item className="reason" xl={6} lg={6} md={6}>
          {reason}
        </Grid>
        <Grid item className="report-options">
          <FormControlLabel
            control={
              <Checkbox
                checked={isSelected}
                onChange={() => {
                  handleSelect(_id);
                }}
                name="select"
              />
            }
            label="Select"
            labelPlacement="start"
          />{" "}
          {moment(reportedDate).fromNow()}
          <IconButton
            aria-label="reveal reason"
            component="span"
            onClick={() => toggleReasonRevealed(!isReasonRevealed)}
          >
            {isReasonRevealed ? (
              <ArrowDropUpSharpIcon fontSize="large" />
            ) : (
              <ArrowDropDownIcon fontSize="large" />
            )}
          </IconButton>
          <MultipleOptionsMenu
            iconStyle={{ fontSize: "0.9rem" }}
            options={menuOptions}
          />
        </Grid>
      </Grid>
      {isReasonRevealed && <div className="report-body">{reason}</div>}
    </div>
  );
};

export default RelatedReport;
