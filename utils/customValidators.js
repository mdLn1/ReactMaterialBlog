function isEmailAddressValid(value)
{
    let re = new RegExp("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$", "igm");
    return value.includes(".") && re.test(value);
}

function isPasswordValid(val)
{
    return val.length > 7
        && /([A-Z]){1}/.test(val)
        && /([0-9]){2}/.test(val)
        && /([a-z]){2}/.test(val)
        && (/([^\w]){1}/.test(val) || /_{1}/.test(val));
}

function isUsernameValid(val)
{
    return val.length > 4 && /([a-z]){2}/i.test(val);
}

module.exports = { isEmailAddressValid, isPasswordValid, isUsernameValid }