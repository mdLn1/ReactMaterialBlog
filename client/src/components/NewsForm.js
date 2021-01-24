// libraries
import React, { useState } from "react";
import PropTypes from "prop-types";
import ReactMde from "react-mde";
import * as Showdown from "showdown";
import "react-mde/lib/styles/css/react-mde-all.css";
import { useSnackbar } from "notistack";
import {
  Button,
  Icon,
  Container,
  Typography,
  Grid,
  CircularProgress,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";

// project items
import { findNumberOfMdImages } from "../utils/matchMDImagePattern";
import CustomContainedButton from "./customizedElements/CustomContainedButton";
import {
  NEWS_CONTENT_ERROR,
  NEWS_TITLE_ERROR,
  NEWS_END_DATE_ERROR,
  NEWS_START_DATE_ERROR,
  NEWS_WRAP_LINK_ERROR,
} from "../utils/inputErrorMessages";
import ValidationTextField from "./customizedElements/ValidationTextField";
import {
  isStartDateValid,
  isNewsContentValid,
  isNewsTitleValid,
  isWrapLinkValid,
} from "../utils/customValidators";
import { compareDates } from "../utils/dateHelper";
import { NEWS_ROUTE } from "../httpRoutes";
import asyncRequestSender from "../utils/asyncRequestSender";
import { SNACKBAR_AUTO_HIDE_DURATION } from "../AppSettings";

// styling
const useStyles = makeStyles((theme) => ({
  paper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: "10px",
  },
  form: {
    width: "100%",
    margin: theme.spacing(0, 0, 2),
  },
  loader: {
    margin: theme.spacing(2, 1, 1),
  },
}));

const converter = new Showdown.Converter({
  tables: true,
  simplifiedAutoLink: true,
  strikethrough: true,
  tasklists: true,
});

