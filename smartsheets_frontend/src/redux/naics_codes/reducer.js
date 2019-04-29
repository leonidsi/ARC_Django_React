import { Map } from "immutable";
import actions from "./actions";

const initState = new Map({
  naicsCodesList: [],
  singleCode: {},
  loading: false
});
export default function naicsCodesReducer(state = initState, action) {
  switch (action.type) {
    case actions.FETCH_NAICSCODES_SUCCESS:
      let originNaicsCodes = action.payload
      originNaicsCodes.filter((item) => {
        for (let key in item) {
          if (item[key] === null) item[key] = ''
        }
        return item        
      })
      return { naicsCodesList: originNaicsCodes }     
    case actions.DELETE_NAICSCODES_SUCCESS:
      let { naicsCodesList } = state
      naicsCodesList = naicsCodesList.filter((item) => item.id !== action.payload.id)
      return { naicsCodesList }
    case actions.INSERT_NAICSCODES_REQUEST:
    case actions.UPDATE_NAICSCODES_REQUEST:
      return { ...state, loading: true }
    case actions.INSERT_NAICSCODES_ERROR:
    case actions.UPDATE_NAICSCODES_ERROR:
      return { ...state, loading: false }
    case actions.INSERT_NAICSCODES_SUCCESS:
      const naicsCodesListOrigin = state.naicsCodesList
      return { naicsCodesList: naicsCodesListOrigin.concat([action.payload]), loading: false }  
    case actions.GET_NAICSCODES_SUCCESS: 
      return { singleCode: action.payload } 
    default:
      return state
  }
}
