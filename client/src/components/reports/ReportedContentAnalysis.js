import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  FormGroup,
  FormLabel,
  FormControl,
  FormControlLabel,
  FormHelperText,
  RadioGroup,
  Radio,
  Icon,
  Checkbox,
  Typography,
  Button,
  Container,
} from "@material-ui/core";
import Pagination from "@material-ui/lab/Pagination";
import { useSnackbar } from "notistack";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import RelatedReport from "./RelatedReport";
import ReportedPost from "./ReportedPost";
import ReportedNews from "./ReportedNews";
import ReportedComment from "./ReportedComment";
import MultipleOptionsMenu from "../customizedElements/MultipleOptionsMenu";
import CustomContainedButton from "../customizedElements/CustomContainedButton";
import ValidationTextField from "../customizedElements/ValidationTextField";
import { asyncRequestErrorHandler } from "../../utils/asyncRequestHelper";
import { SNACKBAR_AUTO_HIDE_DURATION } from "../../AppSettings";
import {
  CONTENT_TYPES,
  DEFAULT_DAYS_USER_CONTENT_CREATION_RESTRICTED,
} from "../../constants";

const ReportedContentAnalysis = ({
  displayContentType,
  displayContentData,
  selectedReportId,
}) => {
  // constants
  const source = axios.CancelToken.source();
  const { enqueueSnackbar } = useSnackbar();

  const contentMenuOptions = [
    {
      fontAwesomeIcon: "fas fa-flag",
      text: "View Reports",
      action: () => {
        handleClickToViewRelatedReports(
          displayContentType,
          displayContentData._id
        );
      },
    },
    {
      fontAwesomeIcon: "fas fa-user",
      text: "View Author",
      action: () => {},
    },
  ];

  // state changes
  const [solution, setSolution] = useState("");
  const [reportsPageNumber, setReportsPageNumber] = useState(0);
  const [reportsTotalPages, setReportsTotalPages] = useState(0);
  const [userRestrictionOption, setUserRestriction] = useState("1");
  const [isAccordionExpanded, toggleAccordionExpanded] = useState(false);
  const [isLoading, toggleLoading] = useState(false);
  const [relatedReports, setRelatedReports] = useState([]);
  const [totalRelatedReports, setTotalRelatedReports] = useState(0);
  const [selectedReports, adjustSelectedReports] = useState([]);
  const [
    isPreventUserFromPostingAgain,
    togglePreventUserFromPostingAgain,
  ] = useState(false);

  // events
  useEffect(() => {
    setTotalRelatedReports(0);
    adjustSelectedReports([]);
    togglePreventUserFromPostingAgain(false);
    toggleAccordionExpanded(false);
    setUserRestriction("1");
    setSolution("");
  }, [selectedReportId]);
  
  // action handlers
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handlePageChange = (event, pageNumber) => {
    setReportsPageNumber(pageNumber);
  };

  const handleSolutionChange = (e) => {
    e.preventDefault();
    setSolution(e.target.value);
  };

  const handleUserRestrictionChange = (e) => {
    e.preventDefault();
    setUserRestriction(e.target.value);
  };

  const handleSelectAllReports = () => {
    if (selectedReports.length === totalRelatedReports) {
      adjustSelectedReports([]);
    } else {
      adjustSelectedReports(relatedReports.map((el) => el._id));
    }
  };

  const handleSelectedReports = (reportId) => {
    if (selectedReports.indexOf(reportId) > -1) {
      adjustSelectedReports(selectedReports.filter((el) => el !== reportId));
    } else {
      adjustSelectedReports(selectedReports.concat([reportId]));
    }
  };

  const handleClickToViewRelatedReports = (contentType, contentId) => {
    toggleLoading(true);
    let url = `api/reports/${contentId}/?contentType=${contentType}`;

    axios
      .get(url, { cancelToken: source.token })
      .then((response) => {
        setRelatedReports(response.data.reports);
        setTotalRelatedReports(response.data.totalReportsCount);
        if (response.data.totalPages) {
          setReportsTotalPages(response.data.totalPages);
          setReportsPageNumber(1);
        }
      })
      .catch((error) => {
        if (axios.isCancel(error)) {
          console.log("request canceled");
        } else {
          const { errors, status } = asyncRequestErrorHandler(error);

          errors.forEach((el) =>
            enqueueSnackbar(el, {
              variant: "error",
              autoHideDuration: SNACKBAR_AUTO_HIDE_DURATION,
            })
          );
        }
      })
      .finally(() => {
        toggleLoading(false);
      });
  };

  return (
    <Fragment>
      <h3>
        Viewing reported {displayContentType.toUpperCase()}{" "}
        {displayContentData._id}
      </h3>
      <div className="reported-element-container">
        <span className="reported-content-options">
          <MultipleOptionsMenu
            iconStyle={{ fontSize: "0.9rem" }}
            options={contentMenuOptions}
          />
        </span>
        {displayContentType === CONTENT_TYPES[0] && (
          <ReportedPost {...displayContentData} />
        )}
        {displayContentType === CONTENT_TYPES[1] && (
          <ReportedNews {...displayContentData} />
        )}
        {displayContentType === CONTENT_TYPES[2] && (
          <ReportedComment {...displayContentData} />
        )}
      </div>
      <div className="solutions">
        <Accordion
          expanded={isAccordionExpanded}
          onChange={() => {
            toggleAccordionExpanded(!isAccordionExpanded);
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="solutions-content"
          >
            <Typography>See available solutions</Typography>
          </AccordionSummary>
          <AccordionDetails className="solutions-content">
            <form onSubmit={handleSubmit}>
              <FormControl component="fieldset">
                <RadioGroup
                  aria-label="solution"
                  name="solution"
                  value={solution}
                  onChange={handleSolutionChange}
                >
                  <FormControlLabel
                    value="1"
                    control={<Radio />}
                    label="Edit and Dismiss"
                  />
                  <FormHelperText>
                    Edit the reported content and dismiss all the reports
                    related to it.
                  </FormHelperText>
                  <FormControlLabel
                    value="2"
                    control={<Radio />}
                    label="Delete and Dismiss"
                  />
                  <FormHelperText>
                    Delete the reported content and dismiss all the reports
                    related to it.
                  </FormHelperText>
                </RadioGroup>
                <FormGroup>
                  <FormControlLabel
                    value="1"
                    control={
                      <Checkbox
                        color="primary"
                        onChange={() => {
                          togglePreventUserFromPostingAgain(
                            !isPreventUserFromPostingAgain
                          );
                        }}
                        checked={isPreventUserFromPostingAgain}
                      />
                    }
                    label="Prevent author from creating content again"
                    labelPlacement="end"
                  />
                </FormGroup>
                {(isPreventUserFromPostingAgain || "") && (
                  <RadioGroup
                    aria-label="user-restriction"
                    name="user-restriction"
                    className="user-restriction-options"
                    value={userRestrictionOption}
                    onChange={handleUserRestrictionChange}
                  >
                    <FormControlLabel
                      value="1"
                      control={<Radio />}
                      label="Temporary"
                    />
                    <FormHelperText>
                      Prevent user from creating content for the number of days
                      below.
                    </FormHelperText>
                    <ValidationTextField
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      id="user-restriction-days"
                      label="Days"
                      defaultValue={
                        DEFAULT_DAYS_USER_CONTENT_CREATION_RESTRICTED
                      }
                      name="user-restriction-days"
                      type="number"
                    />
                    <FormControlLabel
                      value="2"
                      control={<Radio />}
                      label="Permanently"
                    />
                    <FormHelperText>
                      This will prevent the user from ever posting again.
                    </FormHelperText>
                  </RadioGroup>
                )}
                <CustomContainedButton
                  variant="contained"
                  fullWidth
                  disabled={!solution}
                  type="submit"
                  color="success"
                >
                  {" "}
                  Resolve{" "}
                  <Icon
                    className="fas fa-check-circle"
                    style={{ marginLeft: "10px" }}
                  />
                </CustomContainedButton>
              </FormControl>
            </form>
          </AccordionDetails>
        </Accordion>
      </div>
      {(totalRelatedReports || "") && (
        <Fragment>
          <h3>
            Viewing reports for {displayContentType.toUpperCase()}{" "}
            {displayContentData._id}
          </h3>
          <div>Found total {totalRelatedReports} related reports</div>
          <FormGroup row>
            <FormControlLabel
              value="Select All"
              control={
                <Checkbox
                  color="primary"
                  onChange={handleSelectAllReports}
                  checked={selectedReports.length === totalRelatedReports}
                />
              }
              label="Select All"
              labelPlacement="start"
            />
            {selectedReports.length ? (
              <FormControlLabel
                value={`Selected ${selectedReports.length}`}
                control={<Checkbox color="primary" checked />}
                label={`Selected ${selectedReports.length}`}
                labelPlacement="start"
              />
            ) : (
              ""
            )}
          </FormGroup>
          <Container className="selected-reports-options">
            <Grid
              container
              direction="row"
              justify="center"
              alignItems="center"
            >
              <Grid container item xs={12} spacing={3}>
                <Button
                  disabled={!selectedReports.length}
                  variant="outlined"
                  color="primary"
                >
                  Ignore Selected
                </Button>
              </Grid>
              <Grid container item xs={12} spacing={3}></Grid>
              <Grid container item xs={12} spacing={3}></Grid>
            </Grid>
          </Container>
          {relatedReports.map((el) => (
            <RelatedReport
              key={el._id}
              {...el}
              selectedReportId={selectedReportId}
              isSelected={selectedReports.includes(el._id)}
              handleSelect={handleSelectedReports}
            />
          ))}
          {reportsTotalPages !== 0 && reportsPageNumber !== 0 ? (
            <Pagination
              className="pagination"
              count={reportsTotalPages}
              page={reportsPageNumber}
              onChange={handlePageChange}
              shape="round"
              size="medium"
              color="primary"
              showFirstButton
              showLastButton
            />
          ) : (
            <h2>No reports were found.</h2>
          )}
        </Fragment>
      )}
    </Fragment>
  );
};

export default ReportedContentAnalysis;
