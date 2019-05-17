export const fetchAsync = async (url, method, contentType, accessToken, postData) => {
  try {
    const headers = { 
      'Accept': 'application/json',
      'Content-Type': contentType,
    }
    let tokenUrl;
    if (url.indexOf('?') > 0)
    {
      tokenUrl = accessToken !== null ? `&access_token=${accessToken}` : ''
    } else {
      tokenUrl = accessToken !== null ? `?access_token=${accessToken}` : ''
    }

    let request = {
      method: method,
      headers: headers, 
    }
    if (method === 'POST') {
      Object.assign(headers, {...headers, 'Content-Type': contentType});
      request.body = JSON.stringify(postData)
    }
    let response = await fetch(url + tokenUrl, request)
    let checkedResponse = await checkStatus(response)
    let responseJson = await checkedResponse.json()
    return responseJson
  } catch (err) {
    return err
  }
}

export const checkStatus = (response) => {
    if (response.status >= 200 && response.status < 300) {
      return response;
    } else {
      let error = new Error(response.statusText)
      error.response = response
      throw error;
    }
}