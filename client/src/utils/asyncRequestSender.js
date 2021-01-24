import axios from "axios";
// request types :
// 0 - get default
// 1 - post
// 2 - patch
// 3 - put
// 4 - delete
/**
 * axios async request handler
 * @param  {string} URL The url path for the request
 * @param  {object} data The data to be sent with a request (POST, PATCH, PUT)
 * @param  {Number} requestType The type of request (0-GET-default, 1-POST, 2-PATCH, 3-PUT, 4-delete)
 * @return {object} { data: object, status: Number, isSuccess: bool, errors: Array }
 */
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
        resp = await axios.delete(URL);
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
      return {
        data: null,
        isSuccess: false,
        status: null,
        errors: ["Server did not respond."],
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
