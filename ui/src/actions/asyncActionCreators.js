import fetch from 'isomorphic-fetch'
import { browserHistory } from 'react-router'
import {
    requestLogin,
    loginSuccessful,
    requestLogout,
    logoutSuccessful,
    requestAccounts,
    receiveAccounts,
    requestTransactions,
    receiveTransactions,
    accountCreated,
    hideNewAccountForm,
    refreshAccountBalance,
    hideTransferFunds
} from './actionCreators'

export const attemptLogin = credentials => {
    return (dispatch) => {
        dispatch(requestLogin(credentials))
        dispatch(loginSuccessful())
        browserHistory.push('/accounts')
    }
}

export const attemptLogout = () => {
    return (dispatch) => {
        dispatch(requestLogout())
        dispatch(logoutSuccessful())
        browserHistory.push('/')
    }
}

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