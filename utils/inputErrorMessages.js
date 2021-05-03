const USERNAME_ERROR =
  "Username must contain at least 2 letters and be minimum 5 characters long (maximum 20).";
const EMAIL_ADDRESS_ERROR =
  "You must enter a valid email address before submission.";
const PASSWORD_LOGIN_ERROR =
  "Password must be at least 5 characters long before submission.";
const PASSWORD_REGISTER_ERROR =
  "Please enter a password at least 8 characters long and contain minimum 1 uppercase letter, 2 lowercase letters, 2 digits and 1 symbol (maximum 100).";
const CONFIRMED_PASSWORD_ERROR = "The passwords do not match.";
const POST_TITLE_ERROR =
  "Title must be at least 10 characters long before submission (maximum 150).";
const POST_CONTENT_ERROR =
  "Content must be at least 200 characters long before submission (maximum 15,000).";
const NEWS_TITLE_ERROR =
  "Title must be at least 10 characters long before submission (maximum 50).";
const NEWS_CONTENT_ERROR =
  "Content must be at least 10 characters long before submission (maximum 100).";
const NEWS_START_DATE_ERROR = "Start date cannot be a date in the past.";
const NEWS_END_DATE_ERROR = "End date cannot be a date before start date.";
const NEWS_WRAP_LINK_ERROR = "A valid link must start with https://";

const COMMENT_CONTENT_ERROR =
  "Content must be at least 4 characters long before submission (maximum 300).";
const REPORT_REASON_ERROR = "Reason must be between 10 and 300 characters.";

const BAN_IS_TEMPORARY_ERROR =
  "A boolean parameter indicating if the ban is temporary must be provided";
const BAN_TIME_IN_DAYS_ERROR =
  "A number indicating the number of days for the temporary ban";

module.exports = {
  USERNAME_ERROR,
  EMAIL_ADDRESS_ERROR,
  PASSWORD_LOGIN_ERROR,
  PASSWORD_REGISTER_ERROR,
  CONFIRMED_PASSWORD_ERROR,
  POST_TITLE_ERROR,
  POST_CONTENT_ERROR,
  NEWS_CONTENT_ERROR,
  NEWS_TITLE_ERROR,
  NEWS_START_DATE_ERROR,
  NEWS_END_DATE_ERROR,
  NEWS_WRAP_LINK_ERROR,
  COMMENT_CONTENT_ERROR,
  REPORT_REASON_ERROR,
  BAN_IS_TEMPORARY_ERROR,
  BAN_TIME_IN_DAYS_ERROR,
};
