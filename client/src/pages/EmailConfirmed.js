import React, { useState, useEffect, Fragment } from "react";
import Avatar from "@material-ui/core/Avatar";
import { Link, useParams, useLocation } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useSnackbar } from "notistack";
import Box from "@material-ui/core/Box";
import VerifiedUserOutlinedIcon from "@material-ui/icons/VerifiedUserOutlined";
import ErrorOutlinedIcon from "@material-ui/icons/ErrorOutlined";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import { secondary, success, error } from "../AppColors";
import { makeStyles } from "@material-ui/core/styles";
import Copyright from "../components/customizedElements/Copyright";
import { AUTH_ROUTE } from "../httpRoutes";
import asyncRequestSender from "../utils/asyncRequestSender";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: secondary,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    textAlign: "center",
    margin: theme.spacing(3, 0, 2),
  },
}));

const EmailConfirmed = () => {
  const classes = useStyles();
  const [isLoading, toggleLoading] = useState(false);
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  const [responseErrors, setResponseErrors] = useState([]);

  const [successfullyVerified, setSuccessfullyVerified] = useState(false);
  const verifyEmail = async () => {
    toggleLoading(true);
    const currentHref = window.location.href;
    const [_, hash] = currentHref.split("confirm-email/");
    if (hash.length < 10) {
      setSuccessfullyVerified(false);
    } else {
      const requestData = {
        confirmationHash: hash,
      };
      const { isSuccess, errors, status, data } = await asyncRequestSender(
        AUTH_ROUTE + "confirm-email",
        requestData,
        1
      );
      if (isSuccess) {
        enqueueSnackbar("You've confirmed your email.", { variant: "success" });
        setSuccessfullyVerified(true);
      } else {
        if (status === 400) {
          setResponseErrors(errors);
        } else {
          errors.forEach((el) => enqueueSnackbar(el, { variant: "error" }));
        }
      }
    }
    toggleLoading(false);
  };
  useEffect(() => {
    verifyEmail();
  }, [location]);

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        {!isLoading ? (
          <Fragment>
            <Avatar
              className={classes.avatar}
              style={{
                backgroundColor: successfullyVerified ? success : error,
              }}
            >
              {successfullyVerified ? (
                <VerifiedUserOutlinedIcon />
              ) : (
                <ErrorOutlinedIcon />
              )}
            </Avatar>

            <Typography
              component="h3"
              variant="h6"
              color={successfullyVerified ? "primary" : "error"}
            >
              {successfullyVerified
                ? "Email address is now confirmed."
                : "Email address could not be confirmed."}
            </Typography>
            <Grid container className={classes.submit}>
              <Grid item xs>
                <span
                  style={{ textDecoration: "underline", cursor: "pointer" }}
                >
                  <Link to="/login" variant="body2">
                    Go to Login
                  </Link>
                </span>
              </Grid>
            </Grid>
          </Fragment>
        ) : (
          <CircularProgress />
        )}
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
};

export default EmailConfirmed;
