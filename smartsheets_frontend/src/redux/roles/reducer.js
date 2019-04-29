import { Map } from "immutable";
import actions from "./actions";

const initState = new Map({
  rolesList: []
});
export default function rolesReducer(state = initState, action) {
  switch (action.type) {
    case actions.FETCH_ROLES_SUCCESS:
      let originRoles = action.payload
      originRoles.filter((item) => {
        for (let key in item) {
          if (item[key] === null) item[key] = ''
        }
        return item        
      })
      return { rolesList: originRoles }     
    case actions.DELETE_ROLE_SUCCESS:
      let { rolesList } = state
      rolesList = rolesList.filter((item) => item.id !== action.payload.id)
      return { rolesList }
    case actions.INSERT_ROLE_SUCCESS:
      const rolesListOrigin = state.rolesList
      return { rolesList: rolesListOrigin.concat([action.payload]) }  
    default:
      return state
  }
}
