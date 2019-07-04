import { Map } from "immutable";
import actions from "./actions";
import { mapContract } from "../../helpers/utility";

const initState = new Map({
  contractsList: [],
  singleContract: {},
  loading: false
});
export default function contractsReducer(state = initState, action) {
  switch (action.type) {
    case actions.FETCH_CONTRACTS_SUCCESS:
      return { contractsList: action.payload.map(c => mapContract(c)) }
    case actions.DELETE_CONTRACT_SUCCESS:
      let { contractsList } = state
      contractsList = contractsList.filter((item) => item.id !== action.payload.id)
      return { contractsList }
    case actions.INSERT_CONTRACT_REQUEST:
    case actions.UPDATE_CONTRACT_REQUEST:
      return { ...state, loading: true }
    case actions.INSERT_CONTRACT_ERROR:
    case actions.UPDATE_CONTRACT_ERROR:
      return { ...state, loading: false }
    case actions.INSERT_CONTRACT_SUCCESS:
      const contractsListOrigin = state.contractsList
      return { contractsList: contractsListOrigin.concat([action.payload]), loading: false }
    case actions.GET_CONTRACT_SUCCESS:
      return { singleContract: action.payload } 
    default:
      return state
  }
}
