import React, { useState, useContext } from "react";
import Avatar from "@material-ui/core/Avatar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Checkbox from "@material-ui/core/Checkbox";
import { Link, Redirect } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Radio from "@material-ui/core/Radio";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";

import ValidationTextField from "../components/customizedElements/ValidationTextField";
import Copyright from "../components/customizedElements/Copyright";
import {
  isEmailAddressValid,
  isPasswordValid,
  isUsernameValid,
} from "../utils/customValidators";
import { secondary } from "../AppColors";
import MainContext from "../contexts/main/mainContext";
import Loader from "../components/Loader";
import {
  EMAIL_ADDRESS_ERROR,
  PASSWORD_REGISTER_ERROR,
  CONFIRMED_PASSWORD_ERROR,
  USERNAME_ERROR,
} from "../utils/inputErrorMessages";

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
}));

export default function Register() {
  const classes = useStyles();
  const mainContext = useContext(MainContext);
  let emailFieldProps = {};
  let passwordFieldProps = {};
  let usernameFieldProps = {};
  let submissionButtonProps = { disabled: true };
  const [password, setPassword] = useState("");
  const [isPasswordError, togglePasswordError] = useState(false);
  const [emailAddress, setEmailAddress] = useState("");
  const [isEmailAddressError, toggleEmailAddressError] = useState(false);
  const [username, setUsername] = useState("");
  const [isUsernameError, toggleUsernameError] = useState(false);
  const [receiveUpdatesTicked, toggleReceiveUpdates] = useState(false);
  const [isLoading, toggleLoading] = useState(false);
  const { user } = mainContext;
  const [displayEmail, toggleDisplayEmail] = useState(false);

  const handleRegistration = () => {
    toggleLoading(true);
    if (
      isEmailAddressValid(emailAddress) &&
      isPasswordValid(password) &&
      isUsernameValid(username)
    ) {
      const data = {
        email: emailAddress,
        password,
        username,
        displayEmail,
        mailingSubscription: receiveUpdatesTicked,
      };

      // submit
    } else {
      if (!isEmailAddressValid(emailAddress)) toggleEmailAddressError(true);
      if (!isPasswordValid(password)) togglePasswordError(true);
      if (!isUsernameValid(username)) toggleUsernameError(true);
    }
    toggleLoading(false);
  };

  const validateEmail = ({ target: { value } }) => {
    setEmailAddress(value);
    if (isEmailAddressValid(value)) {
      toggleEmailAddressError(false);
    } else {
      toggleEmailAddressError(true);
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

  const validateUsername = ({ target: { value } }) => {
    setUsername(value);
    if (isUsernameValid(value)) {
      toggleUsernameError(false);
    } else {
      toggleUsernameError(true);
    }
  };

  if (isPasswordError) {
    passwordFieldProps = {
      error: true,
      helperText: PASSWORD_REGISTER_ERROR,
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
  if (isPasswordError || isUsernameError || isEmailAddressError || isLoading) {
    submissionButtonProps.disabled = true;
  } else {
    submissionButtonProps.disabled = false;
  }

  if (user) return <Redirect exact to="/" />;

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Register
        </Typography>
        {isLoading && <Loader />}
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
            onChange={(e) => validateUsername(e)}
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
            onChange={(e) => validateEmail(e)}
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
            onChange={(e) => validatePassword(e)}
            {...passwordFieldProps}
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
