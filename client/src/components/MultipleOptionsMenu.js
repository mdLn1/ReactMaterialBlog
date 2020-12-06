import React from "react";
import IconButton from "@material-ui/core/IconButton";
import Icon from "@material-ui/core/Icon";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import PropTypes from "prop-types";
import Tooltip from "@material-ui/core/Tooltip";

const ITEM_HEIGHT = 48;

const MultipleOptionsMenu = ({
  options,
  cssClass,
  tooltipTitle,
  iconStyle,
  iconClass,
}) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <span className={`${cssClass || ""}`}>
      <Tooltip title={`${tooltipTitle || "Actions"}`} arrow interactive>
        <IconButton
          aria-label="more"
          aria-controls="long-menu"
          aria-haspopup="true"
          onClick={handleClick}
        >
          <Icon
            className={`${iconClass ? iconClass : "fas fa-ellipsis-v"}`}
            style={iconStyle ? iconStyle : null}
          />
        </IconButton>
      </Tooltip>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
          },
        }}
      >
        {options.map(({ fontAwesomeIcon, text, action }) => (
          <MenuItem
            key={text}
            style={{ fontSize: ".8rem" }}
            onClick={() => {
              if (action) action();
              handleClose();
            }}
          >
            {fontAwesomeIcon && (
              <Icon
                className={fontAwesomeIcon}
                style={{
                  color: "gray",
                  fontSize: ".7rem",
                  marginRight: ".5rem",
                }}
              />
            )}
            {text}
          </MenuItem>
        ))}
      </Menu>
    </span>
  );
};

MultipleOptionsMenu.defaultProps = {
  options: [
    {
      fontAwesomeIcon: "fab fa-google",
      text: "default",
      action: () => {
        console.log("hey ehy");
      },
    },
  ],
};

MultipleOptionsMenu.propTypes = {
  options: PropTypes.array.isRequired,
};

export default MultipleOptionsMenu;
