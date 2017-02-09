import { browserHistory } from 'react-router'

export const RESET_ERROR_MESSAGE = 'RESET_ERROR_MESSAGE'
export const REQUEST_LOGIN = 'REQUEST_LOGIN'
export const REQUEST_LOGIN_SUCCESS = 'REQUEST_LOGIN_SUCCESS'
export const REQUEST_LOGIN_FAILURE = 'REQUEST_LOGIN_FAILURE'
export const REQUEST_LOGOUT = 'REQUEST_LOGOUT'
export const REQUEST_LOGOUT_SUCCESS = 'REQUEST_LOGOUT_SUCCESS'
export const REQUEST_ACCOUNTS = 'REQUEST_ACCOUNTS'
export const RECEIVE_ACCOUNTS = 'RECEIVE_ACCOUNTS'
export const REQUEST_ACCOUNTS_FAILURE = 'REQUEST_ACCOUNTS_FAILURE'
export const REQUEST_TRANSACTIONS = 'REQUEST_TRANSACTIONS'
export const RECEIVE_TRANSACTIONS = 'RECEIVE_TRANSACTIONS'
export const REQUEST_TRANSACTIONS_FAILURE = 'REQUEST_TRANSACTIONS_FAILURE'
export const SHOW_NEW_ACCOUNTS_FORM = 'SHOW_NEW_ACCOUNTS_FORM'
export const HIDE_NEW_ACCOUNTS_FORM = 'HIDE_NEW_ACCOUNTS_FORM'
export const ACCOUNT_CREATED = 'ACCOUNT_CREATED'
export const SHOW_TRANSFER_FUNDS = 'SHOW_TRANSFER_FUNDS'
export const HIDE_TRANSFER_FUNDS = 'HIDE_TRANSFER_FUNDS'
export const TRANSFER_FUNDS_COMPLETE = 'TRANSFER_FUNDS_COMPLETE'
export const UPDATE_ACCOUNT_BALANCE = 'UPDATE_ACCOUNT_BALANCE'

export const resetErrorMessage = () => ({
    type: RESET_ERROR_MESSAGE
})

export const requestLogin = credentials => ({
    type: REQUEST_LOGIN,
    credentials
})

export const loginSuccessful = () => ({
    type: REQUEST_LOGIN_SUCCESS
})

export const loginFailed = errorMessage => ({
    type: REQUEST_LOGIN_FAILURE,
    errorMessage
})

export const attemptLogin = credentials => {
    return (dispatch) => {
        dispatch(requestLogin(credentials))
        dispatch(loginSuccessful())
        browserHistory.push('/accounts')
    }
}

export const requestLogout = () => ({
    type: REQUEST_LOGOUT
})

export const logoutSuccessful = () => ({
    type: REQUEST_LOGOUT_SUCCESS
})

export const attemptLogout = () => {
    return (dispatch) => {
        dispatch(requestLogout())
        dispatch(logoutSuccessful())
        browserHistory.push('/')
    }
}

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

export const showNewAccountForm = () => ({
    type: SHOW_NEW_ACCOUNTS_FORM
})
export const hideNewAccountForm = () => ({
    type: HIDE_NEW_ACCOUNTS_FORM
})
export const accountCreated = account => ({
    type: ACCOUNT_CREATED,
    account
})
export const createAccount = (name, openingBalance) => {
    return (dispatch) => {
        fetch('http://localhost:3001/accounts', {
            method: 'POST',
            body: JSON.stringify({ name, balance: openingBalance }),
            headers: new Headers({
                'Content-Type': 'application/json; charset=utf-8'
            })
        })
        .then(response => response.json())
        .then(newAccount => {
            dispatch(accountCreated(newAccount))
        })

        dispatch(hideNewAccountForm())
    }
}

export const showTransferFunds = () => ({
    type: SHOW_TRANSFER_FUNDS
})
export const hideTransferFunds = () => ({
    type: HIDE_TRANSFER_FUNDS
})
export const transferFundsComplete = () => ({
    type: TRANSFER_FUNDS_COMPLETE
})

export const refreshAccountBalance = (accountId, newBalance) => ({
    type: UPDATE_ACCOUNT_BALANCE,
    accountId,
    newBalance
})

const postTransaction = (description, debit, credit, accountId) => {
    return fetch('http://localhost:3001/transactions', {
            method: 'POST',
            body: JSON.stringify({ date: new Date(), description, debit, credit, accountId }),
            headers: new Headers({
                'Content-Type': 'application/json; charset=utf-8'
            })
        })
        .then(response => response.json())
        .then(newTransaction => {
            return newTransaction
        }) 
}

const updateAccountBalance = (accountId, newBalance) => {
    return fetch(`http://localhost:3001/accounts/${accountId}`, {
            method: 'PATCH',
            body: JSON.stringify({ balance: newBalance }),
            headers: new Headers({
                'Content-Type': 'application/json; charset=utf-8'
            })
        })
        .then(response => response.json())
        .then(result => {
            return result
        }) 
}

const creditAccount = (account, amount) => {
    var newBalance = (account.balance + amount);
    return updateAccountBalance(account.id, newBalance);
}

const debitAccount = (account, amount) => {
    var newBalance = account.balance - amount;
    return updateAccountBalance(account.id, newBalance);
}

export const transferFunds = (fromAccount, toAccount, transferAmount) => {
    transferAmount = parseFloat(transferAmount)
    return (dispatch) => {
        postTransaction(`Transfer to ${toAccount.name}`, transferAmount, null, fromAccount.id)

        debitAccount(fromAccount, transferAmount)
            .then(updatedAccount => {
                dispatch(refreshAccountBalance(updatedAccount.id, updatedAccount.balance))
            })
        
        postTransaction(`Transfer from ${fromAccount.name}`, null, transferAmount, toAccount.id)
        
        creditAccount(toAccount, transferAmount)
            .then(updatedAccount => {
                dispatch(refreshAccountBalance(updatedAccount.id, updatedAccount.balance))
            })

        dispatch(hideTransferFunds())
    }
}