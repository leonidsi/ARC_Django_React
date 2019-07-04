const authActons = {
  LOGIN_REQUEST: 'LOGIN_REQUEST',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_ERROR: 'LOGIN_ERROR',
  VALIDATE_AUTH_TOKEN_REQUEST: 'VALIDATE_AUTH_TOKEN_REQUEST',
  VALIDATE_AUTH_TOKEN_SUCCESS: 'VALIDATE_AUTH_TOKEN_SUCCESS',
  VALIDATE_AUTH_TOKEN_ERROR: 'VALIDATE_AUTH_TOKEN_ERROR',
  LOGOUT: 'LOGOUT',
  FETCH_ME_FROM_TOKEN: 'FETCH_ME_FROM_TOKEN',
  SET_USER_DATA: 'SET_USER_DATA',
  login: payload => ({
    type: authActons.LOGIN_REQUEST,
    payload
  }),
  validateAuthToken: payload => ({
    type: authActons.VALIDATE_AUTH_TOKEN_REQUEST,
    payload
  }),
  logout: () => ({
    type: authActons.LOGOUT
  }),
  fetchMeFromToken: () => ({
    type: authActons.FETCH_ME_FROM_TOKEN
  })
};
export default authActons;
