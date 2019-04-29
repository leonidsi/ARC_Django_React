import { all } from 'redux-saga/effects';
import authSagas from './auth/saga';
import projectSagas from './projects/saga';
import usersSagas from './users/saga';
import rolesSagas from './roles/saga';
import serversSagas from './servers/saga';
import toolkitTiersSagas from './toolkit_tiers/saga';
import otherProvidersSagas from './other_providers/saga';
import howFoundPyxSagas from './how_found_pyx/saga';
import naicsCodesSagas from './naics_codes/saga';
import projectMgrsSagas from './project_mgrs/saga';
import accountMgrsSagas from './account_mgrs/saga';
import relationshipMgrsSagas from './relationship_mgrs/saga';
import clientsSagas from './clients/saga';
import consultantsSagas from './consultants/saga';
import projectTypesSagas from './project_types/saga';
import projectStatusSagas from './project_status/saga';
import smartSheetSagas from './smartsheet/saga';

export default function* rootSaga(getState) {
  yield all([
    authSagas(),
    projectSagas(),
    usersSagas(),
    rolesSagas(),
    serversSagas(),
    toolkitTiersSagas(),
    otherProvidersSagas(),
    howFoundPyxSagas(),
    naicsCodesSagas(),
    projectMgrsSagas(),
    accountMgrsSagas(),
    relationshipMgrsSagas(),
    clientsSagas(),
    consultantsSagas(),
    projectTypesSagas(),
    projectStatusSagas(),
    smartSheetSagas(),
  ]);
}
