import Axios from "axios";

import axios from "axios";
// request types :
// 0 - get default
// 1 - post
// 2 - patch
// 3 - put
// 4 - delete

export default async function (URL, data = null, requestType = 0) {
  try {
    let resp = null;
    switch (requestType) {
      case 1:
        resp = await axios.post(URL, data);
        break;
      case 2:
        resp = await axios.patch(URL, data);
        break;
      case 3:
        resp = await axios.put(URL, data);
        break;
      case 4:
        resp = await axios.delete(URL, data);
        break;
      default:
        resp = await axios.get(URL);
        break;
    }
    return {
      data: resp?.data,
      status: resp.status,
      isSuccess: true,
      errors: null,
    };
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx

      switch (error.response.status) {
        case 401:
          // handle it as global
          break;
        case 403:
          // handle it as global
          break;
        case 404:
          // handle it as global
          break;
      }
      return {
        data: error.response.data,
        isSuccess: false,
        status: error.response.status,
        errors: error.response.data?.errors,
      };
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log(error.request);
      return {
        data: null,
        isSuccess: false,
        status: null,
        errors: ["No response received."],
      };
    } else {
      // Something happened in setting up the request that triggered an Error
      return {
        data: null,
        isSuccess: false,
        status: null,
        errors: [error.message],
      };
    }
  }
}
