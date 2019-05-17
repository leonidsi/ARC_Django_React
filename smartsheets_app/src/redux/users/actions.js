const usersActions = {
    FETCH_USERS_REQUEST: 'FETCH_USERS_REQUEST',
    FETCH_USERS_SUCCESS: 'FETCH_USERS_SUCCESS',
    FETCH_USERS_ERROR: 'FETCH_USERS_ERROR',
    fetchUsers: payload => ({
        type: usersActions.FETCH_USERS_REQUEST,
    }),
    FETCH_UNASSIGNED_REQUEST: 'FETCH_UNASSIGNED_REQUEST',
    FETCH_UNASSIGNED_SUCCESS: 'FETCH_UNASSIGNED_SUCCESS',
    FETCH_UNASSIGNED_ERROR: 'FETCH_UNASSIGNED_ERROR',
    fetchUnassigned: payload => ({
        type: usersActions.FETCH_UNASSIGNED_REQUEST,
        payload
    }),
    DELETE_USER_REQUEST: 'DELETE_USER_REQUEST',
    DELETE_USER_SUCCESS: 'DELETE_USER_SUCCESS',
    DELETE_USER_ERROR: 'DELETE_USER_ERROR',
    deleteUser: payload => ({
        type: usersActions.DELETE_USER_REQUEST,
        payload
    }),
    INSERT_USER_REQUEST: 'INSERT_USER_REQUEST',
    INSERT_USER_SUCCESS: 'INSERT_USER_SUCCESS',
    INSERT_USER_ERROR: 'INSERT_USER_ERROR',
    insertUser: payload => ({
        type: usersActions.INSERT_USER_REQUEST,
        payload
    }),
    GET_USER_REQUEST: 'GET_USER_REQUEST',
    GET_USER_SUCCESS: 'GET_USER_SUCCESS',
    GET_USER_ERROR: 'GET_USER_ERROR',
    getUser: payload => ({
        type: usersActions.GET_USER_REQUEST,
        payload
    }),
    UPDATE_USER_REQUEST: 'UPDATE_USER_REQUEST',
    UPDATE_USER_SUCCESS: 'UPDATE_USER_SUCCESS',
    UPDATE_USER_ERROR: 'UPDATE_USER_ERROR',
    updateUser: payload => ({
        type: usersActions.UPDATE_USER_REQUEST,
        payload
    }),
}
export default usersActions;