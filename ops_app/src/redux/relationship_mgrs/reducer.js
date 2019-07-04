import { fromJS } from "immutable";
import actions from "./actions";
import { mapManager } from '../../helpers/utility';

const initState = fromJS({
  relationshipMgrsList: [],
  singleManager: {}
});
export default function relationshipManagersReducer(state = initState, action) {
  switch (action.type) {
    case actions.FETCH_RMGRS_SUCCESS:
      let originRelationshipMgrs = action.payload
      originRelationshipMgrs.filter((item) => mapManager(item))
      return state.set('relationshipMgrsList', fromJS(originRelationshipMgrs));
    case actions.DELETE_RMGR_SUCCESS:
      return state.update('relationshipMgrsList', usersList => usersList.filter(item => item.get('id') !== action.payload.id));
    case actions.INSERT_RMGR_SUCCESS:
      return state.update('relationshipMgrsList', usersList => usersList.push(mapManager(action.payload)));
    case actions.GET_RMGR_SUCCESS: 
      return state.set('singleManager', fromJS(mapManager(action.payload)));
    default:
      return state
  }
}
