export const RESET_ERROR_MESSAGE = 'RESET_ERROR_MESSAGE'
export const REQUEST_ACCOUNTS = 'REQUEST_ACCOUNTS'
export const RECEIVE_ACCOUNTS = 'RECEIVE_ACCOUNTS'
export const REQUEST_ACCOUNTS_FAILURE = 'REQUEST_ACCOUNTS_FAILURE'

export const resetErrorMessage = () => ({
    type: RESET_ERROR_MESSAGE
})

export const requestAccounts = () => ({
    type: REQUEST_ACCOUNTS
})

export const receiveAccounts = (accounts) => ({
    type: RECEIVE_ACCOUNTS,
    accounts
})

export const fetchAccounts = () => {
    return (dispatch) => {
        dispatch(requestAccounts());

        fetch('http://localhost:3001/accounts')
            .then(response => response.json())
            .then(accounts => {
                dispatch(receiveAccounts(accounts));
            })
    } 
}
