import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import { Link, Redirect, useParams } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import CheckCircleOutlinedIcon from "@material-ui/icons/CheckCircleOutlined";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import { secondary } from "../AppColors";
import { useSnackbar } from "notistack";
import { makeStyles } from "@material-ui/core/styles";
import {
  isPasswordValid,
  isEmailAddressValid,
} from "../utils/customValidators";
import ValidationTextField from "../components/customizedElements/ValidationTextField";
import Copyright from "../components/customizedElements/Copyright";
import { AUTH_ROUTE } from "../httpRoutes";
import {
  EMAIL_ADDRESS_ERROR,
  PASSWORD_REGISTER_ERROR,
  CONFIRMED_PASSWORD_ERROR,
} from "../utils/inputErrorMessages";
import asyncRequestSender from "../utils/asyncRequestSender";
import { SNACKBAR_AUTO_HIDE_DURATION } from "../AppSettings";

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
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function PasswordReset() {
  const classes = useStyles();
  const {enqueueSnackbar} = useSnackbar();
  let emailFieldProps = {};
  let passwordFieldProps = {};
  let confirmedPasswordFieldProps = {};
  let submissionButtonProps = { disabled: true };
  const [password, setPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [isPasswordError, togglePasswordError] = useState(false);
  const [isConfirmedPasswordError, toggleConfirmedPasswordError] = useState(
    false
  );
  const [emailAddress, setEmailAddress] = useState("");
  const [isEmailAddressError, toggleEmailAddressError] = useState(false);

  const [isLoading, toggleLoading] = useState(false);
  const [passwordChanged, togglePasswordChanged] = useState(false);
  const [responseErrors, setResponseErrors] = useState([]);


  let hash = "";
  if (window.location.href.includes("reset-password/")) {
    let arr = window.location.href.split("reset-password/");
    if (arr.length == 2)
      hash = window.location.href.split("reset-password/")[1];
  }

  const validateEmail = ({ target: { value } }) => {
    setEmailAddress(value);
    if (!isEmailAddressValid(value)) {
      toggleEmailAddressError(true);
    } else {
      toggleEmailAddressError(false);
    }
  };

  const validatePassword = ({ target: { value } }) => {
    setPassword(value);
    if (isPasswordValid(value)) {
      togglePasswordError(false);
    } else {
      togglePasswordError(true);
    }
  };

  const validateConfirmedPassword = ({ target: { value } }) => {
    setConfirmedPassword(value);
    if (value === password) {
      toggleConfirmedPasswordError(false);
    } else {
      toggleConfirmedPasswordError(true);
    }
  };
  const resetPassword = async () => {
    toggleLoading(true);
    if (
      isEmailAddressValid(emailAddress) &&
      isPasswordValid(password) &&
      confirmedPassword === password
    ) {
      const requestData = {
        email: emailAddress,
        confirmationHash: hash,
        password,
        confirmedPassword,
      };
      const { isSuccess, errors, status, data } = await asyncRequestSender(
        AUTH_ROUTE + "password-reset",
        requestData,
        1
      );
      if (isSuccess) {
        enqueueSnackbar("You've changed your password.", { variant: "success" });
        togglePasswordChanged(true);
      } else {
        if (status === 400) {
          setResponseErrors(errors);
        } else {
          errors.forEach((el) => enqueueSnackbar(el, { variant: "error" }));
        }
      }
    } else {
      if (!isPasswordValid(password)) {
        togglePasswordError(true);
      }

      if (!isEmailAddressValid(emailAddress)) {
        toggleEmailAddressError(true);
      }

      if (confirmedPassword !== password) {
        toggleConfirmedPasswordError(true);
      }
    }
    toggleLoading(false);
  };

  if (isPasswordError) {
    passwordFieldProps = {
      error: true,
      helperText: PASSWORD_REGISTER_ERROR,
    };
  }

  if (isEmailAddressError) {
    emailFieldProps = {
      error: true,
      helperText: EMAIL_ADDRESS_ERROR,
    };
  }

  if (isConfirmedPasswordError) {
    confirmedPasswordFieldProps = {
      error: true,
      helperText: CONFIRMED_PASSWORD_ERROR,
    };
  }

  if (
    isPasswordError ||
    isConfirmedPasswordError ||
    isLoading ||
    hash.length < 10
  ) {
    submissionButtonProps.disabled = true;
  } else {
    submissionButtonProps.disabled = false;
  }

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          {passwordChanged ? <CheckCircleOutlinedIcon /> : <LockOutlinedIcon />}
        </Avatar>
        <Typography component="h1" variant="h5">
          {passwordChanged
            ? "Password was changed successfully!"
            : "Reset Password"}
        </Typography>
        <form
          className={classes.form}
          onSubmit={(e) => {
            e.preventDefault();
            resetPassword();
          }}
          noValidate
          autoComplete="off"
        >
          {passwordChanged ? (
            ""
          ) : (
            <Fragment>
              {hash?.length < 10 && (
                <div>
                  You need to use the link provided in the email that was sent
                  to you in order to reset your password.
                </div>
              )}
              <ValidationTextField
                variant="outlined"
                margin="normal"
                fullWidth
                id="email"
                label="Confirm Email Address"
                name="email"
                autoComplete="email"
                onChange={(e) => validateEmail(e)}
                {...emailFieldProps}
              />
              <ValidationTextField
                variant="outlined"
                margin="normal"
                fullWidth
                name="password"
                label="New Password"
                type="password"
                id="password"
                onChange={(e) => validatePassword(e)}
                {...passwordFieldProps}
              />
              <ValidationTextField
                variant="outlined"
                margin="normal"
                fullWidth
                name="confirmedPassword"
                label="Confirm Password"
                type="password"
                id="confirmed-password"
                onChange={(e) => validateConfirmedPassword(e)}
                {...confirmedPasswordFieldProps}
              />
              <Button
                type="submit"
                color="secondary"
                fullWidth
                variant="contained"
                {...submissionButtonProps}
                className={classes.submit}
              >
                Reset Password
              </Button>
            </Fragment>
          )}
          <Grid container className={classes.submit}>
            <Grid item xs>
              <span style={{ textDecoration: "underline", cursor: "pointer" }}>
                <Link to="/login" variant="body2">
                  Go to Login
                </Link>
              </span>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}
