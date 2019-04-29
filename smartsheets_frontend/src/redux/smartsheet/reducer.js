import { Map } from "immutable";
import actions from "./actions";

const initState = new Map({
  sheetsList: [],
  keydatesList: {}
});
export default function sheetsReducer(state = initState, action) {
  switch (action.type) {
    case actions.CLEAR_SHEETS:
        return { ...state, sheetsList: [], keydatesList: {} }
    case actions.FETCH_SHEETS_SUCCESS:
        return { ...state, sheetsList: action.payload }
      case actions.FETCH_SHEETS_REQUEST:
        return { keydatesList: {}, sheetsList: [] }  
    case actions.FETCH_KEYDATES_SUCCESS:
        return { ...state, keydatesList: action.payload }  
    case actions.FETCH_KEYDATES_REQUEST:
        return { ...state, keydatesList: {} }
    default:
      return state
  }
}
