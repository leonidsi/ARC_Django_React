import { all, takeEvery, put, fork, call } from 'redux-saga/effects';
import { goBack } from 'react-router-redux';
import actions from './actions';
import notification from '../../components/notification';
import request from '../../API/request';
import  { API_URL } from '../../API/env'

export function* fetchRequest() {
  yield takeEvery('FETCH_USERS_REQUEST', function*() {
    try {
      const url = `${API_URL}/users`;
      const filterObj = {
        include: [{
          relation: 'userRoles',
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
        type: actions.FETCH_USERS_SUCCESS,
        payload: result,
      });
    } catch(err) {
      notification('error', err.message || 'Internal Server Error');
      yield put({ type: actions.FETCH_USERS_ERROR });
    }
  });
}

export function* fetchUnassignedRequest() {
  yield takeEvery('FETCH_UNASSIGNED_REQUEST', function*() {
    try {
      const url = `${API_URL}/users`;
      const filterObj = {
        include: [{
          relation: 'userRoles',
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

      const unassignedUsers = result.filter(user => {
        return !user.userRoles || user.userRoles.length < 1 || user.userRoles[0].id === 1    // userRole.id = 1 is Not Assigned Role
      })

      yield put({
        type: actions.FETCH_UNASSIGNED_SUCCESS,
        payload: unassignedUsers,
      });
    } catch(err) {
      notification('error', err.message || 'Internal Server Error');
      yield put({ type: actions.FETCH_UNASSIGNED_ERROR });
    }
  });
}

export function* deleteRequest() {
  yield takeEvery('DELETE_USER_REQUEST', function*({ payload }) {
    const { delInfo } = payload;
    try {
      const url = `${API_URL}/users/${delInfo.id}/`; 
      const params = {
        method: 'DELETE',
      };
      yield call(request, url, params);
      yield put({
        type: actions.DELETE_USER_SUCCESS,
        payload: { id: delInfo.id },
      });
      notification('success', 'Successfully deleted!');
    } catch (err) {
      notification('error', err.message || 'Internal Server Error');
      yield put({ type: actions.DELETE_USER_ERROR });
    }
  });
}

export function* insertRequest() {
  yield takeEvery('INSERT_USER_REQUEST', function*({ payload }) {
    const { postData } = payload
    
    try {
      const url = `${API_URL}/users/addUser`
      const params = {
        method: 'POST',
        body: JSON.stringify(postData),
      }
      const result = yield call(request, url, params);
      
      yield put({
        type: actions.INSERT_USER_SUCCESS,
        payload: result,
      });
      yield put(goBack())
      notification('success', 'Successfully added!');  
    } catch (err) {
      notification('error', err.message || 'Internal Server Error');
      yield put({ type: actions.INSERT_USER_ERROR });
    }
  });
}

export function* getRequest() {
  yield takeEvery('GET_USER_REQUEST', function*({ payload }) {
    const { postData } = payload
    try {
      const url = `${API_URL}/users/${postData.index}`
      const filterObj = {
        include: [{
          relation: 'userRoles',
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
        type: actions.GET_USER_SUCCESS,
        payload: result,
      });
    } catch(err) {
      notification('error', err.message || 'Internal Server Error');
      yield put({ type: actions.GET_USER_ERROR });
    }
  });
}

export function* updateRequest() {
  yield takeEvery('UPDATE_USER_REQUEST', function*({ payload }) {
    const { postData } = payload
    try {
      const url = `${API_URL}/users/updateUser/${postData.id}`
      const params = {
        method: 'PUT',
        body: JSON.stringify(postData),
      };
      const result = yield call(request, url, params);
      yield put({
        type: actions.UPDATE_USER_SUCCESS,
        payload: result,
      });
      yield put(goBack())
      notification('success', 'Successfully updated!');
    } catch(err) {
      notification('error', err.message || 'Internal Server Error');
      yield put({ type: actions.UPDATE_USER_ERROR });
    }
  });
}

export default function* rootSaga() {
  yield all([
    fork(fetchRequest),
    fork(fetchUnassignedRequest),
    fork(deleteRequest),
    fork(insertRequest),
    fork(getRequest),
    fork(updateRequest),
  ]);
}
