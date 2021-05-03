import React, { useState, useEffect, Fragment, useContext } from "react";
import { Link } from "react-router-dom";
import {
  Grid,
  Checkbox,
  FormControlLabel,
  Button,
  Avatar,
  Box,
  Typography,
  Container,
} from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import axios from "axios";
import { secondary } from "../AppColors";
import { makeStyles } from "@material-ui/core/styles";
import { isEmailAddressValid } from "../utils/customValidators";
import ValidationTextField from "../components/customizedElements/ValidationTextField";
import Copyright from "../components/customizedElements/Copyright";
import { providers } from "../AppSettings";
import OAuth from "../components/OAuth";
import { AUTH_ROUTE } from "../httpRoutes";
import {
  EMAIL_ADDRESS_ERROR,
  PASSWORD_LOGIN_ERROR,
} from "../utils/inputErrorMessages";
import { asyncRequestErrorHandler } from "../utils/asyncRequestHelper";
import { useSnackbar } from "notistack";
import { SNACKBAR_AUTO_HIDE_DURATION } from "../AppSettings";
import CircularProgress from "@material-ui/core/CircularProgress";
import MainContext from "../contexts/main/mainContext";

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
  loader: {
    margin: theme.spacing(2, 1, 1),
  },
}));

export default function SignIn() {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const mainContext = useContext(MainContext);
  const source = axios.CancelToken.source();

  let emailFieldProps = {};
  let passwordFieldProps = {};
  let submissionButtonProps = { disabled: true };
  const [password, setPassword] = useState("");
  const [isPasswordError, togglePasswordError] = useState(false);
  const [emailAddress, setEmailAddress] = useState("");
  const [isEmailAddressError, toggleEmailAddressError] = useState(false);
  const [isLoading, toggleLoading] = useState(false);
  const [isPasswordForgotten, togglePasswordForgotten] = useState(false);
  const [responseErrors, setResponseErrors] = useState([]);

  // events
  useEffect(() => {
    return () => {
      toggleLoading(false);
      source.cancel();
    };
  }, []);

  // action handlers
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

  const login = () => {
    if (isPasswordForgotten) {
      if (!isEmailAddressValid(emailAddress)) {
        toggleEmailAddressError(true);
        return;
      }
      const requestData = {
        email: emailAddress,
      };
      toggleLoading(true);
      axios
        .post(AUTH_ROUTE + "password-forgotten", requestData, {
          cancelToken: source.token,
        })
        .then((response) => {
          enqueueSnackbar("Email sent", {
            variant: "success",
            autoHideDuration: SNACKBAR_AUTO_HIDE_DURATION,
          });
        })
        .catch((error) => {
          if (axios.isCancel(error)) {
            console.log("request canceled");
          } else {
            const { errors, status } = asyncRequestErrorHandler(error);
            if (status === 400) {
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
      if (isEmailAddressValid(emailAddress) && password.length > 5) {
        const requestData = {
          email: emailAddress,
          password,
        };
        toggleLoading(true);
        axios
          .post(AUTH_ROUTE + "login", requestData, {
            cancelToken: source.token,
          })
          .then((response) => {
            enqueueSnackbar("You've logged in.", { variant: "success" });
            mainContext.login(response.data);
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
                  enqueueSnackbar(el, { variant: "error" })
                );
              }
            }
          })
          .finally(() => {
            toggleLoading(false);
          });
      } else {
        if (!isEmailAddressValid(emailAddress)) {
          toggleEmailAddressError(true);
        }

        if (password.length < 6) {
          togglePasswordError(true);
        }
      }
    }
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
                    <OAuth provider={provider} />
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
