const rolesActions = {
    FETCH_ROLES_REQUEST: 'FETCH_ROLES_REQUEST',
    FETCH_ROLES_SUCCESS: 'FETCH_ROLES_SUCCESS',
    FETCH_ROLES_ERROR: 'FETCH_ROLES_ERROR',
    fetchRoles: payload => ({
        type: rolesActions.FETCH_ROLES_REQUEST,
    }),
    DELETE_ROLE_REQUEST: 'DELETE_ROLE_REQUEST',
    DELETE_ROLE_SUCCESS: 'DELETE_ROLE_SUCCESS',
    DELETE_ROLE_ERROR: 'DELETE_ROLE_ERROR',
    deleteRole: payload => ({
        type: rolesActions.DELETE_ROLE_REQUEST,
        payload
    }),
    INSERT_ROLE_REQUEST: 'INSERT_ROLE_REQUEST',
    INSERT_ROLE_SUCCESS: 'INSERT_ROLE_SUCCESS',
    INSERT_ROLE_ERROR: 'INSERT_ROLE_ERROR',
    insertRole: payload => ({
        type: rolesActions.INSERT_ROLE_REQUEST,
        payload
    }),
}
export default rolesActions;