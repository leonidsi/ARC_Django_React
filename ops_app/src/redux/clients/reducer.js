import { Map } from "immutable";
import actions from "./actions";
import { mapClient } from "../../helpers/utility";

const initState = new Map({
  clientsList: [],
  singleClient: {},
  loading: false
});
export default function clientsReducer(state = initState, action) {
  switch (action.type) {
    case actions.FETCH_CLIENTS_SUCCESS:
      return { clientsList: action.payload.map(c => mapClient(c)) }
    case actions.DELETE_CLIENT_SUCCESS:
      let { clientsList } = state
      clientsList = clientsList.filter((item) => item.id !== action.payload.id)
      return { clientsList }
    case actions.INSERT_CLIENT_REQUEST:
    case actions.UPDATE_CLIENT_REQUEST:
      return { ...state, loading: true }
    case actions.INSERT_CLIENT_ERROR:
    case actions.UPDATE_CLIENT_ERROR:
      return { ...state, loading: false }
    case actions.INSERT_CLIENT_SUCCESS:
      const clientsListOrigin = state.clientsList
      return { clientsList: clientsListOrigin.concat([action.payload]), loading: false }
    case actions.GET_CLIENT_SUCCESS:
      return { singleClient: action.payload } 
    default:
      return state
  }
}
