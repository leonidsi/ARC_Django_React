import { Map } from "immutable";
import actions from "./actions";

const initState = new Map({
  otherProvidersList: [],
  singleProvider: {}
});
export default function otherProvidersReducer(state = initState, action) {
  switch (action.type) {
    case actions.FETCH_OTHERPROVIDERS_SUCCESS:
      let originOtherProviders = action.payload
      originOtherProviders.filter((item) => {
        for (let key in item) {
          if (item[key] === null) item[key] = ''
        }
        return item        
      })
      return { otherProvidersList: originOtherProviders }     
    case actions.DELETE_OTHERPROVIDER_SUCCESS:
      let { otherProvidersList } = state
      otherProvidersList = otherProvidersList.filter((item) => item.id !== action.payload.id)
      return { otherProvidersList }
    case actions.INSERT_OTHERPROVIDER_SUCCESS:
      const otherProvidersListOrigin = state.otherProvidersList
      return { otherProvidersList: otherProvidersListOrigin.concat([action.payload]) }  
    case actions.GET_OTHERPROVIDER_SUCCESS: 
      return { singleProvider: action.payload } 
    default:
      return state
  }
}
