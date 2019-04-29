const serversActions = {
    FETCH_SERVERS_REQUEST: 'FETCH_SERVERS_REQUEST',
    FETCH_SERVERS_SUCCESS: 'FETCH_SERVERS_SUCCESS',
    FETCH_SERVERS_ERROR: 'FETCH_SERVERS_ERROR',
    fetchServers: payload => ({
        type: serversActions.FETCH_SERVERS_REQUEST,
    }),
    DELETE_SERVER_REQUEST: 'DELETE_SERVER_REQUEST',
    DELETE_SERVER_SUCCESS: 'DELETE_SERVER_SUCCESS',
    DELETE_SERVER_ERROR: 'DELETE_SERVER_ERROR',
    deleteServer: payload => ({
        type: serversActions.DELETE_SERVER_REQUEST,
        payload
    }),
    INSERT_SERVER_REQUEST: 'INSERT_SERVER_REQUEST',
    INSERT_SERVER_SUCCESS: 'INSERT_SERVER_SUCCESS',
    INSERT_SERVER_ERROR: 'INSERT_SERVER_ERROR',
    insertServer: payload => ({
        type: serversActions.INSERT_SERVER_REQUEST,
        payload
    }),
}
export default serversActions;