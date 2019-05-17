import { all, takeEvery, put, fork, call } from 'redux-saga/effects';
import { goBack } from 'react-router-redux';
import actions from './actions';
import notification from '../../components/notification';
import request from '../../API/request';
import  { API_URL } from '../../API/env'

export function* fetchRequest() {
  yield takeEvery('FETCH_PMGRS_REQUEST', function*() {
    try {
      const url =  `${API_URL}/project_managers/`
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
      yield put({
        type: actions.FETCH_PMGRS_SUCCESS,
        payload: result,
      });
    } catch (err) {
      notification('error', err.message || 'Internal Server Error');
      yield put({ type: actions.FETCH_PMGRS_ERROR });
      console.log('Product Managers fetch - Error');
    }
  });
}

export function* deleteRequest() {
  yield takeEvery('DELETE_PMGR_REQUEST', function*({ payload }) {
    const { delInfo } = payload;
    try {
      const url =  `${API_URL}/project_managers/${delInfo.id}/`;
      const params = {
        method: 'DELETE',
      };
      yield call(request, url, params)
      yield put({
        type: actions.DELETE_PMGR_SUCCESS,
        payload: delInfo,
      });
      notification('success', 'Successfully deleted!');
    } catch (err) {
      notification('error', err.message || 'Internal Server Error');
      yield put({ type: actions.DELETE_PMGR_ERROR });
      console.log('Product Manager delete role - Error');
    }
  });
}

export function* insertRequest() {
  yield takeEvery('INSERT_PMGR_REQUEST', function*({ payload }) {
    const { postData } = payload;
    try {
      const url =  `${API_URL}/project_managers/`;
      const params = {
        method: 'POST',
        body: JSON.stringify({
          user_id: postData.id
        }),
      };
      const result = yield call(request, url, params)
      yield put({
        type: actions.INSERT_PMGR_SUCCESS,
        payload: result,
      });
      yield put(goBack())
      notification('success', 'Successfully added!');
    } catch (err) {
      notification('error', err.message || 'Internal Server Error');
      yield put({ type: actions.INSERT_PMGR_ERROR });
      console.log('Product Manager insert - Error');
    }
  });
}

export function* getRequest() {
  yield takeEvery('GET_PMGR_REQUEST', function*({ payload }) {
    const { postData } = payload;
    try{
      const url = `${API_URL}/project_managers/${postData.index}/`;
      const result = yield call(request, url);
      yield put({
        type: actions.GET_PMGR_SUCCESS,
        payload: result,
      });

    } catch(err) {
      notification('error', err.message || 'Internal Server Error');
      yield put({ type: actions.GET_PMGR_ERROR });
    }
  });
}

export function* updateRequest() {
  yield takeEvery('UPDATE_PMGR_REQUEST', function*({ payload }) {
    const { postData } = payload;
    try {
      const url = `${API_URL}/project_managers/${postData.id}/`;
      const params = {
        method: 'PUT',
        body: JSON.stringify(postData),
      };
      const result = yield call(request, url, params);
      yield put({
        type: actions.UPDATE_PMGR_SUCCESS,
        payload: result,
      });
      yield put(goBack())
      notification('success', 'Successfully updated!');
    } catch (err) {
      notification('error', err.message || 'Internal Server Error');
      yield put({ type: actions.UPDATE_PMGR_ERROR });
      console.log('Product Manager update - Error');
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
