import React from "react";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

// severity: error, warning, success, info

const CustomSnackbar = ({
  severity,
  autoHideDuration,
  message,
  dismissAction,
}) => {
  return (
    <Snackbar autoHideDuration={autoHideDuration}>
      <Alert severity={severity} onClose={dismissAction}>
        {message}
      </Alert>
    </Snackbar>
  );
};

CustomSnackbar.defaultProps = {
  message: "This is a success snackbar!",
  severity: "success",
  autoHideDuration: 10000,
};

export default CustomSnackbar;
