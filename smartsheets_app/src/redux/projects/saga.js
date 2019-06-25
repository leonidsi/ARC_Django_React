import { all, takeEvery, put, fork, call } from 'redux-saga/effects';
import { goBack } from 'react-router-redux';
import _ from 'lodash';
import actions from './actions';
import smartsheetActions from '../smartsheet/actions';
import notification from '../../components/notification';
import request from '../../API/request';
import  { API_URL } from '../../API/env';

export function* fetchRequest() {
  yield takeEvery('FETCH_PROJECTS_REQUEST', function*() {
    try {
      let url = `${API_URL}/projects/`
      let result
      const filterObj = {
        include: [{
          relation: 'project_mgr_id',
          scope: {
            include: 'user_id'
          }
        }, {
          relation: 'account_mgr_id',
          scope: {
            include: 'user_id'
          }
        }, {
          relation: 'consultant_id',
          scope: {
            include: 'user_id'
          }
        }, {
          relation: 'client_id',
        }, {
          relation: 'project_type_id',
        }],
      }
      const queryParams = {
        filter: JSON.stringify(filterObj),
      }
      let params = {
        method: 'GET',
        query: queryParams,
      }
      result = yield call(request, url, params);
      yield put({
        type: actions.FETCH_PROJECTS_SUCCESS,
        payload: result,
      });
    } catch(err) {
      notification('error', err.message || 'Internal Server Error');
      yield put({ type: actions.FETCH_PROJECTS_ERROR });
    }
  });
}

export function* fetchHistoryRequest() {
  yield takeEvery('FETCH_PROJECT_HISTORIES_REQUEST', function*({ payload }) {
    try {
      const url =  `${API_URL}/projects_histories/`;
      const result = yield call(request, url);
      yield put({
        type: actions.FETCH_PROJECT_HISTORIES_SUCCESS,
        payload: result,
      });
    } catch(err) {
      notification('error', err.message || 'Internal Server Error');
      yield put({ type: actions.FETCH_PROJECT_HISTORIES_ERROR });
    }
  });
}

export function* deleteRequest() {
  yield takeEvery('DELETE_PROJECT_REQUEST', function*({ payload }) {
    const { delInfo } = payload;    
    try {
      const delData = { id: delInfo.index };
      const url = `${API_URL}/projects/${delInfo.index}/`;
      const params = {
        method: 'DELETE',
      };
      yield call(request, url, params);
      yield put({
        type: actions.DELETE_PROJECT_SUCCESS,
        payload: delData,
      });
      notification('success', 'Successfully deleted!');        
    } catch(err) {
      notification('error', err.message || 'Internal Server Error');
      yield put({ type: actions.DELETE_PROJECT_ERROR });
    }
  });
}

export function* insertRequest() {
  yield takeEvery('INSERT_PROJECT_REQUEST', function*({ payload }) {
    const { postData } = payload;
    try {
      const url = `${API_URL}/projects/`;
      const params = {
        method: 'POST',
        body: JSON.stringify(postData),
      };
      const result = yield call(request, url, params);
      yield put({
        type: actions.INSERT_PROJECT_SUCCESS,
        payload: result,
      });
      yield put(goBack())
      notification('success', 'Successfully added!');   

    } catch(err) {
      notification('error', err.message || 'Internal Server Error');
      yield put({ type: actions.INSERT_PROJECT_ERROR });
    }
  });
}

