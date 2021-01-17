import React, { useState, useEffect, Fragment } from "react";
import io from "socket.io-client";
import axios from "axios";
import Avatar from "@material-ui/core/Avatar";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import { Link } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import { secondary } from "../AppColors";
import { makeStyles } from "@material-ui/core/styles";
import { isEmailAddressValid } from "../utils/customValidators";
import ValidationTextField from "../components/customizedElements/ValidationTextField";
import Copyright from "../components/customizedElements/Copyright";
import { API_URL, providers } from "../AppSettings";
import OAuth from "../components/OAuth";
import { FORGOT_PASSWORD, LOGIN } from "../httpRoutes";
import Loader from "../components/Loader";
import {
  EMAIL_ADDRESS_ERROR,
  PASSWORD_LOGIN_ERROR,
} from "../utils/inputErrorMessages";
import asyncRequestSender from "../utils/asyncRequestSender";
import { LOGIN_FAILED } from "../contexts/types";

const socket = io(API_URL);

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

export default function SignIn() {
  const classes = useStyles();
  let emailFieldProps = {};
  let passwordFieldProps = {};
  let submissionButtonProps = { disabled: true };
  const [password, setPassword] = useState("");
  const [isPasswordError, togglePasswordError] = useState(false);
  const [emailAddress, setEmailAddress] = useState("");
  const [isEmailAddressError, toggleEmailAddressError] = useState(false);
  const [isLoading, toggleLoading] = useState(false);
  const [isPasswordForgotten, togglePasswordForgotten] = useState(false);

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
    if (value.length < 5) {
      togglePasswordError(true);
    } else {
      togglePasswordError(false);
    }
  };

  const login = async () => {
    toggleLoading(true);
    if (isPasswordForgotten) {
      if (!isEmailAddressValid(emailAddress)) {
        toggleEmailAddressError(true);
        toggleLoading(false);
        return;
      }
      const data = {
        email: emailAddress,
      };
      try {
        const resp = await axios.post(FORGOT_PASSWORD, data);
      } catch (error) {
        console.log(error);
      }
    } else {
      if (isEmailAddressValid(emailAddress) && password.length > 5) {
        const data = {
          email: emailAddress,
          password,
        };
        console.log(await asyncRequestSender(LOGIN, data, 1));
      } else {
        if (!isEmailAddressValid(emailAddress)) {
          toggleEmailAddressError(true);
        }

        if (password.length < 6) {
          togglePasswordError(true);
        }
      }
    }
    toggleLoading(false);
  };

  const swapLoginForgotPassword = () => {
    if (isPasswordForgotten) {
      if (emailAddress && !isEmailAddressValid(emailAddress)) {
        toggleEmailAddressError(true);
      }
      if (password && password.length < 6) {
        togglePasswordError(true);
      }
      togglePasswordForgotten(false);
    } else {
      if (emailAddress && !isEmailAddressValid(emailAddress)) {
        toggleEmailAddressError(true);
      }
      togglePasswordError(false);
      togglePasswordForgotten(true);
    }
  };

  if (isPasswordError) {
    passwordFieldProps = {
      error: true,
      helperText: PASSWORD_LOGIN_ERROR,
    };
  }

  if (isEmailAddressError) {
    emailFieldProps = {
      error: true,
      helperText: EMAIL_ADDRESS_ERROR,
    };
  }
  if (isPasswordError || isEmailAddressError || isLoading) {
    submissionButtonProps.disabled = true;
  } else {
    submissionButtonProps.disabled = false;
  }

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          {isPasswordForgotten ? "Reset Password" : "Sign in"}
        </Typography>
        {isLoading && <Loader />}
        <form
          className={classes.form}
          onSubmit={(e) => {
            e.preventDefault();
            login();
          }}
          noValidate
          autoComplete="off"
        >
          <ValidationTextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            onChange={(e) => validateEmail(e)}
            {...emailFieldProps}
          />
          {!isPasswordForgotten && (
            <Fragment>
              <ValidationTextField
                variant="outlined"
                margin="normal"
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                onChange={(e) => validatePassword(e)}
                {...passwordFieldProps}
              />

              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
            </Fragment>
          )}
          <Button
            type="submit"
            color="secondary"
            fullWidth
            variant="contained"
            {...submissionButtonProps}
            className={classes.submit}
          >
            {isPasswordForgotten ? "Send email" : "Sign In"}
          </Button>

          {!isPasswordForgotten && (
            <Fragment>
              <Grid container spacing={3}>
                {providers.map((provider) => (
                  <Grid key={provider} item xs={12} sm={6} md={6} lg={6}>
                    <OAuth provider={provider} socket={socket} />
                  </Grid>
                ))}
              </Grid>
            </Fragment>
          )}
          <Grid container className={classes.submit}>
            <Grid item xs>
              {isPasswordForgotten ? (
                <span
                  style={{ textDecoration: "underline", cursor: "pointer" }}
                  onClick={() => swapLoginForgotPassword()}
                >
                  Back to login
                </span>
              ) : (
                <span
                  style={{ textDecoration: "underline", cursor: "pointer" }}
                  onClick={() => swapLoginForgotPassword()}
                >
                  Forgot password?
                </span>
              )}
            </Grid>
            <Grid item>
              <Link to="/register" variant="body2">
                Don't have an account? Sign Up
              </Link>
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
