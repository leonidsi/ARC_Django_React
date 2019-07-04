import { Map } from "immutable";
import actions from "./actions";

const initState = new Map({
  projectTypesList: [],
  singleType: {},
  loading: false    
});
export default function projectTypesReducer(state = initState, action) {
  switch (action.type) {
    case actions.FETCH_PTYPES_SUCCESS:
      let originProjectTypes = action.payload
      originProjectTypes.filter((item) => {
        for (let key in item) {
          if (item[key] === null) item[key] = ''
        }
        return item
      })
      return { projectTypesList: originProjectTypes }  
    case actions.DELETE_PTYPE_SUCCESS:
      let { projectTypesList } = state
      projectTypesList = projectTypesList.filter((item) => item.id !== action.payload.id)
      return { projectTypesList }
    case actions.INSERT_PTYPE_REQUEST:
    case actions.UPDATE_PTYPE_REQUEST:
      return { ...state, loading: true }
    case actions.INSERT_PTYPE_ERROR:
    case actions.UPDATE_PTYPE_ERROR:
      return { ...state, loading: false }
    case actions.INSERT_PTYPE_SUCCESS:
      const projectTypesListOrigin = state.projectTypesList
      return { projectTypesList: projectTypesListOrigin.concat([action.payload]), loading: false }  
    case actions.GET_PTYPE_SUCCESS: 
      return { singleType: action.payload }  
    default:
      return state
  }
}
