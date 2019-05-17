import { fromJS } from "immutable";
import actions from "./actions";
import { mapManager } from '../../helpers/utility';

const initState = fromJS({
  projectMgrsList: [],
  singleManager: {}
});
export default function projectsReducer(state = initState, action) {
  switch (action.type) {
    case actions.FETCH_PMGRS_SUCCESS:
      let originProjectMgrs = action.payload
      originProjectMgrs.filter((item) => mapManager(item))
      return state.set('projectMgrsList', fromJS(originProjectMgrs));
    case actions.DELETE_PMGR_SUCCESS:
      return state
        .update('projectMgrsList', usersList => usersList.filter(item => item.get('id') !== action.payload.id));
    case actions.INSERT_PMGR_SUCCESS:
      return state
        .update('projectMgrsList', usersList => usersList.push(mapManager(action.payload)));
    case actions.GET_PMGR_SUCCESS: 
      return state
      .set('singleManager', fromJS(mapManager(action.payload)));
    default:
      return state
  }
}
