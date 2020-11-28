import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import axios from "axios";

import AboutMe from "./pages/AboutMe";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ViewPost from './pages/ViewPost'
import Login from "./pages/Login";
import EmailConfirmed from "./pages/EmailConfirmed";
import Register from "./pages/Register";
import PasswordReset from "./pages/PasswordReset";
import { API_URL } from "./AppSettings";
import MainState from "./contexts/main/MainState";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { primary, secondary, error, success } from "./AppColors";

axios.defaults.baseURL = API_URL;
axios.defaults.headers.post["Content-Type"] = "application/json";
const theme = createMuiTheme({
  palette: {
    type: "light",
    secondary: {
      main: secondary,
    },
    primary: {
      main: primary,
    },
    success: {
      main: success,
    },
    error: {
      main: error,
    },
  },
});

const App = () => {
  return (
    <Router>
      <MainState>
        <MuiThemeProvider theme={theme}>
          <div style={{ position: "relative" }}>
            <header></header>
            <Navbar />
            <Switch>
              <Route path="/about-me" component={AboutMe} />
              <Route path="/login" component={Login} />
              <Route path="/register" component={Register} />
              <Route path="/reset-password/:hash" component={PasswordReset} />
              <Route path="/confirm-email/:hash" component={EmailConfirmed} />
              <Route path="/post/:id" component={ViewPost} />
              <Route path="/" component={Home} />
            </Switch>
          </div>
        </MuiThemeProvider>
      </MainState>
    </Router>
  );
};

export default App;
