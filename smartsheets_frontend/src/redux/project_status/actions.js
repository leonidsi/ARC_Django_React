const projectStatusActions = {
    FETCH_PSTATUS_REQUEST: 'FETCH_PSTATUS_REQUEST',
    FETCH_PSTATUS_SUCCESS: 'FETCH_PSTATUS_SUCCESS',
    FETCH_PSTATUS_ERROR: 'FETCH_PSTATUS_ERROR',
    fetchProjectStatus: payload => ({
        type: projectStatusActions.FETCH_PSTATUS_REQUEST,
        payload
    }),
    DELETE_PSTATUS_REQUEST: 'DELETE_PSTATUS_REQUEST',
    DELETE_PSTATUS_SUCCESS: 'DELETE_PSTATUS_SUCCESS',
    DELETE_PSTATUS_ERROR: 'DELETE_PSTATUS_ERROR',
    deleteProjectStatus: payload => ({
        type: projectStatusActions.DELETE_PSTATUS_REQUEST,
        payload
    }),
    INSERT_PSTATUS_REQUEST: 'INSERT_PSTATUS_REQUEST',
    INSERT_PSTATUS_SUCCESS: 'INSERT_PSTATUS_SUCCESS',
    INSERT_PSTATUS_ERROR: 'INSERT_PSTATUS_ERROR',
    insertProjectStatus: payload => ({
        type: projectStatusActions.INSERT_PSTATUS_REQUEST,
        payload
    }),
    GET_PSTATUS_REQUEST: 'GET_PSTATUS_REQUEST',
    GET_PSTATUS_SUCCESS: 'GET_PSTATUS_SUCCESS',
    GET_PSTATUS_ERROR: 'GET_PSTATUS_ERROR',
    getProjectStatus: payload => ({
        type: projectStatusActions.GET_PSTATUS_REQUEST,
        payload
    }),
    UPDATE_PSTATUS_REQUEST: 'UPDATE_PSTATUS_REQUEST',
    UPDATE_PSTATUS_SUCCESS: 'UPDATE_PSTATUS_SUCCESS',
    UPDATE_PSTATUS_ERROR: 'UPDATE_PSTATUS_ERROR',
    updateProjectStatus: payload => ({
        type: projectStatusActions.UPDATE_PSTATUS_REQUEST,
        payload
    }),
}
export default projectStatusActions;