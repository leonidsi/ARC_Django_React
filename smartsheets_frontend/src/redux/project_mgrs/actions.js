const projectMgrActions = {
    FETCH_PMGRS_REQUEST: 'FETCH_PMGRS_REQUEST',
    FETCH_PMGRS_SUCCESS: 'FETCH_PMGRS_SUCCESS',
    FETCH_PMGRS_ERROR: 'FETCH_PMGRS_ERROR',
    fetchProjectMgrs: payload => ({
        type: projectMgrActions.FETCH_PMGRS_REQUEST,
        payload
    }),
    DELETE_PMGR_REQUEST: 'DELETE_PMGR_REQUEST',
    DELETE_PMGR_SUCCESS: 'DELETE_PMGR_SUCCESS',
    DELETE_PMGR_ERROR: 'DELETE_PMGR_ERROR',
    deleteProjectMgr: payload => ({
        type: projectMgrActions.DELETE_PMGR_REQUEST,
        payload
    }),
    INSERT_PMGR_REQUEST: 'INSERT_PMGR_REQUEST',
    INSERT_PMGR_SUCCESS: 'INSERT_PMGR_SUCCESS',
    INSERT_PMGR_ERROR: 'INSERT_PMGR_ERROR',
    insertProjectMgr: payload => ({
        type: projectMgrActions.INSERT_PMGR_REQUEST,
        payload
    }),
    GET_PMGR_REQUEST: 'GET_PMGR_REQUEST',
    GET_PMGR_SUCCESS: 'GET_PMGR_SUCCESS',
    GET_PMGR_ERROR: 'GET_PMGR_ERROR',
    getProjectMgr: payload => ({
        type: projectMgrActions.GET_PMGR_REQUEST,
        payload
    }),
    UPDATE_PMGR_REQUEST: 'UPDATE_PMGR_REQUEST',
    UPDATE_PMGR_SUCCESS: 'UPDATE_PMGR_SUCCESS',
    UPDATE_PMGR_ERROR: 'UPDATE_PMGR_ERROR',
    updateProjectMgr: payload => ({
        type: projectMgrActions.UPDATE_PMGR_REQUEST,
        payload
    }),
}
export default projectMgrActions;