import { all, takeEvery, put, fork, call } from 'redux-saga/effects';
import actions from './actions';
import { goBack } from 'react-router-redux';
import notification from '../../components/notification';
import request from '../../API/request';
import  { API_URL } from '../../API/env';

export function* fetchRequest() {
  yield takeEvery('FETCH_AMGRS_REQUEST', function*() {
    try {
      const url =  `${API_URL}/account_managers/`
      const filterObj = {
        // where: {
        //   name: "Account Manager"
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
        type: actions.FETCH_AMGRS_SUCCESS,
        payload: result,
      });
    } catch (err) {
      notification('error', err.message || 'Internal Server Error');
      yield put({ type: actions.FETCH_AMGRS_ERROR });
    }
  });
}

export function* deleteRequest() {
  yield takeEvery('DELETE_AMGR_REQUEST', function*({ payload }) {
    const { delInfo } = payload;
    try {
      const url =  `${API_URL}/account_managers/${delInfo.id}/`;
      const params = {
        method: 'DELETE',
      };
      yield call(request, url, params)
      yield put({
        type: actions.DELETE_AMGR_SUCCESS,
        payload: delInfo,
      });
      notification('success', 'Successfully deleted!');
    } catch (err) {
      notification('error', err.message || 'Internal Server Error');
      yield put({ type: actions.DELETE_AMGR_ERROR });
    }
    
  });
}

export function* insertRequest() {
  yield takeEvery('INSERT_AMGR_REQUEST', function*({ payload }) {
    const { postData } = payload
    try {
      const url =  `${API_URL}/account_managers/`;
      const params = {
        method: 'POST',
        body: JSON.stringify({
          user_id: postData.id
        }),
      };
      const result = yield call(request, url, params)
      yield put({
        type: actions.INSERT_AMGR_SUCCESS,
        payload: result,
      });
      yield put(goBack())
      notification('success', 'Successfully added!');
    } catch (err) {
      notification('error', err.message || 'Internal Server Error');
      yield put({ type: actions.INSERT_AMGR_ERROR });
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
