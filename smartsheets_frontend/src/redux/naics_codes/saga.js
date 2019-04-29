import { all, takeEvery, put, fork, call } from 'redux-saga/effects';
import { goBack } from 'react-router-redux';
import actions from './actions';
import notification from '../../components/notification';
import request from '../../API/request';
import  { API_URL } from '../../API/env';

export function* fetchRequest() {
  yield takeEvery('FETCH_NAICSCODES_REQUEST', function*({ payload }) {
    try {
      const url = `${API_URL}/naicsCode`;
      const result = yield call(request, url);
      yield put({
        type: actions.FETCH_NAICSCODES_SUCCESS,
        payload: result,
      });
    } catch(err) {
      notification('error', err.message || 'Internal Server Error');
      yield put({ type: actions.FETCH_NAICSCODES_ERROR });
      console.log('NaicsCode fetch - Error');
    }
  });
}

export function* deleteRequest() {
  yield takeEvery('DELETE_NAICSCODES_REQUEST', function*({ payload }) {
    const { delInfo } = payload;
    try {
      const delData = { id: delInfo.index }
      const url = `${API_URL}/naicsCode/${delInfo.index}`;
      const params = {
        method: 'DELETE',
      };
      yield call(request, url, params);
      yield put({
        type: actions.DELETE_NAICSCODES_SUCCESS,
        payload: delData,
      });
      notification('success', 'Successfully deleted!');
    } catch(err) {
      notification('error', err.message || 'Internal Server Error');
      yield put({ type: actions.DELETE_NAICSCODES_ERROR });
    }
  });
}

export function* insertRequest() {
  yield takeEvery('INSERT_NAICSCODES_REQUEST', function*({ payload }) {
    const { postData } = payload
    try {
      const url =  `${API_URL}/naicsCode`;
      const params = {
        method: 'POST',
        body: JSON.stringify(postData),
      };
      const result = yield call(request, url, params);
      yield put({
        type: actions.INSERT_NAICSCODES_SUCCESS,
        payload: result,
      });
      yield put(goBack())
      notification('success', 'Successfully added!');
    } catch(err) {
      notification('error', err.message || 'Internal Server Error');
      yield put({ type: actions.INSERT_NAICSCODES_ERROR });
    }
  });
}


export function* getRequest() {
  yield takeEvery('GET_NAICSCODES_REQUEST', function*({ payload }) {
    const { postData } = payload;
    try {
      const url = `${API_URL}/naicsCode/${postData.index}`;
      const result = yield call(request, url);
      yield put({
        type: actions.GET_NAICSCODES_SUCCESS,
        payload: result,
      });
    } catch(err) {
      notification('error', err.message || 'Internal Server Error');
      yield put({ type: actions.GET_NAICSCODES_ERROR });
    }
  });
}

export function* updateRequest() {
  yield takeEvery('UPDATE_NAICSCODES_REQUEST', function*({ payload }) {
    const { postData } = payload;
    try {
      const url = `${API_URL}/naicsCode/${postData.id}`;
      const params = {
        method: 'PUT',
        body: JSON.stringify(postData),
      };
      const result = yield call(request, url, params);
      yield put({
        type: actions.UPDATE_NAICSCODES_SUCCESS,
        payload: result,
      });
      yield put(goBack())
      notification('success', 'Successfully updated!');
    } catch(err) {
      notification('error', err.message || 'Internal Server Error');
      yield put({ type: actions.UPDATE_NAICSCODES_ERROR });

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
