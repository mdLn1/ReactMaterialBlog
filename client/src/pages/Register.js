// libraries
import React, { useState, useContext, useEffect } from "react";
import { useSnackbar } from "notistack";
import {
  Avatar,
  Checkbox,
  Grid,
  Box,
  Button,
  Typography,
  RadioGroup,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  Container,
  CircularProgress,
} from "@material-ui/core";
import { Link, Redirect } from "react-router-dom";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";

// project items
import ValidationTextField from "../components/customizedElements/ValidationTextField";
import Copyright from "../components/customizedElements/Copyright";
import {
  isEmailAddressValid,
  isPasswordValid,
  isUsernameValid,
} from "../utils/customValidators";
import { secondary } from "../AppColors";
import MainContext from "../contexts/main/mainContext";
import { AUTH_ROUTE } from "../httpRoutes";
import {
  EMAIL_ADDRESS_ERROR,
  PASSWORD_REGISTER_ERROR,
  CONFIRMED_PASSWORD_ERROR,
  USERNAME_ERROR,
} from "../utils/inputErrorMessages";
import { asyncRequestErrorHandler } from "../utils/asyncRequestHelper";
import { SNACKBAR_AUTO_HIDE_DURATION } from "../AppSettings";

// styling
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
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  loader: {
    margin: theme.spacing(2, 1, 1),
  },
}));

export default function Register() {
  // setup
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const mainContext = useContext(MainContext);
  const { user } = mainContext;
  const source = axios.CancelToken.source();

  //fields
  let emailFieldProps = {};
  let passwordFieldProps = {};
  let confirmedPasswordFieldProps = {};
  let usernameFieldProps = {};
  let submissionButtonProps = { disabled: true };

  // form values
  const [password, setPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [username, setUsername] = useState("");
  const [receiveUpdatesTicked, toggleReceiveUpdates] = useState(false);
  const [isLoading, toggleLoading] = useState(false);
  const [displayEmail, toggleDisplayEmail] = useState(false);

  // form values errors
  const [isPasswordError, togglePasswordError] = useState(false);
  const [isConfirmedPasswordError, toggleConfirmedPasswordError] = useState(
    false
  );
  const [isEmailAddressError, toggleEmailAddressError] = useState(false);
  const [isUsernameError, toggleUsernameError] = useState(false);
  const [responseErrors, setResponseErrors] = useState([]);

  // events
  useEffect(() => {
    return () => {
      toggleLoading(false);
      source.cancel();
    };
  }, []);

  // action handlers

  const handleEmailChange = ({ target: { value } }) => {
    setEmailAddress(value);
    toggleEmailAddressError(!isEmailAddressValid(value));
  };

  const handleConfirmationPasswordChange = ({ target: { value } }) => {
    setConfirmedPassword(value);
    toggleConfirmedPasswordError(value !== password);
  };

  const handlePasswordChange = ({ target: { value } }) => {
    setPassword(value);
    togglePasswordError(!isPasswordValid(value));
  };

  const handleUsernameChange = ({ target: { value } }) => {
    setUsername(value);
    toggleUsernameError(!isUsernameValid(value));
  };

  const handleRegistration = async () => {
    toggleLoading(true);
    if (
      isEmailAddressValid(emailAddress) &&
      isPasswordValid(password) &&
      isUsernameValid(username) &&
      confirmedPassword === password
    ) {
      const requestData = {
        email: emailAddress,
        password,
        username,
        displayEmail,
        mailingSubscription: receiveUpdatesTicked,
      };
      toggleLoading(true);
      axios
        .post(AUTH_ROUTE + "register", requestData, {
          cancelToken: source.token,
        })
        .then((response) => {
          enqueueSnackbar("An email was sent to the address provided.", {
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
      toggleEmailAddressError(!isEmailAddressValid(emailAddress));
      togglePasswordError(!isPasswordValid(password));
      toggleUsernameError(!isUsernameValid(username));
      toggleConfirmedPasswordError(confirmedPassword !== password);
    }
  };

  // handling errors display
  if (isPasswordError) {
    passwordFieldProps = {
      error: true,
      helperText: PASSWORD_REGISTER_ERROR,
    };
  }

  if (isConfirmedPasswordError) {
    confirmedPasswordFieldProps = {
      error: true,
      helperText: CONFIRMED_PASSWORD_ERROR,
    };
  }

  if (isUsernameError) {
    usernameFieldProps = {
      error: true,
      helperText: USERNAME_ERROR,
    };
  }
  if (isEmailAddressError) {
    emailFieldProps = {
      error: true,
      helperText: EMAIL_ADDRESS_ERROR,
    };
  }
  if (
    isPasswordError ||
    isUsernameError ||
    isConfirmedPasswordError ||
    isEmailAddressError ||
    isLoading
  ) {
    submissionButtonProps.disabled = true;
  } else {
    submissionButtonProps.disabled = false;
  }

  // redirect if user logged in already
  if (user) return <Redirect exact to="/" />;

  // ui component
  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Register
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
            handleRegistration();
          }}
          noValidate
          autoComplete="off"
        >
          <ValidationTextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            onChange={(e) => handleUsernameChange(e)}
            {...usernameFieldProps}
          />
          <ValidationTextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            onChange={(e) => handleEmailChange(e)}
            {...emailFieldProps}
          />
          {!isEmailAddressError && (
            <FormControl component="fieldset">
              <FormLabel component="legend">
                Your Email address visibility
              </FormLabel>
              <RadioGroup
                row
                aria-label="position"
                name="position"
                defaultValue="public"
              >
                <FormControlLabel
                  value="public"
                  control={
                    <Radio
                      color="primary"
                      onClick={() => toggleDisplayEmail(true)}
                    />
                  }
                  label="Public"
                  labelPlacement="start"
                />
                <FormControlLabel
                  value="private"
                  control={
                    <Radio
                      color="primary"
                      onClick={() => toggleDisplayEmail(false)}
                    />
                  }
                  label="Private"
                  labelPlacement="start"
                />
              </RadioGroup>
            </FormControl>
          )}
          <ValidationTextField
            variant="outlined"
            margin="normal"
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            onChange={(e) => handlePasswordChange(e)}
            {...passwordFieldProps}
          />
          <ValidationTextField
            variant="outlined"
            margin="normal"
            fullWidth
            name="confirmedPassword"
            label="Confirm Password"
            type="password"
            id="confirmedPassword"
            onChange={(e) => handleConfirmationPasswordChange(e)}
            {...confirmedPasswordFieldProps}
          />
          <FormControlLabel
            control={
              <Checkbox
                value="allowExtraEmails"
                color="primary"
                onChange={() => toggleReceiveUpdates((val) => !val)}
              />
            }
            label="I want to receive updates via email."
          />
          <Button
            type="submit"
            color="secondary"
            fullWidth
            variant="contained"
            {...submissionButtonProps}
            className={classes.submit}
          >
            Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link to="/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
}
