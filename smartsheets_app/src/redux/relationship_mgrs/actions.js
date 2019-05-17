const relationshipMgrActions = {
    FETCH_RMGRS_REQUEST: 'FETCH_RMGRS_REQUEST',
    FETCH_RMGRS_SUCCESS: 'FETCH_RMGRS_SUCCESS',
    FETCH_RMGRS_ERROR: 'FETCH_RMGRS_ERROR',
    fetchRelationshipMgrs: payload => ({
        type: relationshipMgrActions.FETCH_RMGRS_REQUEST,
        payload
    }),
    DELETE_RMGR_REQUEST: 'DELETE_RMGR_REQUEST',
    DELETE_RMGR_SUCCESS: 'DELETE_RMGR_SUCCESS',
    DELETE_RMGR_ERROR: 'DELETE_RMGR_ERROR',
    deleteRelationshipMgr: payload => ({
        type: relationshipMgrActions.DELETE_RMGR_REQUEST,
        payload
    }),
    INSERT_RMGR_REQUEST: 'INSERT_RMGR_REQUEST',
    INSERT_RMGR_SUCCESS: 'INSERT_RMGR_SUCCESS',
    INSERT_RMGR_ERROR: 'INSERT_RMGR_ERROR',
    insertRelationshipMgr: payload => ({
        type: relationshipMgrActions.INSERT_RMGR_REQUEST,
        payload
    }),
    GET_RMGR_REQUEST: 'GET_RMGR_REQUEST',
    GET_RMGR_SUCCESS: 'GET_RMGR_SUCCESS',
    GET_RMGR_ERROR: 'GET_RMGR_ERROR',
    getRelationshipMgr: payload => ({
        type: relationshipMgrActions.GET_RMGR_REQUEST,
        payload
    }),
    UPDATE_RMGR_REQUEST: 'UPDATE_RMGR_REQUEST',
    UPDATE_RMGR_SUCCESS: 'UPDATE_RMGR_SUCCESS',
    UPDATE_RMGR_ERROR: 'UPDATE_RMGR_ERROR',
    updateRelationshipMgr: payload => ({
        type: relationshipMgrActions.UPDATE_RMGR_REQUEST,
        payload
    }),
}
export default relationshipMgrActions;