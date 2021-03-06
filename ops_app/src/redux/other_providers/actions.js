const otherProvidersActions = {
    FETCH_OTHERPROVIDERS_REQUEST: 'FETCH_OTHERPROVIDERS_REQUEST',
    FETCH_OTHERPROVIDERS_SUCCESS: 'FETCH_OTHERPROVIDERS_SUCCESS',
    FETCH_OTHERPROVIDERS_ERROR: 'FETCH_OTHERPROVIDERS_ERROR',
    fetchOtherProviders: payload => ({
        type: otherProvidersActions.FETCH_OTHERPROVIDERS_REQUEST,
    }),
    FETCH_OTHERPROVIDER_HISTORIES_REQUEST: 'FETCH_OTHERPROVIDER_HISTORIES_REQUEST',
    FETCH_OTHERPROVIDER_HISTORIES_SUCCESS: 'FETCH_OTHERPROVIDER_HISTORIES_SUCCESS',
    FETCH_OTHERPROVIDER_HISTORIES_ERROR: 'FETCH_OTHERPROVIDER_HISTORIES_ERROR',
    fetchOtherProviderHistories: payload => ({
        type: otherProvidersActions.FETCH_OTHERPROVIDER_HISTORIES_REQUEST,
    }),
    DELETE_OTHERPROVIDER_REQUEST: 'DELETE_OTHERPROVIDER_REQUEST',
    DELETE_OTHERPROVIDER_SUCCESS: 'DELETE_OTHERPROVIDER_SUCCESS',
    DELETE_OTHERPROVIDER_ERROR: 'DELETE_OTHERPROVIDER_ERROR',
    deleteOtherProvider: payload => ({
        type: otherProvidersActions.DELETE_OTHERPROVIDER_REQUEST,
        payload
    }),
    INSERT_OTHERPROVIDER_REQUEST: 'INSERT_OTHERPROVIDER_REQUEST',
    INSERT_OTHERPROVIDER_SUCCESS: 'INSERT_OTHERPROVIDER_SUCCESS',
    INSERT_OTHERPROVIDER_ERROR: 'INSERT_OTHERPROVIDER_ERROR',
    insertOtherProvider: payload => ({
        type: otherProvidersActions.INSERT_OTHERPROVIDER_REQUEST,
        payload
    }),
    GET_OTHERPROVIDER_REQUEST: 'GET_OTHERPROVIDER_REQUEST',
    GET_OTHERPROVIDER_SUCCESS: 'GET_OTHERPROVIDER_SUCCESS',
    GET_OTHERPROVIDER_ERROR: 'GET_OTHERPROVIDER_ERROR',
    getOtherProvider: payload => ({
        type: otherProvidersActions.GET_OTHERPROVIDER_REQUEST,
        payload
    }),
    UPDATE_OTHERPROVIDER_REQUEST: 'UPDATE_OTHERPROVIDER_REQUEST',
    UPDATE_OTHERPROVIDER_SUCCESS: 'UPDATE_OTHERPROVIDER_SUCCESS',
    UPDATE_OTHERPROVIDER_ERROR: 'UPDATE_OTHERPROVIDER_ERROR',
    updateOtherProvider: payload => ({
        type: otherProvidersActions.UPDATE_OTHERPROVIDER_REQUEST,
        payload
    }),
}
export default otherProvidersActions;