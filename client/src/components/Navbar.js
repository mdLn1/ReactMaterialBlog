import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { iconLinks } from "../AppSettings";
import MainContext from "../contexts/main/mainContext";
import { useSnackbar } from "notistack";
import { SNACKBAR_AUTO_HIDE_DURATION } from "../AppSettings";
import { asyncRequestErrorHandler } from "../utils/asyncRequestHelper";
import setAuthToken from "../utils/setAuthToken";
import { AUTH_ROUTE } from "../httpRoutes";
import AccountMenu from "./account/AccountMenu";
import axios from "axios";

const Navbar = () => {
  const mainContext = useContext(MainContext);
  const location = useLocation();
  const [isSidenavShowing, toggleSidenav] = useState(false);
  const { user, logout } = mainContext;
  const { enqueueSnackbar } = useSnackbar();
  const source = axios.CancelToken.source();

  useEffect(() => {
    if (!user && localStorage.token) {
      setAuthToken(localStorage.token);
      axios
        .get(`${AUTH_ROUTE}`, { cancelToken: source.token })
        .then((response) => {
          enqueueSnackbar("You've been logged in.", {
            variant: "success",
            autoHideDuration: SNACKBAR_AUTO_HIDE_DURATION,
          });
          mainContext.login(response.data);
        })
        .catch((error) => {
          console.log(error);
          if (axios.isCancel(error)) {
            console.log("request canceled");
          } else {
            const { errors, status } = asyncRequestErrorHandler(error);
            if (status === 401 || status === 400) {
              localStorage.removeItem("token");
              setAuthToken("");
            } else {
              errors.forEach((el) =>
                enqueueSnackbar(el, {
                  variant: "error",
                  autoHideDuration: SNACKBAR_AUTO_HIDE_DURATION,
                })
              );
            }
          }
        });
    }
    return () => {
      source.cancel();
    };
  }, []);

  useEffect(() => {
    if (isSidenavShowing) {
      document.getElementsByClassName("sidenav")[0].style.width = "0";
      toggleSidenav(false);
    }
  }, [location]);

  return (
    <nav className="navbar">
      <section className="left">
        <Link to="/">Home</Link>
        <Link to="/about-me">About Me</Link>
        <Link to="/about-me">Settings</Link>
        <Link to="/reports">Reports</Link>
        <i
          className="fas fa-bars"
          onClick={() => {
            if (isSidenavShowing) {
              document.getElementsByClassName("sidenav")[0].style.width = "0";
              toggleSidenav(false);
            } else {
              document.getElementsByClassName("sidenav")[0].style.width =
                "100%";
              toggleSidenav(true);
            }
          }}
        ></i>
        <aside className="sidenav">
          <Link to="/">Home</Link>
          <Link to="/about-me">About Me</Link>
          <Link to="/about-me">Settings</Link>
          <Link to="/about-me">Reports</Link>
        </aside>
      </section>
      <section className="center">
        {iconLinks?.facebook && (
          <a
            href={iconLinks.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="link-icons"
          >
            <i className="fab fa-facebook" />
          </a>
        )}
        {iconLinks?.github && (
          <a
            href={iconLinks.github}
            target="_blank"
            rel="noopener noreferrer"
            className="link-icons"
          >
            <i className="fab fa-github" />
          </a>
        )}
        {iconLinks?.stackoverflow && (
          <a
            href={iconLinks.stackoverflow}
            target="_blank"
            rel="noopener noreferrer"
            className="link-icons"
          >
            <i className="fab fa-stack-overflow" />
          </a>
        )}
        {iconLinks?.twitter && (
          <a
            href={iconLinks.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="link-icons"
          >
            <i className="fab fa-twitter" />
          </a>
        )}
        {iconLinks?.linkedin && (
          <a
            href={iconLinks.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="link-icons"
          >
            <i className="fab fa-linkedin" />
          </a>
        )}
        {iconLinks?.youtube && (
          <a
            href={iconLinks.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="link-icons"
          >
            <i className="fab fa-youtube" />
          </a>
        )}
      </section>
      <section className="right">
        {user === null ? <Link to="/login">Login</Link> : <AccountMenu />}
      </section>
    </nav>
  );
};

export default Navbar;
