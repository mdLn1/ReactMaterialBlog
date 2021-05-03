export function asyncRequestErrorHandler(error) {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    let errors = error.response.data?.errors;
    if (error.response.status === 404) {
      errors = ["Resource not found"];
    }
    return {
      status: error.response.status,
      errors: errors,
    };
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    return {
      status: null,
      errors: ["Server did not respond."],
    };
  } else {
    // Something happened in setting up the request that triggered an Error
    return {
      status: null,
      errors: [error.message],
    };
  }
}

/**
 * async request simulator
 * @param  {number} time Number of seconds to run
 * @return {Promise} A promise that will execute successfully in the requested time
 */
export function simulateAsyncRequest(time = 3) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
