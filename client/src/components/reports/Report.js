import React, { useState, useContext, useEffect } from "react";
import Modal from "@material-ui/core/Modal";
import MainContext from "../../contexts/main/mainContext";
import { useSnackbar } from "notistack";
import axios from "axios";
import { SNACKBAR_AUTO_HIDE_DURATION } from "../../AppSettings";
import { asyncRequestErrorHandler } from "../../utils/asyncRequestHelper";
import { REPORT_ROUTE } from "../../httpRoutes";
import { Icon, Grid, CircularProgress } from "@material-ui/core";
import CustomContainedButton from "../customizedElements/CustomContainedButton";
import { isReportReasonValid } from "../../utils/customValidators";
import { REPORT_REASON_ERROR } from "../../utils/inputErrorMessages";

const Report = () => {
  const source = axios.CancelToken.source();

  const [reason, setReason] = useState("");
  let submissionButtonProps = { disabled: true };
  const [isLoading, toggleLoading] = useState(false);
  const [isReasonError, toggleReasonError] = useState(false);

  const [responseErrors, setResponseErrors] = useState([]);

  const mainContext = useContext(MainContext);
  const { report, closeReport } = mainContext;
  const { enqueueSnackbar } = useSnackbar();

  // events
  useEffect(() => {
    return () => {
      toggleLoading(false);
      source.cancel();
    };
  }, []);

  // action handlers
  const handleClose = () => {
    setReason("");
    closeReport();
  };

  const handleReasonChange = ({ target: { value } }) => {
    setReason(value);
    toggleReasonError(!isReportReasonValid(value));
  };

  const handleReportSubmit = (e) => {
    e.preventDefault();
    if (isReportReasonValid(reason)) {
      const requestData = {
        reason: reason,
      };
      toggleLoading(true);
      axios
        .post(
          REPORT_ROUTE + report.contentType + "/" + report.contentId,
          requestData,
          { cancelToken: source.token }
        )
        .then((response) => {
          enqueueSnackbar("Report submitted successfully", {
            variant: "success",
            autoHideDuration: SNACKBAR_AUTO_HIDE_DURATION,
          });
          handleClose();
        })
        .catch((error) => {
          if (axios.isCancel(error)) {
            console.log("request canceled");
          } else {
            const { errors, status } = asyncRequestErrorHandler(error);
            if (status === 400) {
              setResponseErrors(errors);
            } else {
              errors.forEach((el) =>
                enqueueSnackbar(el, {
                  variant: "error",
                  autoHideDuration: SNACKBAR_AUTO_HIDE_DURATION,
                })
              );
            }
          }
        })
        .finally(() => {
          toggleLoading(false);
        });
    } else {
      toggleReasonError(!isReportReasonValid(reason));
    }
  };

  if (isLoading || isReasonError) {
    submissionButtonProps.disabled = true;
  } else {
    submissionButtonProps.disabled = false;
  }

  const body = (
    <div className="report-modal-body">
      <h2 id="report-modal-title">Reporting {report.contentType}</h2>
      {isLoading && <CircularProgress />}
      {responseErrors.length > 0 && (
        <ul className="errors">
          {responseErrors.map((el, index) => (
            <li key={index}>{el}</li>
          ))}
        </ul>
      )}
      <form onSubmit={handleReportSubmit} noValidate autoComplete="off">
        <textarea
          className="report-text"
          placeholder="Write the reason for reporting..."
          onChange={(e) => handleReasonChange(e)}
        />

        {isReasonError && <p className="error">{REPORT_REASON_ERROR}</p>}

        <Grid container spacing={4} id={"report-submission"}>
          <Grid item xs={12} sm={6} md={6} lg={6}>
            <CustomContainedButton
              variant="contained"
              fullWidth
              onClick={() => {
                handleClose();
              }}
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
              type="submit"
              variant="contained"
              color="success"
              {...submissionButtonProps}
            >
              Submit
              <Icon
                className="fas fa-check-circle"
                style={{ marginLeft: "15px" }}
              />
            </CustomContainedButton>
          </Grid>
        </Grid>
      </form>
    </div>
  );

  return (
    <div>
      <Modal
        open={report.open}
        onClose={handleClose}
        aria-labelledby="report-modal-title"
        aria-describedby="report-modal-description"
      >
        {body}
      </Modal>
    </div>
  );
};

export default Report;
