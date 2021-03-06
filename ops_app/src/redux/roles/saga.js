import { all, takeEvery, put, fork, call } from 'redux-saga/effects';
import actions from './actions';
import notification from '../../components/notification';
import request from '../../API/request';
import  { API_URL } from '../../API/env'

export function* fetchRequest() {
  yield takeEvery('FETCH_ROLES_REQUEST', function*({ payload }) {
    try {
      const url = `${API_URL}/userRoles/`
      const result = yield call(request, url);
      yield put({
        type: actions.FETCH_ROLES_SUCCESS,
        payload: result,
      });
    } catch(err) {
      notification('error', err.message || 'Internal Server Error');
      yield put({ type: actions.FETCH_ROLES_ERROR });
    }
  });
}

export default function* rootSaga() {
  yield all([
    fork(fetchRequest),
  ]);
}