export function* getRequest() {
  yield takeEvery('GET_PROJECT_REQUEST', function*({ payload }) {
    const { postData } = payload;
    try {
      let url = `${API_URL}/projects/${postData.index}/`
      const filterObj = {
        include: [{
          relation: 'project_mgr_id',
          scope: {
            include: 'user_id'
          }
        }, {
          relation: 'account_mgr_id',
          scope: {
            include: 'user_id'
          }
        }, {
          relation: 'consultant_id',
          scope: {
            include: 'user_id'
          }
        }, {
          relation: 'client_id',
        }, {
          relation: 'project_type_id',
        }],
      }
      const queryParams = {
        filter: JSON.stringify(filterObj),
      }
      let params = {
        method: 'GET',
        query: queryParams,
      }
      let project = yield call(request, url, params);
      let sheets = []
      let keyDates = {}

      if (project.project_mgr_id && project.project_mgr_id.user_id.smartsheetCode) {
        url = `${API_URL}/projects/getSheets`;
        params = {
          method: 'POST',
          body: JSON.stringify({ smartsheet_auth_code: project.projectManager.user.smartsheetCode}),
        };
        sheets = yield call(request, url, params);

        yield put({
          type: smartsheetActions.FETCH_SHEETS_SUCCESS,
          payload: sheets,
        });

        if (project.sheet_id) {
          url = `${API_URL}/projects/getKeydates`
          params = {
            method: 'POST',
            body: JSON.stringify({ smartsheet_auth_code: project.projectManager.user.smartsheetCode, sheet_id: project.sheet_id }),
          };
          keyDates = yield call(request, url, params);
          yield put({
            type: smartsheetActions.FETCH_KEYDATES_SUCCESS,
            payload: keyDates,
          });
        }
      }

      yield put({
        type: actions.GET_PROJECT_SUCCESS,
        payload: project,
      });


    } catch(err) {
      notification('error', err.message || 'Internal Server Error');
      yield put({ type: actions.GET_PROJECT_ERROR });
    }
  });
}

export function* updateRequest() {
  yield takeEvery('UPDATE_PROJECT_REQUEST', function*({ payload }) {
    const { postData } = payload;
    const data = _.cloneDeep(postData);

    delete data.accountManager;
    delete data.projectManager;
    delete data.consultant;
    delete data.projectType;

    try {
      const url = `${API_URL}/projects/${data.id}/`;
      const params = {
        method: 'PUT',
        body: JSON.stringify(data),
      };
      const result = yield call(request, url, params);
      yield put({
        type: actions.UPDATE_PROJECT_SUCCESS,
        payload: result,
      });
      yield put(goBack());
      notification('success', 'Information Saved!');   
    } catch(err) {
      notification('error', err.message || 'Internal Server Error');
      yield put({ type: actions.UPDATE_PROJECT_ERROR });
    }
  });
}

export function* getTemplateListRequest() {
  yield takeEvery('GET_TEMPLATELIST_REQUEST', function*() {
    try {
      let url = `${API_URL}/templates/`
      let params = {
        method: 'GET'
      }
      const result = yield call(request, url, params);
      yield put({
        type: actions.GET_TEMPLATELIST_SUCCESS,
        payload: result,
      });
    } catch(err) {
      notification('error', err.message || 'Internal Server Error');
      yield put({ type: actions.GET_TEMPLATELIST_ERROR });
    }
  });
}

export function* insertTemplateRequest() {
  yield takeEvery('INSERT_TEMPLATE_REQUEST', function*({ payload }) {
    const { postData } = payload;
    try {
      const url = `${API_URL}/templates/`;
      const params = {
        method: 'POST',
        body: JSON.stringify(postData),
      };
      const result = yield call(request, url, params);
      yield put({
        type: actions.INSERT_TEMPLATE_SUCCESS,
        payload: result,
      });
      yield put(goBack())
      notification('success', 'Successfully added!');   

    } catch(err) {
      notification('error', err.message || 'Internal Server Error');
      yield put({ type: actions.INSERT_TEMPLATE_ERROR });
    }
  });
}

export default function* rootSaga() {
  yield all([
    fork(fetchRequest),
    fork(fetchHistoryRequest),
    fork(deleteRequest),
    fork(insertRequest),   
    fork(getRequest),    
    fork(updateRequest),
    fork(getTemplateListRequest),
    fork(insertTemplateRequest),
  ]);
}
