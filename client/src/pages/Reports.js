import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";
import "react-mde/lib/styles/css/react-mde-all.css";
import { Grid } from "@material-ui/core";
import Pagination from "@material-ui/lab/Pagination";
import { REPORT_ROUTE } from "../httpRoutes";
import { asyncRequestErrorHandler } from "../utils/asyncRequestHelper";
import { useSnackbar } from "notistack";
import { CONTENT_TYPES } from "../constants";
import { SNACKBAR_AUTO_HIDE_DURATION } from "../AppSettings";
import SplitButton from "../components/customizedElements/SplitButton";
import DisplayReport from "../components/reports/DisplayReport";
import ReportedContentAnalysis from "../components/reports/ReportedContentAnalysis";

const options = [
  "Most Recent",
  "Comment Reports",
  "Post Reports",
  "News Reports",
  "Most Recent Dismissed",
];

const Reports = () => {
  // constants
  const source = axios.CancelToken.source();

  // state changes
  const [reports, setReports] = useState([]);
  const [reportsPageNumber, setReportsPageNumber] = useState(0);
  const [reportsTotalPages, setReportsTotalPages] = useState(0);
  const [isLoading, toggleLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [displayContentData, setDisplayContentData] = useState({});
  const [displayContentType, setDisplayContentType] = useState("");
  const [selectedReportId, setSelectedReportId] = useState(null);

  // events
  useEffect(() => {
    toggleLoading(true);
    axios
      .get(`${REPORT_ROUTE}`, { cancelToken: source.token })
      .then((response) => {
        setReports(response.data.reports);
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

    return () => {
      toggleLoading(false);
      source.cancel();
    };
  }, []);

  // action handlers

  const handlePageChange = (event, pageNumber) => {
    setReportsPageNumber(pageNumber);
  };

  const handleClickToViewContent = (contentType, contentId, reportId) => {
    toggleLoading(true);
    // different url formation based on resource
    let url = `api/${
      contentType === CONTENT_TYPES[1] ? contentType : contentType + "s"
    }/${contentId}`;

    setSelectedReportId(reportId);

    axios
      .get(url, { cancelToken: source.token })
      .then((response) => {
        setDisplayContentData(response.data);
        setDisplayContentType(contentType);
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
    <div className="reports-container">
      <Grid container spacing={1}>
        <Grid container item xs={12} sm={6} md={6} lg={6} justify="flex-end">
          <SplitButton
            options={options}
            selectedItemIndexChanged={(val) => {
              console.log(val);
            }}
          />
        </Grid>
        <Grid container item sm={6} md={6} lg={6}></Grid>
      </Grid>
      <Grid container justify="space-around" spacing={2}>
        <Grid direction="column" container item xs={12} sm={6} md={6} lg={5}>
          {reports.map((el) => (
            <DisplayReport
              key={el._id}
              {...el}
              handleClickToViewContent={handleClickToViewContent}
              selectedReportId={selectedReportId}
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
        </Grid>
        <Grid direction="column" container item xs={12} sm={6} md={6} lg={5}>
          {!displayContentType ? (
            <h3>Select a report to view reported content</h3>
          ) : (
            <ReportedContentAnalysis
              displayContentType={displayContentType}
              displayContentData={displayContentData}
              selectedReportId={selectedReportId}
            />
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default Reports;
