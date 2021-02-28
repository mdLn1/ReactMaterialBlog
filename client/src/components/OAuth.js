import React, { useContext, useCallback, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Icon } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { API_URL } from "../AppSettings";
import MainContext from "../contexts/main/mainContext";
import { SocketContext } from "../contexts/socket/socket";
import { Redirect } from "react-router-dom";
import { useSnackbar } from "notistack";
import { SNACKBAR_AUTO_HIDE_DURATION } from "../AppSettings";

const OAuth = ({ provider }) => {
  const socket = useContext(SocketContext);
  const { user, oAuthLogin } = useContext(MainContext);
  const [disabled, setDisabled] = useState(false);
  const [popup, setPopUp] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  const handleProviderLogin = useCallback((data) => {
    if (data?.errors?.length) {
      data.errors.forEach((el) =>
        enqueueSnackbar(el, {
          variant: "error",
          autoHideDuration: SNACKBAR_AUTO_HIDE_DURATION,
        })
      );
    }

    popup.close();
    oAuthLogin({
      user: data.user,
      token: data.token,
      oAuthProvider: provider,
    });
  });

  useEffect(() => {
    socket.on(provider, handleProviderLogin);

    return () => {
      socket.off(provider, handleProviderLogin);
    };
  }, [socket, handleProviderLogin]);

  function checkPopup() {
    const check = setInterval(() => {
      if (!popup || popup.closed || popup.closed === undefined) {
        clearInterval(check);
        setDisabled(false);
      }
    }, 1000);
  }

  function openPopup() {
    const width = 600,
      height = 600;
    const left = window.innerWidth / 2 - width / 2;
    const top = window.innerHeight / 2 - height / 2;
    const url = `${API_URL}/api/auth/${provider}?socketId=${socket.id}`;

    return window.open(
      url,
      "",
      `toolbar=no, location=no, directories=no, status=no, menubar=no, 
      scrollbars=no, resizable=no, copyhistory=no, width=${width}, 
      height=${height}, top=${top}, left=${left}`
    );
  }

  const startAuth = () => {
    if (!disabled) {
      setPopUp(openPopup());
      checkPopup();
      setDisabled(true);
    }
  };
  let buttonProps = {};

  if (disabled) buttonProps = { disabled: true };

  return user ? (
    <Redirect exact to="/" />
  ) : (
    <Button
      fullWidth
      color="secondary"
      variant="contained"
      onClick={() => startAuth()}
      {...buttonProps}
    >
      Login with{" "}
      <Icon className={`fab fa-${provider}`} style={{ marginLeft: "15px" }} />
    </Button>
  );
};

OAuth.propTypes = {
  provider: PropTypes.string.isRequired,
};

export default OAuth;
