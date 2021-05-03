import { Grid, IconButton } from "@material-ui/core";
import React, { useState } from "react";
import MultipleOptionsMenu from "../customizedElements/MultipleOptionsMenu";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowDropUpSharpIcon from "@material-ui/icons/ArrowDropUpSharp";
import moment from "moment";
import Tooltip from "@material-ui/core/Tooltip";

const DisplayReport = ({
  _id,
  contentReportedType,
  reason,
  contentId,
  reportedDate,
  handleClickToViewContent,
  selectedReportId,
}) => {
  const [isReasonRevealed, toggleReasonRevealed] = useState(false);

  const menuOptions = [
    {
      fontAwesomeIcon: "fas fa-book-open",
      text: "View Content",
      action: () => {
        handleClickToViewContent(contentReportedType, contentId, _id);
      },
    },
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
          <Tooltip title={"Click to View"} arrow interactive>
            <span
              className="contentType"
              onClick={() => {
                handleClickToViewContent(contentReportedType, contentId, _id);
              }}
            >
              {contentReportedType}
            </span>
          </Tooltip>
          {reason}
        </Grid>
        <Grid item className="report-options">
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

export default DisplayReport;
