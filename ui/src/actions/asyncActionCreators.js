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
    invalidCreateAccountRequest,
    accountCreated,
    hideNewAccountForm,
    refreshAccountBalance,
    hideTransferFunds,
    invalidTransferFundsRequest
} from './actionCreators'
import formatMoney from '../formatMoney'

const BASE_URL = process.env.REACT_APP_BASE_URL

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
        return fetch(`${BASE_URL}/accounts`)
            .then(response => response.json())
            .then(accounts => {
                dispatch(receiveAccounts(accounts))
            })
    }
}

export const fetchTransactions = accountId => {
    return (dispatch) => {
        dispatch(requestTransactions(accountId));
        fetch(`${BASE_URL}/transactions?accountId=${accountId}`)
            .then(response => response.json())
            .then(transactions => {
                dispatch(receiveTransactions(transactions))
            })
    }
}

const validateCreateAccountRequest = (name, openingBalance, existingAccounts) => {
    let result = {
        isValid: true,
        nameValidationMessage: null,
        openingBalanceValidationMessage: null
    }

    if (!name) {
        result.isValid = false;
        result.nameValidationMessage = 'Account Name is required'
    }

    if (existingAccounts.find(account => account.name.toLowerCase() === name.toLowerCase())) {
        result.isValid = false;
        result.nameValidationMessage = `Account Name ${name} already exists!`
    }

    if (typeof openingBalance === 'string' && openingBalance.trim().length === 0) {
        result.isValid = false;
        result.openingBalanceValidationMessage = 'Opening Balance is required'
    } else {
        openingBalance = parseFloat(openingBalance)
        if (Number.isNaN(openingBalance)) {
            result.isValid = false;
            result.openingBalanceValidationMessage = 'Opening Balance must be a number'

        } else if (openingBalance < 0.01) {
            result.isValid = false;
            result.openingBalanceValidationMessage = `Opening Balance cannot be less than ${formatMoney(0.01)}`
        } else if (openingBalance > 1000.00) {
            result.isValid = false;
            result.openingBalanceValidationMessage = `Jeez, I know this is a fake app, but we can't give out more than ${formatMoney(1000.00)}`
        }
    }

    return result
}

export const createAccount = (name, openingBalance) => {
    return (dispatch, getState) => {
        const { accounts } = getState()

        let validationResult = validateCreateAccountRequest(name, openingBalance, accounts.items || [])

        if (!validationResult.isValid) {
            return Promise.resolve(dispatch(invalidCreateAccountRequest(validationResult)))
        }

        name = name.trim()

        if (typeof openingBalance === 'string') {
            openingBalance = parseFloat(openingBalance.trim())
        }

        fetch(`${BASE_URL}/accounts`, {
            method: 'POST',
            body: JSON.stringify({ name, balance: openingBalance }),
            headers: new Headers({
                'Content-Type': 'application/json; charset=utf-8'
            })
        })
            .then(response => response.json())
            .then(newAccount => {
                dispatch(accountCreated(newAccount))
                dispatch(hideNewAccountForm())
            })
    }
}

const postTransaction = (description, debit, credit, accountId) => {
    return fetch(`${BASE_URL}/transactions`, {
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
    return fetch(`${BASE_URL}/accounts/${accountId}`, {
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

const validateTransferFundsRequest = (fromAccount, toAccount, transferAmount, existingAccounts) => {
    let result = {
        isValid: true,
        fromAccountValidationMessage: null,
        toAccountValidationMessage: null,
        transferAmountValidationMessage: null
    }

    if (!fromAccount) {
        result.isValid = false;
        result.fromAccountValidationMessage = 'From Account is required'
    }

    if (!toAccount) {
        result.isValid = false;
        result.toAccountValidationMessage = 'To Account is required'
    }

    if (typeof transferAmount === 'string' && transferAmount.trim().length === 0) {
        result.isValid = false;
        result.transferAmountValidationMessage = 'Transfer Amount is required'
    } else {
        transferAmount = parseFloat(transferAmount)
        if (Number.isNaN(transferAmount)) {
            result.isValid = false;
            result.transferAmountValidationMessage = 'Transfer Amount must be a number'
        } else if (transferAmount < 0.01) {
            result.isValid = false;
            result.transferAmountValidationMessage = `Transfer Amount cannot be less that ${formatMoney(0.01)}`
        } else if (fromAccount && transferAmount > fromAccount.balance) {
            result.isValid = false;
            result.transferAmountValidationMessage = `Insufficent funds in account ${fromAccount.name}.  You can transfer up to ${formatMoney(fromAccount.balance)}`
        }
    }

    return result
}

export const transferFunds = (fromAccount, toAccount, transferAmount) => {
    return (dispatch, getState) => {
        const { accounts } = getState()

        let validationResult = validateTransferFundsRequest(fromAccount, toAccount, transferAmount, accounts || [])

        if (!validationResult.isValid) {
            return Promise.resolve(dispatch(invalidTransferFundsRequest(validationResult)))
        }
        transferAmount = parseFloat(transferAmount)

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