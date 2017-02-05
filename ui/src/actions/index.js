export const RESET_ERROR_MESSAGE = 'RESET_ERROR_MESSAGE'
export const REQUEST_ACCOUNTS = 'REQUEST_ACCOUNTS'
export const RECEIVE_ACCOUNTS = 'RECEIVE_ACCOUNTS'
export const REQUEST_ACCOUNTS_FAILURE = 'REQUEST_ACCOUNTS_FAILURE'
export const REQUEST_TRANSACTIONS = 'REQUEST_TRANSACTIONS'
export const RECEIVE_TRANSACTIONS = 'RECEIVE_TRANSACTIONS'
export const REQUEST_TRANSACTIONS_FAILURE = 'REQUEST_TRANSACTIONS_FAILURE'

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
                dispatch(receiveAccounts(accounts))
            })
    } 
}
export const requestTransactions = accountId => ({
    type: REQUEST_TRANSACTIONS
})

export const receiveTransactions = (transactions) => ({
    type: RECEIVE_TRANSACTIONS,
    transactions
})

export const fetchTransactions = accountId => {
    return (dispatch) => {
        dispatch(requestTransactions(accountId));

        fetch(`http://localhost:3001/transactions?accountId=${accountId}`)
            .then(response => response.json())
            .then(transactions => {
                dispatch(receiveTransactions(transactions))
            })
    } 
}