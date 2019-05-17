const smartsheetActions = {
    FETCH_SHEETS_REQUEST: 'FETCH_SHEETS_REQUEST',
    FETCH_SHEETS_SUCCESS: 'FETCH_SHEETS_SUCCESS',
    FETCH_SHEETS_ERROR: 'FETCH_SHEETS_ERROR',
    CLEAR_SHEETS: 'CLEAR_SHEETS',
    fetchSheets: payload => ({
        type: smartsheetActions.FETCH_SHEETS_REQUEST,
        payload
    }),
    clearSheets: () => ({
        type: smartsheetActions.CLEAR_SHEETS
    }),
    FETCH_KEYDATES_REQUEST: 'FETCH_KEYDATES_REQUEST',
    FETCH_KEYDATES_SUCCESS: 'FETCH_KEYDATES_SUCCESS',
    FETCH_KEYDATES_ERROR: 'FETCH_KEYDATES_ERROR',
    fetchKeyDates: payload => ({
        type: smartsheetActions.FETCH_KEYDATES_REQUEST,
        payload
    }),
}
export default smartsheetActions;