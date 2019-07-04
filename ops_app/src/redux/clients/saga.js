import { all, takeEvery, put, fork, call } from 'redux-saga/effects';
import { goBack } from 'react-router-redux';
import actions from './actions';
import notification from '../../components/notification';
import request from '../../API/request';
import  { API_URL } from '../../API/env'

export function* fetchRequest() {
  yield takeEvery('FETCH_CLIENTS_REQUEST', function*() {
    try {
      const url = `${API_URL}/clients/`
      const filterObj = {
        include: [{
          relation: 'naicsCode1',
        }, {
          relation: 'naicsCode2',
        }],
      }
      const queryParams = {
        filter: JSON.stringify(filterObj),
      }
      const params = {
        method: 'GET',
        query: queryParams,
      }

      const result = yield call(request, url, params);
      
      yield put({
        type: actions.FETCH_CLIENTS_SUCCESS,
        payload: result,
      });
    } catch(err) {
      notification('error', err.message || 'Internal Server Error');
      yield put({ type: actions.FETCH_CLIENTS_ERROR });
    }
  });
}

export function* deleteRequest() {
  yield takeEvery('DELETE_CLIENT_REQUEST', function*({ payload }) {
    const { delInfo } = payload;
    try {
      const url = `${API_URL}/clients/${delInfo.index}/`;
      const params = {
        method: 'DELETE',
      };
      yield call(request, url, params);
      yield put({
        type: actions.DELETE_CLIENT_SUCCESS,
        payload: { id: delInfo.index },
      });
      notification('success', 'Successfully deleted!');
    } catch (err) {
      notification('error', err.message || 'Internal Server Error');
      yield put({ type: actions.DELETE_CLIENT_ERROR });
    }
  });
}

export function* insertRequest() {
  yield takeEvery('INSERT_CLIENT_REQUEST', function*({ payload }) {
    const { postData } = payload
    try {
      const url = `${API_URL}/clients/`
      const params = {
        method: 'POST',
        body: JSON.stringify(postData)
      };
      const result = yield call(request, url, params);
      yield put({
        type: actions.INSERT_CLIENT_SUCCESS,
        payload: result,
      });
      yield put(goBack())
      notification('success', 'Successfully added!');
    } catch(err) {
      notification('error', err.message || 'Internal Server Error');
      yield put({ type: actions.INSERT_CLIENT_ERROR });
    }
  });
}
export function* getRequest() {
  yield takeEvery('GET_CLIENT_REQUEST', function*({ payload }) {
    const { postData } = payload
    try {
      const url = `${API_URL}/clients/${postData.index}/`;
      const result = yield call(request, url);
      yield put({
        type: actions.GET_CLIENT_SUCCESS,
        payload: result,
      });
    } catch(err) {
      notification('error', err.message || 'Internal Server Error');
      yield put({ type: actions.GET_CLIENT_ERROR });
    }
  });
}

export function* updateRequest() {
  yield takeEvery('UPDATE_CLIENT_REQUEST', function*({ payload }) {
    const { postData } = payload
    try {
      const url = `${API_URL}/clients/${postData.id}/`
      const params = {
        method: 'PUT',
        body: JSON.stringify(postData)
      }
      const result = yield call(request, url, params);
      yield put({
        type: actions.UPDATE_CLIENT_SUCCESS,
        payload: result,
      });
      yield put(goBack())
      notification('success', 'Successfully updated!');
    } catch(err) {
      notification('error', err.message || 'Internal Server Error');
      yield put({ type: actions.UPDATE_CLIENT_ERROR });
    }
  });
}
export default function* rootSaga() {
  yield all([
    fork(fetchRequest),
    fork(deleteRequest),
    fork(insertRequest),
    fork(getRequest),
    fork(updateRequest),
  ]);
}
