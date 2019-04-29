const accountMgrActions = {
    FETCH_AMGRS_REQUEST: 'FETCH_AMGRS_REQUEST',
    FETCH_AMGRS_SUCCESS: 'FETCH_AMGRS_SUCCESS',
    FETCH_AMGRS_ERROR: 'FETCH_AMGRS_ERROR',
    fetchAccountMgrs: payload => ({
        type: accountMgrActions.FETCH_AMGRS_REQUEST,
        payload
    }),
    DELETE_AMGR_REQUEST: 'DELETE_AMGR_REQUEST',
    DELETE_AMGR_SUCCESS: 'DELETE_AMGR_SUCCESS',
    DELETE_AMGR_ERROR: 'DELETE_AMGR_ERROR',
    deleteAccountMgr: payload => ({
        type: accountMgrActions.DELETE_AMGR_REQUEST,
        payload
    }),
    INSERT_AMGR_REQUEST: 'INSERT_AMGR_REQUEST',
    INSERT_AMGR_SUCCESS: 'INSERT_AMGR_SUCCESS',
    INSERT_AMGR_ERROR: 'INSERT_AMGR_ERROR',
    insertAccountMgr: payload => ({
        type: accountMgrActions.INSERT_AMGR_REQUEST,
        payload
    }),
    GET_AMGR_REQUEST: 'GET_AMGR_REQUEST',
    GET_AMGR_SUCCESS: 'GET_AMGR_SUCCESS',
    GET_AMGR_ERROR: 'GET_AMGR_ERROR',
    getAccountMgr: payload => ({
        type: accountMgrActions.GET_AMGR_REQUEST,
        payload
    }),
    UPDATE_AMGR_REQUEST: 'UPDATE_AMGR_REQUEST',
    UPDATE_AMGR_SUCCESS: 'UPDATE_AMGR_SUCCESS',
    UPDATE_AMGR_ERROR: 'UPDATE_AMGR_ERROR',
    updateAccountMgr: payload => ({
        type: accountMgrActions.UPDATE_AMGR_REQUEST,
        payload
    }),
}
export default accountMgrActions;