const projectTypesActions = {
    FETCH_PTYPES_REQUEST: 'FETCH_PTYPES_REQUEST',
    FETCH_PTYPES_SUCCESS: 'FETCH_PTYPES_SUCCESS',
    FETCH_PTYPES_ERROR: 'FETCH_PTYPES_ERROR',
    fetchProjectTypes: payload => ({
        type: projectTypesActions.FETCH_PTYPES_REQUEST,
        payload
    }),
    DELETE_PTYPE_REQUEST: 'DELETE_PTYPE_REQUEST',
    DELETE_PTYPE_SUCCESS: 'DELETE_PTYPE_SUCCESS',
    DELETE_PTYPE_ERROR: 'DELETE_PTYPE_ERROR',
    deleteProjectType: payload => ({
        type: projectTypesActions.DELETE_PTYPE_REQUEST,
        payload
    }),
    INSERT_PTYPE_REQUEST: 'INSERT_PTYPE_REQUEST',
    INSERT_PTYPE_SUCCESS: 'INSERT_PTYPE_SUCCESS',
    INSERT_PTYPE_ERROR: 'INSERT_PTYPE_ERROR',
    insertProjectType: payload => ({
        type: projectTypesActions.INSERT_PTYPE_REQUEST,
        payload
    }),
    GET_PTYPE_REQUEST: 'GET_PTYPE_REQUEST',
    GET_PTYPE_SUCCESS: 'GET_PTYPE_SUCCESS',
    GET_PTYPE_ERROR: 'GET_PTYPE_ERROR',
    getProjectType: payload => ({
        type: projectTypesActions.GET_PTYPE_REQUEST,
        payload
    }),
    UPDATE_PTYPE_REQUEST: 'UPDATE_PTYPE_REQUEST',
    UPDATE_PTYPE_SUCCESS: 'UPDATE_PTYPE_SUCCESS',
    UPDATE_PTYPE_ERROR: 'UPDATE_PTYPE_ERROR',
    updateProjectType: payload => ({
        type: projectTypesActions.UPDATE_PTYPE_REQUEST,
        payload
    }),


}
export default projectTypesActions;