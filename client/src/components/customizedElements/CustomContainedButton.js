import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";

export default withStyles((theme) => ({
  root: (props) =>
    props.variant === "contained"
      ? {
          color: theme.palette[props.color].contrastText,
          backgroundColor: theme.palette[props.color].main,
          "&:hover": {
            backgroundColor: theme.palette[props.color].dark,
            // Reset on touch devices, it doesn't add specificity
            "@media (hover: none)": {
              backgroundColor: theme.palette[props.color].main,
            },
          },
        }
      : {},
}))(Button);
