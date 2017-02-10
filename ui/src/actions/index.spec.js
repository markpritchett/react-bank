import * as actions from './index'

describe('action creators', () => {
    it('should create reset error message', () => {
        const expectedAction = {
            type: 'RESET_ERROR_MESSAGE'
        }

        const actualAction = actions.resetErrorMessage()

        expect(actualAction).toEqual(expectedAction)
    })

    it('should create request login action', () => {
        const credentials = {
            username: 'bob',
            password: 'password1'
        }

        const expectedAction = {
            type: 'REQUEST_LOGIN',
            credentials
        }

        const actualAction = actions.requestLogin(credentials)

        expect(actualAction).toEqual(expectedAction)
    })

    it('should create login successful action', () => {
        const expectedAction = {
            type: 'REQUEST_LOGIN_SUCCESS'
        }
        const actualAction = actions.loginSuccessful()
        expect(actualAction).toEqual(expectedAction)
    })

    it('should create login failed action', () => {
        const errorMessage = 'You\'re name\'s not down, you\'re not coming in'

        const expectedAction = {
            type: 'REQUEST_LOGIN_FAILURE',
            errorMessage
        }

        const actualAction = actions.loginFailed(errorMessage)

        expect(actualAction).toEqual(expectedAction)
    })

    it('should create request logout action', () => {
        const expectedAction = {
            type: 'REQUEST_LOGOUT'
        }

        const actualAction = actions.requestLogout()

        expect(actualAction).toEqual(expectedAction)
    })

    it('should create logout successful action', () => {
        const expectedAction = {
            type: 'REQUEST_LOGOUT_SUCCESS'
        }

        const actualAction = actions.logoutSuccessful()

        expect(actualAction).toEqual(expectedAction)
    })

    it('should create request accounts action', () => {
        const expectedAction = {
            type: 'REQUEST_ACCOUNTS'
        }

        const actualAction = actions.requestAccounts()

        expect(actualAction).toEqual(expectedAction)
    })

    it('should create receive accounts action', () => {
        const accounts = [
            { id: 1, name: 'Test Current Account', balance: 0.01 },
            { id: 2, name: 'Test Savings Account', balance: 1.23 }
        ]

        const expectedAction = {
            type: 'RECEIVE_ACCOUNTS',
            accounts
        }

        const actualAction = actions.receiveAccounts(accounts)

        expect(actualAction).toEqual(expectedAction)
    })

    it('should create request transactions action', () => {
        const expectedAction = {
            type: 'REQUEST_TRANSACTIONS'
        }

        const actualAction = actions.requestTransactions()

        expect(actualAction).toEqual(expectedAction)
    })

    it('should create receive transactions action', () => {
        const transactions = [
            {
                id: 1,
                date: new Date(),
                description: 'Starbucks',
                debit: 15.23,
                credit: null,
                accountId: 1
            }
        ]

        const expectedAction = {
            type: 'RECEIVE_TRANSACTIONS',
            transactions
        }

        const actualAction = actions.receiveTransactions(transactions)

        expect(actualAction).toEqual(expectedAction)
    })

    it('should create show new account form action', () => {
        const expectedAction = {
            type: 'SHOW_NEW_ACCOUNTS_FORM'
        }

        const actualAction = actions.showNewAccountForm()

        expect(actualAction).toEqual(expectedAction)
    })

    it('should create hide new account form action', () => {
        const expectedAction = {
            type: 'HIDE_NEW_ACCOUNTS_FORM'
        }

        const actualAction = actions.hideNewAccountForm()

        expect(actualAction).toEqual(expectedAction)
    })

    it('should create account created action', () => {
        const account = {
            id: 1,
            name: 'Shiny New Account',
            balance: 12345.67
        }

        const expectedAction = {
            type: 'ACCOUNT_CREATED',
            account
        }

        const actualAction = actions.accountCreated(account)

        expect(actualAction).toEqual(expectedAction)
    })

    it('should create show transfer funds action', () => {
        const expectedAction = {
            type: 'SHOW_TRANSFER_FUNDS'
        }

        const actualAction = actions.showTransferFunds()

        expect(actualAction).toEqual(expectedAction)
    })

    it('should create hide transfer funds action', () => {
        const expectedAction = {
            type: 'HIDE_TRANSFER_FUNDS'
        }

        const actualAction = actions.hideTransferFunds()

        expect(actualAction).toEqual(expectedAction)
    })

    it('should create transfer funds complete action', () => {
        const expectedAction = {
            type: 'TRANSFER_FUNDS_COMPLETE'
        }

        const actualAction = actions.transferFundsComplete()

        expect(actualAction).toEqual(expectedAction)
    })

    it('should create refresh account balance action', () => {
        let accountId = 101
        let newBalance = 100000000

        const expectedAction = {
            type: 'UPDATE_ACCOUNT_BALANCE',
            accountId,
            newBalance
        }
        
        const actualAction = actions.refreshAccountBalance(accountId, newBalance)
        
        expect(actualAction).toEqual(expectedAction)
    })
})