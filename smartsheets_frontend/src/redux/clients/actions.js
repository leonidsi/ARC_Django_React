const clientsActions = {
    FETCH_CLIENTS_REQUEST: 'FETCH_CLIENTS_REQUEST',
    FETCH_CLIENTS_SUCCESS: 'FETCH_CLIENTS_SUCCESS',
    FETCH_CLIENTS_ERROR: 'FETCH_CLIENTS_ERROR',
    fetchClients: payload => ({
        type: clientsActions.FETCH_CLIENTS_REQUEST,
        payload
    }),
    DELETE_CLIENT_REQUEST: 'DELETE_CLIENT_REQUEST',
    DELETE_CLIENT_SUCCESS: 'DELETE_CLIENT_SUCCESS',
    DELETE_CLIENT_ERROR: 'DELETE_CLIENT_ERROR',
    deleteClient: payload => ({
        type: clientsActions.DELETE_CLIENT_REQUEST,
        payload
    }),
    INSERT_CLIENT_REQUEST: 'INSERT_CLIENT_REQUEST',
    INSERT_CLIENT_SUCCESS: 'INSERT_CLIENT_SUCCESS',
    INSERT_CLIENT_ERROR: 'INSERT_CLIENT_ERROR',
    insertClient: payload => ({
        type: clientsActions.INSERT_CLIENT_REQUEST,
        payload
    }),
    GET_CLIENT_REQUEST: 'GET_CLIENT_REQUEST',
    GET_CLIENT_SUCCESS: 'GET_CLIENT_SUCCESS',
    GET_CLIENT_ERROR: 'GET_CLIENT_ERROR',
    getClient: payload => ({
        type: clientsActions.GET_CLIENT_REQUEST,
        payload
    }),
    UPDATE_CLIENT_REQUEST: 'UPDATE_CLIENT_REQUEST',
    UPDATE_CLIENT_SUCCESS: 'UPDATE_CLIENT_SUCCESS',
    UPDATE_CLIENT_ERROR: 'UPDATE_CLIENT_ERROR',
    updateClient: payload => ({
        type: clientsActions.UPDATE_CLIENT_REQUEST,
        payload
    }),
}
export default clientsActions;