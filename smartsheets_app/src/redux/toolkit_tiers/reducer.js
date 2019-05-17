import { Map } from "immutable";
import actions from "./actions";

const initState = new Map({
  toolkitTiersList: []
});
export default function toolkitTiersReducer(state = initState, action) {
  switch (action.type) {
    case actions.FETCH_TOOLKITTIERS_SUCCESS:
      let originToolkitTiers = action.payload
      originToolkitTiers.filter((item) => {
        for (let key in item) {
          if (item[key] === null) item[key] = ''
        }
        return item        
      })
      return { toolkitTiersList: originToolkitTiers }     
    case actions.DELETE_TOOLKITTIERS_SUCCESS:
      let { toolkitTiersList } = state
      toolkitTiersList = toolkitTiersList.filter((item) => item.id !== action.payload.id)
      return { toolkitTiersList }
    case actions.INSERT_TOOLKITTIERS_SUCCESS:
      const toolkitTiersListOrigin = state.toolkitTiersList
      return { toolkitTiersList: toolkitTiersListOrigin.concat([action.payload]) }  
    default:
      return state
  }
}
