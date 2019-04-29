/* eslint-disable no-prototype-builtins, prefer-template */

import 'whatwg-fetch';
import { pick } from 'lodash';
import retry from 'promise-retry';

import { getItem, removeItem } from './localStorage';

/**
 * Requests a URL, returning a promise
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 *
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options = {}) {
  const authToken = getItem('id_token');
  let newUrl = url;
  console.log('-----------20', options)
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  if (authToken) {
    console.log('request.js-27 line -------------', authToken, url)
    headers.authorization = 'Bearer ' + authToken;
  } else if (options.authToken) {
    headers.authorization = options.authToken;
  }
  console.log('request.js-32')
  if (!options.method || options.method === 'GET' || options.method === 'DELETE' || options.method === 'POST') {
    console.log('request.js-34')
    if (options.query) {
      console.log('request.js-35')
      const queryString = serializeParams(options.query);
      newUrl = `${url}?${queryString}`;
    }
  }
  console.log('request.js-41')

  if (options.useDefaultContentType) {
    delete headers['Content-Type'];
    delete headers.Accept;
  }
  console.log('request.js-47')

  options.headers = Object.assign({}, headers, options.headers ); // eslint-disable-line
  options.credentials = 'include'; // eslint-disable-line
  console.log('request.js-51')

  return retry(async (retryFn) => {
    // if anything throws, we retry
    console.log('request.js-55')

    try {
      const res = await fetch(newUrl, options);
      console.log('request.js-59')

      if (res.status === 503) {
        console.log('request.js-62')

        const err = pick(res, ['status', 'statusText']);
        throw Object.assign(err, { message: 'Unable to handle the request.' });
      }
      console.log('request.js-67')

      return res;
    } catch (error) {
      retryFn(error);
    }

    return false;
  }, {
    retries: 1,
  })
    .then(checkStatus)
    .then((response) => {
      console.log('request.js-80')

      if (options.doNotParseAsJson) {
        console.log(response)
        return response;
      } else {
        console.log('request.js-86', response)

        return parseJSON(response);
      }
    })
    .then((data) => data);
}

/**
 * Parses the JSON returned by a network request
 *
 * @param  {object} response A response from a network request
 *
 * @return {object}          The parsed JSON from the request
 */
function parseJSON(response) {
  if (response.status !== 204) { // do not try to parse empty response
    return response.json();
  }
  return true;
}

/**
 * Checks if a network request came back fine, and throws an error if not
 *
 * @param  {objct} response   A response from a network request
 *
 * @return {object|undefined} Returns either the response, or throws an error
 */

function checkStatus(response) {
  if (response.ok) { // response.status >= 200 && response.status < 300
    return response;
  }
  if (response.status === 401) {
    removeItem('auth_token');
  }

  // details from `whatwg-fetch`
  const err = pick(response, ['status', 'statusText']);

  return response.json()
    .then(json => {
      // details from actual error response
      throw Object.assign(err, pick(json.error, ['code', 'details', 'message', 'status', 'failedCount']));
    }, () => {
      throw Object.assign(err, { message: 'Failed to parse JSON' });
    });
}

export function serializeParams(obj) {
  const str = [];
  Object.keys(obj).forEach(p => {
    if (obj.hasOwnProperty(p) && obj[p] !== undefined && obj[p] !== null) {  // we need to pass 0 and empty string
      str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
    }
  });
  return str.join('&');
}