const NewsForm = ({
  isBeingEdited,
  content,
  title,
  fromDate,
  untilDate,
  wrapLink,
  cancelAction,
  successAction,
}) => {
  // setup
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  // fields
  let newsTitleFieldProps = {};
  let newsStartDateFieldProps = {};
  let newsEndDateFieldProps = {};
  let newsWrapLinkFieldProps = {};
  let submissionButtonFieldProps = { disabled: true };

  // form values
  const [newsTitle, setNewsTitle] = useState(isBeingEdited ? title : "");
  const [newsContent, setNewsContent] = useState(isBeingEdited ? content : "");
  const [selectedStartDate, setSelectedStartDate] = React.useState(
    isBeingEdited ? fromDate : new Date()
  );
  const [selectedEndDate, setSelectedEndDate] = React.useState(
    isBeingEdited ? untilDate : new Date()
  );
  const [newsWrapLink, setWrapLink] = React.useState(
    isBeingEdited ? wrapLink : ""
  );
  const [isLoading, toggleLoading] = useState(false);

  const [isNewQuickNewsFormShown, toggleAddNewsForm] = useState(false);
  const [selectedTab, setSelectedTab] = useState("write");

  // form values errors
  const [isStartDateError, toggleStartDateError] = useState(false);
  const [isEndDateError, toggleEndDateError] = useState(false);
  const [isTitleError, toggleTitleError] = useState(false);
  const [isContentError, toggleContentError] = useState(false);
  const [isWrapLinkError, toggleWrapLinkError] = useState(false);
  const [responseErrors, setResponseErrors] = useState([]);

  // action handlers
  const handleStartDateChange = (date) => {
    toggleStartDateError(!isStartDateValid(date));
    if (compareDates(date, selectedEndDate) === -1) toggleEndDateError(true);
    else toggleEndDateError(false);
    setSelectedStartDate(date);
  };

  const handleEndDateChange = (date) => {
    if (compareDates(date, selectedStartDate) === 1) toggleEndDateError(true);
    else toggleEndDateError(false);
    setSelectedEndDate(date);
  };

  const handleTitleChange = ({ target: { value } }) => {
    setNewsTitle(value);
    toggleTitleError(!isNewsTitleValid(value));
  };
  const handleContentChange = (value) => {
    setNewsContent(value);
    toggleContentError(!isNewsContentValid(value));
  };
  const handleWrapLinkChange = ({ target: { value } }) => {
    setWrapLink(value);
    if (!value) toggleWrapLinkError(false);
    else toggleWrapLinkError(!isWrapLinkValid(value));
  };

  const handleNewsSubmit = async (e) => {
    e.preventDefault();
    toggleLoading(true);
    if (
      isNewsTitleValid(newsTitle) &&
      isNewsContentValid(newsContent) &&
      isStartDateValid(selectedStartDate) &&
      compareDates(selectedEndDate, selectedStartDate) !== 1 &&
      (!newsWrapLink || isWrapLinkValid(newsWrapLink))
    ) {
      const requestData = {
        title: newsTitle,
        content: newsContent,
        displayFromDate: selectedStartDate,
        displayUntilDate: selectedEndDate,
        wrapLink: !newsWrapLink ? "" : newsWrapLink,
      };

      const { isSuccess, errors, status, data } = isBeingEdited
        ? await asyncRequestSender(NEWS_ROUTE, requestData, 2)
        : await asyncRequestSender(NEWS_ROUTE, requestData, 1);
      if (isSuccess) {
        enqueueSnackbar(
          isBeingEdited
            ? "News updated successfully."
            : "News created successfully.",
          {
            variant: "success",
            autoHideDuration: SNACKBAR_AUTO_HIDE_DURATION,
          }
        );
        if (successAction) successAction();
      } else {
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
    } else {
      toggleTitleError(!isNewsTitleValid(newsTitle));
      toggleContentError(!isNewsContentValid(newsContent));
      toggleStartDateError(!isStartDateValid(selectedStartDate));
      if (compareDates(selectedStartDate, selectedEndDate) === -1)
        toggleEndDateError(true);
      else toggleEndDateError(false);
      if (!newsWrapLink) toggleWrapLinkError(false);
      else toggleWrapLinkError(!isWrapLinkValid(newsWrapLink));
    }
    toggleLoading(false);
  };

  // handling errors display
  if (isTitleError) {
    newsTitleFieldProps = {
      error: true,
      helperText: NEWS_TITLE_ERROR,
    };
  }
  if (isStartDateError) {
    newsStartDateFieldProps = {
      error: true,
      helperText: NEWS_START_DATE_ERROR,
    };
  }
  if (isEndDateError) {
    newsEndDateFieldProps = {
      error: true,
      helperText: NEWS_END_DATE_ERROR,
    };
  }
  if (isWrapLinkError) {
    newsWrapLinkFieldProps = {
      error: true,
      helperText: NEWS_WRAP_LINK_ERROR,
    };
  }

  if (
    isTitleError ||
    isContentError ||
    isStartDateError ||
    isEndDateError ||
    isWrapLinkError ||
    isLoading
  ) {
    submissionButtonFieldProps.disabled = true;
  } else {
    submissionButtonFieldProps.disabled = false;
  }

  // ui component
  return (
    <Container disableGutters>
      <div className={classes.paper}>
        <Typography component="h3" variant="h5">
          {isBeingEdited ? "Edit News" : "Add News"}
        </Typography>
        {isLoading && <CircularProgress className={classes.loader} />}
        {responseErrors.length > 0 && (
          <ul className="errors">
            {responseErrors.map((el, index) => (
              <li key={index}>{el}</li>
            ))}
          </ul>
        )}
        <form
          className={classes.form}
          onSubmit={handleNewsSubmit}
          noValidate
          autoComplete="off"
        >
          <ValidationTextField
            variant="outlined"
            margin="normal"
            id="title"
            required
            fullWidth
            value={newsTitle}
            label="News Title"
            name="newsTitle"
            onChange={(e) => handleTitleChange(e)}
            {...newsTitleFieldProps}
          />
          <ValidationTextField
            variant="outlined"
            margin="normal"
            id="news-link"
            fullWidth
            value={newsWrapLink}
            placeholder="Link used when user clicks"
            label="Wrap link around post"
            name="newsLink"
            onChange={(e) => handleWrapLinkChange(e)}
            {...newsWrapLinkFieldProps}
          />
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              margin="normal"
              id="date-picker-start-news"
              label="Start displaying on"
              format="dd/MM/yyyy"
              value={selectedStartDate}
              onChange={handleStartDateChange}
              fullWidth
              required
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
              {...newsStartDateFieldProps}
            />
            <KeyboardDatePicker
              margin="normal"
              id="date-picker-end-news"
              label="Final date to display"
              format="dd/MM/yyyy"
              value={selectedEndDate}
              onChange={handleEndDateChange}
              fullWidth
              required
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
              {...newsEndDateFieldProps}
            />
          </MuiPickersUtilsProvider>
          <ReactMde
            value={newsContent}
            onChange={handleContentChange}
            selectedTab={selectedTab}
            onTabChange={setSelectedTab}
            generateMarkdownPreview={(markdown) => {
              if (findNumberOfMdImages(markdown) > 1)
                console.log("max 1 image");
              return Promise.resolve(converter.makeHtml(markdown));
            }}
          />
          {isContentError && <p className="error">{NEWS_CONTENT_ERROR}</p>}
          <Grid container spacing={2} id="news-submission">
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <CustomContainedButton
                variant="contained"
                fullWidth
                onClick={() => {
                  if (cancelAction) cancelAction();
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
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <CustomContainedButton
                fullWidth
                type="submit"
                variant="contained"
                color="success"
                {...submissionButtonFieldProps}
              >
                {isBeingEdited ? "Save Changes" : "Submit"}
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
  );
};

NewsForm.propTypes = {};

export default NewsForm;
