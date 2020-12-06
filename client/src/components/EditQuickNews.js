import React, { useState } from "react";
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
import DateFnsUtils from "@date-io/date-fns";
import { findNumberOfMdImages } from "../utils/matchMDImagePattern";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import CustomContainedButton from "./customizedElements/CustomContainedButton";
import ValidationTextField from "./customizedElements/ValidationTextField";

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
}));

const converter = new Showdown.Converter({
  tables: true,
  simplifiedAutoLink: true,
  strikethrough: true,
  tasklists: true,
});

const EditQuickNews = ({ content, title, cancelAction, submitAction }) => {
  const classes = useStyles();

  let newsTitleProps = { defaultValue: title };
  const [value, setValue] = useState(content);
  const [selectedTab, setSelectedTab] = useState("write");
  return (
    <article className="hot-news">
      <Container disableGutters>
        <div className={classes.paper}>
          <Typography component="h3" variant="h5">
            Edit News
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
              label="News Title"
              name="newsTitle"
              {...newsTitleProps}
            />
            <ValidationTextField
              variant="outlined"
              margin="normal"
              id="news-link"
              fullWidth
              placeholder="Link used when user clicks"
              label="Wrap link around post"
              name="newsLink"
            />
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                margin="normal"
                id="date-picker-start-news"
                label="Start displaying on"
                format="MM/dd/yyyy"
                fullWidth
                required
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
              />
              <KeyboardDatePicker
                margin="normal"
                id="date-picker-end-news"
                label="Final date to display"
                format="MM/dd/yyyy"
                fullWidth
                required
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
              />
            </MuiPickersUtilsProvider>
            <ReactMde
              value={value}
              onChange={setValue}
              selectedTab={selectedTab}
              onTabChange={setSelectedTab}
              generateMarkdownPreview={(markdown) => {
                if (findNumberOfMdImages(markdown) > 1)
                  console.log("max 1 image");
                return Promise.resolve(converter.makeHtml(markdown));
              }}
            />

            <Grid container spacing={2} id="news-submission">
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <CustomContainedButton
                  variant="contained"
                  fullWidth
                  onClick={() => cancelAction(false)}
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
                  variant="contained"
                  color="success"
                  onClick={() => submitAction(false)}
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
    </article>
  );
};

EditQuickNews.propTypes = {};

export default EditQuickNews;