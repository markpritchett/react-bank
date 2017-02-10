import { browserHistory } from 'react-router'
import * as types from './constants'

export const resetErrorMessage = () => ({
    type: types.RESET_ERROR_MESSAGE
})

export const requestLogin = credentials => ({
    type: types.REQUEST_LOGIN,
    credentials
})

export const loginSuccessful = () => ({
    type: types.REQUEST_LOGIN_SUCCESS
})

export const loginFailed = errorMessage => ({
    type: types.REQUEST_LOGIN_FAILURE,
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
    type: types.REQUEST_LOGOUT
})

export const logoutSuccessful = () => ({
    type: types.REQUEST_LOGOUT_SUCCESS
})

export const attemptLogout = () => {
    return (dispatch) => {
        dispatch(requestLogout())
        dispatch(logoutSuccessful())
        browserHistory.push('/')
    }
}

export const requestAccounts = () => ({
    type: types.REQUEST_ACCOUNTS
})

export const receiveAccounts = (accounts) => ({
    type: types.RECEIVE_ACCOUNTS,
    accounts
})

export const fetchAccounts = () => {
    return dispatch => {
        dispatch(requestAccounts());
        return fetch('http://localhost:3001/accounts')
            .then(response => response.json())
            .then(accounts => {
                dispatch(receiveAccounts(accounts))
            })
    }
}

export const requestTransactions = accountId => ({
    type: types.REQUEST_TRANSACTIONS
})

export const receiveTransactions = (transactions) => ({
    type: types.RECEIVE_TRANSACTIONS,
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
    type: types.SHOW_NEW_ACCOUNTS_FORM
})
export const hideNewAccountForm = () => ({
    type: types.HIDE_NEW_ACCOUNTS_FORM
})
export const accountCreated = account => ({
    type: types.ACCOUNT_CREATED,
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
    type: types.SHOW_TRANSFER_FUNDS
})
export const hideTransferFunds = () => ({
    type: types.HIDE_TRANSFER_FUNDS
})
export const transferFundsComplete = () => ({
    type: types.TRANSFER_FUNDS_COMPLETE
})

export const refreshAccountBalance = (accountId, newBalance) => ({
    type: types.UPDATE_ACCOUNT_BALANCE,
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