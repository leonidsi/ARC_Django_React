import { fromJS } from "immutable";
import actions from "./actions";
import { mapManager } from '../../helpers/utility';

const initState = fromJS({
  consultantsList: [],
  singleConsultant: {}
});
export default function consultantsReducer(state = initState, action) {
  switch (action.type) {
    case actions.FETCH_CONSULTANTS_SUCCESS:
      let originConsultants = action.payload
      originConsultants.filter((item) => mapManager(item))
      return state.set('consultantsList', fromJS(originConsultants));
    case actions.DELETE_CONSULTANT_SUCCESS:
      return state.update('consultantsList', usersList => usersList.filter(item => item.get('id') !== action.payload.id));
    case actions.INSERT_CONSULTANT_SUCCESS:
      return state.update('consultantsList', usersList => usersList.push(mapManager(action.payload)));
    case actions.GET_CONSULTANT_SUCCESS:
      return state.set('singleConsultant', fromJS(mapManager(action.payload)));
    default:
      return state
  }
}
