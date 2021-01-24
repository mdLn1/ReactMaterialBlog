function isEmailAddressValid(value) {
  let re = new RegExp(
    "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$",
    "igm"
  );
  return value.includes(".") && re.test(value);
}

function isPasswordValid(val) {
  return (
    val.length > 7 &&
    val.length < 101 &&
    /([A-Z]){1}/.test(val) &&
    /([0-9]){2}/.test(val) &&
    /([a-z]){2}/.test(val) &&
    (/([^\w]){1}/.test(val) || /_{1}/.test(val))
  );
}

function isUsernameValid(val) {
  return val.length > 4 && val.length < 21 && /([a-z]){2}/i.test(val);
}

function isPostTitleValid(val) {
  return val.length > 10 && val.length < 151;
}

function isPostContentValid(val) {
  return val.length > 200 && val.length < 15001;
}

function isNewsTitleValid(val) {
  return val.length > 10 && val.length < 51;
}

function isNewsContentValid(val) {
  return val.length > 10 && val.length < 101;
}

function isStartDateValid(date) {
  const currentDate = new Date();
  // selected date set to a past year
  if (currentDate.getFullYear() > date.getFullYear()) return false;
  // selected date set to a past month
  if (
    currentDate.getFullYear() === date.getFullYear() &&
    currentDate.getMonth() > date.getMonth()
  )
    return false;
  // select date set to a past day
  if (
    currentDate.getFullYear() === date.getFullYear() &&
    currentDate.getMonth() === date.getMonth() &&
    currentDate.getDate() > date.getDate()
  )
    return false;

  return true;
}

function isWrapLinkValid(val) {
  if (!val) return false;
  if (!val.startsWith("https://")) return false;
  return true;
}

module.exports = {
  isEmailAddressValid,
  isPasswordValid,
  isUsernameValid,
  isPostTitleValid,
  isPostContentValid,
  isNewsContentValid,
  isNewsTitleValid,
  isStartDateValid,
  isWrapLinkValid
};
