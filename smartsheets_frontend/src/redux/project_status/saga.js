import { all, takeEvery, put, fork, call } from 'redux-saga/effects';
import { goBack } from 'react-router-redux';
import actions from './actions';
import notification from '../../components/notification';
import request from '../../API/request';
import  { API_URL } from '../../API/env';

export function* fetchRequest() {
  yield takeEvery('FETCH_PSTATUS_REQUEST', function*() {
    try {
      const url =  `${API_URL}/projectStatus`;
      const result = yield call(request, url);
      yield put({
        type: actions.FETCH_PSTATUS_SUCCESS,
        payload: result,
      });
    } catch(err) {
      notification('error', err.message || 'Internal Server Error');
      yield put({ type: actions.FETCH_PSTATUS_ERROR });
    }
  });
}

export function* deleteRequest() {
  yield takeEvery('DELETE_PSTATUS_REQUEST', function*({ payload }) {
    const { delInfo } = payload;
    try {
      const delData = { id: delInfo.index };
      const url =  `${API_URL}/projectStatus/${delInfo.index}`;
      const params = {
        method: 'DELETE',
      };
      yield call(request, url, params);
      yield put({
        type: actions.DELETE_PSTATUS_SUCCESS,
        payload: delData,
      });
      notification('success', 'Successfully deleted!');
    } catch(err) {
      notification('error', err.message || 'Internal Server Error');
      yield put({ type: actions.DELETE_PSTATUS_ERROR });
    }
  });
}

export function* insertRequest() {
  yield takeEvery('INSERT_PSTATUS_REQUEST', function*({ payload }) {
    const { postData } = payload
    try {
      const url =  `${API_URL}/projectStatus?`
      const params = {
        method: 'POST',
        body: JSON.stringify(postData),
      };
      const result = yield call(request, url, params);
      yield put({
        type: actions.INSERT_PSTATUS_SUCCESS,
        payload: result,
      });
      yield put(goBack())
      notification('success', 'Successfully added!');
    } catch(err) {
      notification('error', err.message || 'Internal Server Error');
      yield put({ type: actions.INSERT_PSTATUS_ERROR });
    }
  });
}

export function* getRequest() {
  yield takeEvery('GET_PSTATUS_REQUEST', function*({ payload }) {
    const { postData } = payload
    try {
      const url =  `${API_URL}/projectStatus/${postData.index}`;
      const result = yield call(request, url);
      yield put({
        type: actions.GET_PSTATUS_SUCCESS,
        payload: result,
      });
    } catch(err) {
      notification('error', err.message || 'Internal Server Error');
      yield put({ type: actions.GET_PSTATUS_ERROR });
    }
  });
}

export function* updateRequest() {
  yield takeEvery('UPDATE_PSTATUS_REQUEST', function*({ payload }) {
    const { postData } = payload
    try {
      const url =  `${API_URL}/projectStatus/${postData.id}`;
      const params = {
        method: 'POST',
        body: JSON.stringify(postData),
      };
      const result = yield call(request, url, params);
      yield put({
        type: actions.UPDATE_PSTATUS_SUCCESS,
        payload: result,
      });
      yield put(goBack())
      yield notification('success', 'Successfully updated!');
    } catch(err) {
      notification('error', err.message || 'Internal Server Error');
      yield put({ type: actions.UPDATE_PSTATUS_ERROR });
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
