import React from "react";
import { Grid } from "@material-ui/core";
import ReportedPost from "../components/ReportedPost";
import ReportedComment from "../components/ReportedComment";


const Reports = () => {
  return (
    <div className="reports-container">
      <Grid container justify="space-around" spacing={2}>
        <Grid item xs={12} sm={6} md={6} lg={5}>
          {[0, 1, 2, 3].map((el) => (
            <ReportedPost />
          ))}
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={5}>
          {[0, 1, 2, 3].map((el) => (
            <ReportedComment />
          ))}
        </Grid>
      </Grid>
    </div>
  );
};

export default Reports;
