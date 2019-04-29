import { Map } from "immutable";
import actions from "./actions";

const initState = new Map({
  howFoundPyxList: [],
  singlePyx: {}
});
export default function howFoundPyxReducer(state = initState, action) {
  switch (action.type) {
    case actions.FETCH_HOWFOUNDPYX_SUCCESS:
      let originHowFoundPyx = action.payload
      originHowFoundPyx.filter((item) => {
        for (let key in item) {
          if (item[key] === null) item[key] = ''
        }
        return item        
      })
      return { howFoundPyxList: originHowFoundPyx }     
    case actions.DELETE_HOWFOUNDPYX_SUCCESS:
      let { howFoundPyxList } = state
      howFoundPyxList = howFoundPyxList.filter((item) => item.id !== action.payload.id)
      return { howFoundPyxList }
    case actions.INSERT_HOWFOUNDPYX_SUCCESS:
      const howFoundPyxListOrigin = state.howFoundPyxList
      return { howFoundPyxList: howFoundPyxListOrigin.concat([action.payload]) }  
    case actions.GET_HOWFOUNDPYX_SUCCESS: 
      return { singlePyx: action.payload } 
    default:
      return state
  }
}
