import { fromJS } from "immutable";
import actions from "./actions";
import { mapManager } from '../../helpers/utility';

const initState = fromJS({
  accountMgrsList: [],
  singleManager: {},
  loading: false
});
export default function accountsReducer(state = initState, action) {
  switch (action.type) {
    case actions.FETCH_AMGRS_SUCCESS:
      let originAccountMgrs = action.payload
      originAccountMgrs.filter((item) => mapManager(item))
      return state.set('accountMgrsList', fromJS(originAccountMgrs));
    case actions.DELETE_AMGR_SUCCESS:
      return state.update('accountMgrsList', usersList => usersList.filter(item => item.get('id') !== action.payload.id));
    case actions.INSERT_AMGR_REQUEST:
      console.log(action.type)
      return state.set('loading', true)
    case actions.INSERT_AMGR_ERROR:
      return state.set('loading', false)
    case actions.INSERT_AMGR_SUCCESS:
      return state.update('accountMgrsList', usersList => usersList.push(mapManager(action.payload)))
      .set('loading', false);
    case actions.GET_AMGR_SUCCESS: 
      console.log(action.type)
      return state.set('singleManager', fromJS(mapManager(action.payload)));
    default:
      return state
  }
}
