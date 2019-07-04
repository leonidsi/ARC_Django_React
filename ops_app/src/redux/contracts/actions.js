const contractsActions = {
    FETCH_CONTRACTS_REQUEST: 'FETCH_CONTRACTS_REQUEST',
    FETCH_CONTRACTS_SUCCESS: 'FETCH_CONTRACTS_SUCCESS',
    FETCH_CONTRACTS_ERROR: 'FETCH_CONTRACTS_ERROR',
    fetchContracts: payload => ({
        type: contractsActions.FETCH_CONTRACTS_REQUEST,
        payload
    }),
    DELETE_CONTRACT_REQUEST: 'DELETE_CONTRACT_REQUEST',
    DELETE_CONTRACT_SUCCESS: 'DELETE_CONTRACT_SUCCESS',
    DELETE_CONTRACT_ERROR: 'DELETE_CONTRACT_ERROR',
    deleteContract: payload => ({
        type: contractsActions.DELETE_CONTRACT_REQUEST,
        payload
    }),
    INSERT_CONTRACT_REQUEST: 'INSERT_CONTRACT_REQUEST',
    INSERT_CONTRACT_SUCCESS: 'INSERT_CONTRACT_SUCCESS',
    INSERT_CONTRACT_ERROR: 'INSERT_CONTRACT_ERROR',
    insertContract: payload => ({
        type: contractsActions.INSERT_CONTRACT_REQUEST,
        payload
    }),
    GET_CONTRACT_REQUEST: 'GET_CONTRACT_REQUEST',
    GET_CONTRACT_SUCCESS: 'GET_CONTRACT_SUCCESS',
    GET_CONTRACT_ERROR: 'GET_CONTRACT_ERROR',
    getContract: payload => ({
        type: contractsActions.GET_CONTRACT_REQUEST,
        payload
    }),
    UPDATE_CONTRACT_REQUEST: 'UPDATE_CONTRACT_REQUEST',
    UPDATE_CONTRACT_SUCCESS: 'UPDATE_CONTRACT_SUCCESS',
    UPDATE_CONTRACT_ERROR: 'UPDATE_CONTRACT_ERROR',
    updateContract: payload => ({
        type: contractsActions.UPDATE_CONTRACT_REQUEST,
        payload
    }),
}
export default contractsActions;