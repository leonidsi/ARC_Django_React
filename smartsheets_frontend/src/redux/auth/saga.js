import { all, takeEvery, takeLatest, put, fork, call } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import actions from './actions';
import { clearToken } from '../../helpers/utility';
import notification from '../../components/notification';
import request from '../../API/request';
import  { API_URL } from '../../API/env'

export function* loginRequest() {
  yield takeEvery('LOGIN_REQUEST', function*({ payload }) {
    const { userInfo } = payload;
    try {
      const url = `${API_URL}/users/sso/`;
      const oneloginInfo = {
        "email": userInfo.email,
        "password": userInfo.password,
      }
      
      const params = {
        method: 'POST',
        body: JSON.stringify(oneloginInfo),
      };
      const result = yield call(request, url, params);
    
      yield put({
        type: actions.LOGIN_SUCCESS,
        token: result['token'],
        userId: result['user_id'],
      });

      yield put({ type: actions.FETCH_ME_FROM_TOKEN });
      yield put(push('/dashboard'));
    } catch(err) {
      notification('error', err.message);
      yield put({ type: actions.LOGIN_ERROR });
    }
  });
}

export function* loginSuccess() {
  yield takeEvery(actions.LOGIN_SUCCESS, function*(payload) {
    yield localStorage.setItem('id_token', payload.token);
    yield localStorage.setItem('userId', payload.userId);
  });
}

export function* loginError() {
  yield takeEvery(actions.LOGIN_ERROR, function*() {
  });
  
}

export function* logout() {
  yield takeEvery(actions.LOGOUT, function*() {
    const requestURL = `${API_URL}/users/logout/`;
    const params = {
      method: 'GET',
    }
    const response = yield call(request, requestURL, params);
    clearToken();
    notification('success', response['message']);
    yield put(push('/'));
  });
}

export function* validateTokenSuccess() {
  yield takeEvery(actions.VALIDATE_AUTH_TOKEN_SUCCESS, function*(payload) {
    yield localStorage.setItem('id_token', payload.token);
  });
}

export function* validateTokenRequest() {
  yield takeEvery(actions.VALIDATE_AUTH_TOKEN_REQUEST, function*({ payload }) {
    const { userId, accessToken } = payload;
    try {
      const url = `${API_URL}/users/${userId}/`;
      const params = {
        method: 'GET',
        authToken: accessToken,
      };
      const result = yield call(request, url, params);
      yield put({
        type: actions.VALIDATE_AUTH_TOKEN_SUCCESS,
        token: accessToken,
        profile: result,
      });
    } catch(err) {
      const message = err.message || 'Invalid Access Token';
      notification('error', message);
      yield put({ type: actions.VALIDATE_AUTH_TOKEN_ERROR });
    }
  });
}

export function* fetchMeFromToken() {
  yield takeLatest(actions.FETCH_ME_FROM_TOKEN, function*() {
    const userId = localStorage.getItem('userId');
    const authToken = localStorage.getItem('id_token');
    if (!authToken) {
      return;
    }
    try {
      const requestURL = `${API_URL}/users/${userId}/`;
      const filterObj = {
        include: [{
          relation: 'userRoles',
        }],
      }
      const queryParams = {
        filter: JSON.stringify(filterObj),
      }
      const params = {
        method: 'GET',
        query: queryParams,
      }
      const response = yield call(request, requestURL, params);
      yield put({
        type: actions.SET_USER_DATA,
        payload: response
      });
    } catch (e) {
      // if returns forbidden we remove the token from local storage
      if (e.status === 401) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userId');
      }
      yield put(push('/'));
    }
  });
}


export default function* rootSaga() {
  yield all([
    fork(loginRequest),
    fork(loginSuccess),
    fork(loginError),
    fork(logout),
    fork(validateTokenRequest),
    fork(validateTokenSuccess),
    fork(fetchMeFromToken),
  ]);
}
