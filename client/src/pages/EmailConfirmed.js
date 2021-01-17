import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import { Link, useParams, useLocation } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import VerifiedUserOutlinedIcon from "@material-ui/icons/VerifiedUserOutlined";
import ErrorOutlinedIcon from "@material-ui/icons/ErrorOutlined";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import { secondary, success, error } from "../AppColors";
import { makeStyles } from "@material-ui/core/styles";
import Copyright from "../components/customizedElements/Copyright";
import { CONFIRM_EMAIL } from "../httpRoutes";
import Loader from "../components/Loader";

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
  const [successfullyVerified, setSuccessfullyVerified] = useState(false);
  const { hash } = useParams();
  const verifyEmail = async () => {
    toggleLoading(true);
    if (hash?.length < 10) {
      setSuccessfullyVerified(false);
    } else {
      const data = {
        confirmationHash: hash,
      };
      try {
        const resp = await axios.post(CONFIRM_EMAIL, data);
        setSuccessfullyVerified(true);
      } catch (error) {
        console.log(error);
        setSuccessfullyVerified(false);
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
          <Loader />
        )}
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
};

export default EmailConfirmed;
