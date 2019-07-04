import { Map } from "immutable";
import actions from "./actions";

const initState = new Map({
  serversList: []
});
export default function serversReducer(state = initState, action) {
  switch (action.type) {
    case actions.FETCH_SERVERS_SUCCESS:
      let originServers = action.payload
      originServers.filter((item) => {
        for (let key in item) {
          if (item[key] === null) item[key] = ''
        }
        return item        
      })
      return { serversList: originServers }     
    case actions.DELETE_SERVER_SUCCESS:
      let { serversList } = state
      serversList = serversList.filter((item) => item.id !== action.payload.id)
      return { serversList }
    case actions.INSERT_SERVER_SUCCESS:
      const serversListOrigin = state.serversList
      return { serversList: serversListOrigin.concat([action.payload]) }  
    default:
      return state
  }
}
