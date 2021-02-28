import React, { useState, Fragment, useEffect, useContext } from "react";
import { Button, Icon, Typography, Grid } from "@material-ui/core";
import { useSnackbar } from "notistack";
import { makeStyles } from "@material-ui/core/styles";
import News from "./News";
import MainContext from "../contexts/main/mainContext";
import { SNACKBAR_AUTO_HIDE_DURATION } from "../AppSettings";
import asyncRequestSender from "../utils/asyncRequestSender";
import { NEWS_ROUTE } from "../httpRoutes";
import NewQuickNews from "./NewQuickNews";
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

const SideContainer = () => {
  const classes = useStyles();
  const mainContext = useContext(MainContext);
  const { enqueueSnackbar } = useSnackbar();

  const { news, addNews } = mainContext;

  useEffect(() => {
    if (!news?.length)
      (async () => {
        const { isSuccess, errors, status, data } = await asyncRequestSender(
          NEWS_ROUTE,
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
          addNews(data.news);
        }
      })();
  }, []);

  const [isContactFormDisplayed, toggleContactFormDisplay] = useState(false);
  return (
    <section className="right-container">
      <div className="subscribe-prompt">
        <div>If you want to receive email updates you can subscribe below.</div>
        <div>
          <Button color="primary">Subscribe</Button>
        </div>
      </div>
      <div className="subscribe-prompt">
        <div>
          We like to provide free quality content and any support is well
          appreciated.
        </div>
        <div>
          <Button color="primary">Donate</Button>
        </div>
      </div>
      <div className="contact-form">
        {isContactFormDisplayed ? (
          <Fragment>
            <form
              className={classes.form}
              onSubmit={(e) => {
                e.preventDefault();
              }}
              noValidate
              autoComplete="off"
            >
              <Typography component="h2" variant="h5">
                Message
              </Typography>
              <ValidationTextField
                variant="outlined"
                margin="normal"
                fullWidth
                id="contact-title"
                label="Title"
                name="contactTitle"
              />
              <ValidationTextField
                variant="outlined"
                margin="normal"
                fullWidth
                id="contact-content"
                label="Content"
                name="contactContent"
                multiline
                rows={4}
              />
              <Grid container spacing={1} id="new-message-submission">
                <Grid item xs={12} sm={6} md={6} xl={12}>
                  <CustomContainedButton
                    variant="contained"
                    fullWidth
                    onClick={() => toggleContactFormDisplay(false)}
                    color="error"
                  >
                    {" "}
                    Cancel{" "}
                    <Icon
                      className="fas fa-times-circle"
                      style={{ marginLeft: "10px" }}
                    />
                  </CustomContainedButton>
                </Grid>
                <Grid item xs={12} sm={6} md={6} xl={12}>
                  <CustomContainedButton
                    fullWidth
                    variant="contained"
                    color="success"
                    onClick={() => toggleContactFormDisplay(false)}
                  >
                    {" "}
                    Submit{" "}
                    <Icon
                      className="fas fa-check-circle"
                      style={{ marginLeft: "10px" }}
                    />
                  </CustomContainedButton>
                </Grid>
              </Grid>
            </form>
          </Fragment>
        ) : (
          <Fragment>
            <div>Do you have any suggestions or you want to get in touch?</div>
            <div>
              <Button
                color="primary"
                onClick={() => {
                  toggleContactFormDisplay(true);
                }}
              >
                Contact
              </Button>
            </div>
          </Fragment>
        )}
      </div>
      <NewQuickNews />
      {news.map((el, index) => (
        <News key={el._id} {...el}/>
      ))}
    </section>
  );
};

export default SideContainer;
