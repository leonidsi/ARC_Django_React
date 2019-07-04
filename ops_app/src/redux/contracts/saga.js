import { all, takeEvery, put, fork, call } from 'redux-saga/effects';
import { goBack } from 'react-router-redux';
import actions from './actions';
import notification from '../../components/notification';
import request from '../../API/request';
import  { API_URL } from '../../API/env'

export function* fetchRequest() {
  yield takeEvery('FETCH_CONTRACTS_REQUEST', function*() {
    try {
      const url = `${API_URL}/contracts/`
      const filterObj = {
        include: [{
          relation: 'client_id',
        }, {
          relation: 'sales_rep_id',
          scope: {
            include: 'user_id'
          }
        }, {
          relation: 'relationship_manager_id',
          scope: {
            include: 'user_id'
          }
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
        type: actions.FETCH_CONTRACTS_SUCCESS,
        payload: result,
      });
    } catch(err) {
      notification('error', err.message || 'Internal Server Error');
      yield put({ type: actions.FETCH_CONTRACTS_ERROR });
    }
  });
}

export function* deleteRequest() {
  yield takeEvery('DELETE_CONTRACT_REQUEST', function*({ payload }) {
    const { delInfo } = payload;
    try {
      const url = `${API_URL}/contracts/${delInfo.index}/`;
      const params = {
        method: 'DELETE',
      };
      yield call(request, url, params);
      yield put({
        type: actions.DELETE_CONTRACT_SUCCESS,
        payload: { id: delInfo.index },
      });
      notification('success', 'Successfully deleted!');
    } catch (err) {
      notification('error', err.message || 'Internal Server Error');
      yield put({ type: actions.DELETE_CONTRACT_ERROR });
    }
  });
}

export function* insertRequest() {
  yield takeEvery('INSERT_CONTRACT_REQUEST', function*({ payload }) {
    const { postData } = payload
    try {
      const url = `${API_URL}/contracts/`
      const params = {
        method: 'POST',
        body: JSON.stringify(postData)
      };
      const result = yield call(request, url, params);
      yield put({
        type: actions.INSERT_CONTRACT_SUCCESS,
        payload: result,
      });
      yield put(goBack())
      notification('success', 'Successfully added!');
    } catch(err) {
      notification('error', err.message || 'Internal Server Error');
      yield put({ type: actions.INSERT_CONTRACT_ERROR });
    }
  });
}
export function* getRequest() {
  yield takeEvery('GET_CONTRACT_REQUEST', function*({ payload }) {
    const { postData } = payload
    try {
      const url = `${API_URL}/contracts/${postData.index}/`;
      const result = yield call(request, url);
      yield put({
        type: actions.GET_CONTRACT_SUCCESS,
        payload: result,
      });
    } catch(err) {
      notification('error', err.message || 'Internal Server Error');
      yield put({ type: actions.GET_CONTRACT_ERROR });
    }
  });
}

export function* updateRequest() {
  yield takeEvery('UPDATE_CONTRACT_REQUEST', function*({ payload }) {
    const { postData } = payload
    try {
      const url = `${API_URL}/contracts/${postData.id}/`
      const params = {
        method: 'PUT',
        body: JSON.stringify(postData)
      }
      const result = yield call(request, url, params);
      yield put({
        type: actions.UPDATE_CONTRACT_SUCCESS,
        payload: result,
      });
      yield put(goBack())
      notification('success', 'Successfully updated!');
    } catch(err) {
      notification('error', err.message || 'Internal Server Error');
      yield put({ type: actions.UPDATE_CONTRACT_ERROR });
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
