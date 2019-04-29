import { all, takeEvery, put, fork, call } from 'redux-saga/effects';
import actions from './actions';
import { goBack } from 'react-router-redux';
import notification from '../../components/notification';
import request from '../../API/request';
import  { API_URL } from '../../API/env';

export function* fetchRequest() {
  yield takeEvery('FETCH_RMGRS_REQUEST', function*() {
    try {
      const url =  `${API_URL}/relationshipManagers`
      const filterObj = {
        // where: {
        //   name: "Relationship Manager"
        // },
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
      yield put({
        type: actions.FETCH_RMGRS_SUCCESS,
        payload: result,
      });
    } catch (err) {
      notification('error', err.message || 'Internal Server Error');
      yield put({ type: actions.FETCH_RMGRS_ERROR });
    }
  });
}

export function* deleteRequest() {
  yield takeEvery('DELETE_RMGR_REQUEST', function*({ payload }) {
    const { delInfo } = payload;
    try {
      const url =  `${API_URL}/relationshipManagers/${delInfo.id}`;
      const params = {
        method: 'DELETE',
      };
      yield call(request, url, params)
      yield put({
        type: actions.DELETE_RMGR_SUCCESS,
        payload: delInfo,
      });
      notification('success', 'Successfully deleted!');
    } catch (err) {
      notification('error', err.message || 'Internal Server Error');
      yield put({ type: actions.DELETE_RMGR_ERROR });
    }
    
  });
}

export function* insertRequest() {
  yield takeEvery('INSERT_RMGR_REQUEST', function*({ payload }) {
    const { postData } = payload
    try {
      const url =  `${API_URL}/relationshipManagers`;
      const params = {
        method: 'POST',
        body: JSON.stringify({
          user_id: postData.id
        }),
      };
      const result = yield call(request, url, params)
      yield put({
        type: actions.INSERT_RMGR_SUCCESS,
        payload: result,
      });
      yield put(goBack())
      notification('success', 'Successfully added!');
    } catch (err) {
      notification('error', err.message || 'Internal Server Error');
      yield put({ type: actions.INSERT_RMGR_ERROR });
    }
  });
}

export default function* rootSaga() {
  yield all([
    fork(fetchRequest),
    fork(deleteRequest),
    fork(insertRequest),
  ]);
}
