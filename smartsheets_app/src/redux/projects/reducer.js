import { Map } from "immutable";
import actions from "./actions";
import { mapProject } from "../../helpers/utility";

const initState = new Map({
  projectsList: [],
  singleProject: {},
  templateList: [],
  loading: false  
});
export default function projectsReducer(state = initState, action) {
  switch (action.type) {
    case actions.FETCH_PROJECTS_SUCCESS:
      // let originProjects = action.payload
      // originProjects.filter((item) => {
      //   for (let key in item) {
      //     if (item[key] === null) item[key] = ''
      //   }
      //   return item
      // })
      return { projectsList: action.payload.map(p => mapProject(p)) }
    case actions.DELETE_PROJECT_SUCCESS:
      let { projectsList } = state
      projectsList = projectsList.filter((item) => item.id !== action.payload.id)
      return { projectsList }
    case actions.INSERT_PROJECT_REQUEST:
    case actions.UPDATE_PROJECT_REQUEST:
      return { ...state, loading: true }
    case actions.INSERT_PROJECT_ERROR:
    case actions.UPDATE_PROJECT_ERROR:
      return { ...state, loading: false }
    case actions.INSERT_PROJECT_SUCCESS:
      const projectsListOrigin = state.projectsList
      return { projectsList: projectsListOrigin.concat([action.payload]), loading: false }    
    case actions.GET_PROJECT_SUCCESS: 
      return { singleProject: action.payload }
    case actions.GET_TEMPLATELIST_SUCCESS:
      return { templateList: action.payload }
    default:
      return state
  }
}
