import { Map } from "immutable";
import actions from "./actions";

const initState = new Map({
  projectStatusList: [],
  singleStatus: {}
});
export default function projectStatusReducer(state = initState, action) {
  switch (action.type) {
    case actions.FETCH_PSTATUS_SUCCESS:
      let originProjectStatus = action.payload
      originProjectStatus.filter((item) => {
        for (let key in item) {
          if (item[key] === null) item[key] = ''
        }
        return item        
      })
      return { projectStatusList: originProjectStatus }     
    case actions.DELETE_PSTATUS_SUCCESS:
      let { projectStatusList } = state
      projectStatusList = projectStatusList.filter((item) => item.id !== action.payload.id)
      return { projectStatusList }
    case actions.INSERT_PSTATUS_SUCCESS:
      const projectStatusListOrigin = state.projectStatusList
      return { projectStatusList: projectStatusListOrigin.concat([action.payload]) }  
    case actions.GET_PSTATUS_SUCCESS: 
      return { singleStatus: action.payload }
    default:
      return state
  }
}
