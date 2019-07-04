import { all, takeEvery, takeLatest, put, fork, call } from 'redux-saga/effects';
import actions from './actions';
import notification from '../../components/notification';
import request from '../../API/request';
import  { API_URL } from '../../API/env';

export function* fetchListRequest() {
  yield takeLatest('FETCH_SHEETS_REQUEST', function*({ payload }) {
    const { postData } = payload;
    try {
      const url = `${API_URL}/projects/getSheets`;
      const params = {
        method: 'POST',
        body: JSON.stringify(postData),
      };
      const result = yield call(request, url, params);
      yield put({
        type: actions.FETCH_SHEETS_SUCCESS,
        payload: result,
      });
    } catch(err) {
      notification('error', err.message || 'Internal Server Error');
      yield put({ type: actions.FETCH_SHEETS_ERROR });
    }
    
  });
}
export function* fetchKeyDatesRequest() {
  yield takeEvery('FETCH_KEYDATES_REQUEST', function*({ payload }) {
    const { postData } = payload;
    try {
      const url = `${API_URL}/projects/getKeydates` 
      const params = {
        method: 'POST',
        body: JSON.stringify(postData),
      };
      const result = yield call(request, url, params);
      yield put({
        type: actions.FETCH_KEYDATES_SUCCESS,
        payload: result,
      });
    } catch(err) {
      notification('error', err.message || 'Internal Server Error');
      yield put({ type: actions.FETCH_KEYDATES_ERROR });
    }
  });
}

export default function* rootSaga() {
    yield all([
      fork(fetchListRequest),
      fork(fetchKeyDatesRequest),      
    ]);
  }