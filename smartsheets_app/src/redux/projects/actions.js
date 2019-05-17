const projectActions = {
    FETCH_PROJECTS_REQUEST: 'FETCH_PROJECTS_REQUEST',
    FETCH_PROJECTS_SUCCESS: 'FETCH_PROJECTS_SUCCESS',
    FETCH_PROJECTS_ERROR: 'FETCH_PROJECTS_ERROR',
    fetchProjects: payload => ({
        type: projectActions.FETCH_PROJECTS_REQUEST,
        payload
    }),
    DELETE_PROJECT_REQUEST: 'DELETE_PROJECT_REQUEST',
    DELETE_PROJECT_SUCCESS: 'DELETE_PROJECT_SUCCESS',
    DELETE_PROJECT_ERROR: 'DELETE_PROJECT_ERROR',
    deleteProject: payload => ({
        type: projectActions.DELETE_PROJECT_REQUEST,
        payload
    }),
    INSERT_PROJECT_REQUEST: 'INSERT_PROJECT_REQUEST',
    INSERT_PROJECT_SUCCESS: 'INSERT_PROJECT_SUCCESS',
    INSERT_PROJECT_ERROR: 'INSERT_PROJECT_ERROR',
    insertProject: payload => ({
        type: projectActions.INSERT_PROJECT_REQUEST,
        payload
    }),
    GET_PROJECT_REQUEST: 'GET_PROJECT_REQUEST',
    GET_PROJECT_SUCCESS: 'GET_PROJECT_SUCCESS',
    GET_PROJECT_ERROR: 'GET_PROJECT_ERROR',
    getProject: payload => ({
        type: projectActions.GET_PROJECT_REQUEST,
        payload
    }),
    UPDATE_PROJECT_REQUEST: 'UPDATE_PROJECT_REQUEST',
    UPDATE_PROJECT_SUCCESS: 'UPDATE_PROJECT_SUCCESS',
    UPDATE_PROJECT_ERROR: 'UPDATE_PROJECT_ERROR',
    updateProject: payload => ({
        type: projectActions.UPDATE_PROJECT_REQUEST,
        payload
    }),

}
export default projectActions;