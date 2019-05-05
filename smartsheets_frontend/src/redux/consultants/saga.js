import { all, takeEvery, put, fork, call } from 'redux-saga/effects';
import { goBack } from 'react-router-redux';
import actions from './actions';
import notification from '../../components/notification';
import request from '../../API/request';
import  { API_URL } from '../../API/env'

export function* fetchRequest() {
  yield takeEvery('FETCH_CONSULTANTS_REQUEST', function*() {
    try {
      const url =  `${API_URL}/consultants/`
      const filterObj = {
        include: [{
          relation: 'user'
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
      console.log(result)
      yield put({
        type: actions.FETCH_CONSULTANTS_SUCCESS,
        payload: result,
      });
    } catch(err) {
      notification('error', err.message || 'Internal Server Error');
      yield put({ type: actions.FETCH_CONSULTANTS_ERROR });
    }
  });
}

export function* deleteRequest() {
  yield takeEvery('DELETE_CONSULTANT_REQUEST', function*({ payload }) {
    const { delInfo } = payload;
    try {
      const url =  `${API_URL}/consultants/${delInfo.id}/`;
      const params = {
        method: 'DELETE',
      };
      yield call(request, url, params)
      yield put({
        type: actions.DELETE_CONSULTANT_SUCCESS,
        payload: delInfo,
      });
      notification('success', 'Successfully deleted!');
    } catch(err) {
      notification('error', err.message || 'Internal Server Error');
      yield put({ type: actions.DELETE_CONSULTANT_ERROR });
    }    
  });
}
export function* insertRequest() {
  yield takeEvery('INSERT_CONSULTANT_REQUEST', function*({ payload }) {
    const { postData } = payload

    try {
      const url =  `${API_URL}/consultants/`;
      const params = {
        method: 'POST',
        body: JSON.stringify({
          user_id: postData.id
        }),
      };
      const result = yield call(request, url, params)
      yield put({
        type: actions.INSERT_CONSULTANT_SUCCESS,
        payload: result,
      });
      yield put(goBack())
      notification('success', 'Successfully added!');
    } catch (err) {
      notification('error', err.message || 'Internal Server Error');
      yield put({ type: actions.INSERT_CONSULTANT_ERROR });
    }
  });
}


export function* getRequest() {
  yield takeEvery('GET_CONSULTANT_REQUEST', function*({ payload }) {
    const { postData } = payload;
    try {
      const url = `${API_URL}/consultants/${postData.index}/`;
      const result = yield call(request, url);
      yield put({
        type: actions.GET_CONSULTANT_SUCCESS,
        payload: result,
      });
    } catch(err) {
      notification('error', err.message || 'Internal Server Error');
      yield put({ type: actions.GET_CONSULTANT_ERROR });
    }
  });
}

export function* updateRequest() {
  yield takeEvery('UPDATE_CONSULTANT_REQUEST', function*({ payload }) {
    const { postData } = payload
    try {
      const url = `${API_URL}/consultants/${postData.id}/`
      const params = {
        method: 'PUT',
        body: JSON.stringify(postData),
      };
      const result = yield call(request, url, params);
      yield put({
        type: actions.UPDATE_CONSULTANT_SUCCESS,
        payload: result,
      });
      yield put(goBack())
      notification('success', 'Successfully updated!');
    } catch(err) {
      notification('error', err.message || 'Internal Server Error');
      yield put({ type: actions.UPDATE_PMGR_ERROR });
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
