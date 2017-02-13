import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import nock from 'nock'
import * as actionTypes from './constants'
import * as actions from './asyncActionCreators'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

const BASE_URL = process.env.REACT_APP_BASE_URL

describe('async actions', () => {
    afterEach(() => {
        nock.cleanAll()
    })

    it('should fetch accounts', () => {
        const accounts = [
            { id: 1, name: 'Test Account', balance: 25.01 }
        ]

        nock(BASE_URL)
            .get('/accounts')
            .reply(200, accounts)

        const expectedActions = [
            { type: actionTypes.REQUEST_ACCOUNTS },
            { type: actionTypes.RECEIVE_ACCOUNTS, accounts }
        ]

        const store = mockStore({ accounts: [] })

        return store.dispatch(actions.fetchAccounts())
            .then(() => {
                expect(store.getActions()).toEqual(expectedActions)
            })
    })
})

describe('Create Account', () => {
    describe('Validation', () => {
        it('should not allow an empty account name', () => {
            const store = mockStore({ accounts: [] })

            const expectedActions = [{
                type: actionTypes.CREATE_ACCOUNT_VALIDATION_FAILURE,
                validationResult: {
                    isValid: false,
                    nameValidationMessage: 'Account Name is required',
                    openingBalanceValidationMessage: null
                }
            }]

            return store.dispatch(actions.createAccount('', 1.00))
                .then(() => {
                    expect(store.getActions()).toEqual(expectedActions)
                })
        })

        it('should not allow duplicate account names', () => {
            const store = mockStore({
                accounts: {
                    items: [
                        { id: 1, name: 'Test Account', balance: 0.01 }
                    ]
                }
            })

            const expectedActions = [{
                type: actionTypes.CREATE_ACCOUNT_VALIDATION_FAILURE,
                validationResult: {
                    isValid: false,
                    nameValidationMessage: 'Account Name Test Account already exists!',
                    openingBalanceValidationMessage: null
                }
            }]

            return store.dispatch(actions.createAccount('Test Account', 1.00))
                .then(() => {
                    expect(store.getActions()).toEqual(expectedActions)
                })
        })

        it('should disallow no opening balance', () => {
            const store = mockStore({ accounts: [] })

            const expectedActions = [{
                type: actionTypes.CREATE_ACCOUNT_VALIDATION_FAILURE,
                validationResult: {
                    isValid: false,
                    nameValidationMessage: null,
                    openingBalanceValidationMessage: 'Opening Balance is required'
                }
            }]

            return store.dispatch(actions.createAccount('Foo', ''))
                .then(() => {
                    expect(store.getActions()).toEqual(expectedActions)
                })
        })

        it('should ensure that opening balance is a number', () => {
            const store = mockStore({ accounts: [] })

            const expectedActions = [{
                type: actionTypes.CREATE_ACCOUNT_VALIDATION_FAILURE,
                validationResult: {
                    isValid: false,
                    nameValidationMessage: null,
                    openingBalanceValidationMessage: 'Opening Balance must be a number'
                }
            }]

            return store.dispatch(actions.createAccount('Foo', 'bar'))
                .then(() => {
                    expect(store.getActions()).toEqual(expectedActions)
                })
        })

        it('should ensure opening balance is greater than zero', () => {
            const store = mockStore({ accounts: [] })

            const expectedActions = [{
                type: actionTypes.CREATE_ACCOUNT_VALIDATION_FAILURE,
                validationResult: {
                    isValid: false,
                    nameValidationMessage: null,
                    openingBalanceValidationMessage: 'Opening Balance cannot be less than £0.01'
                }
            }]

            return store.dispatch(actions.createAccount('Foo', '0'))
                .then(() => {
                    expect(store.getActions()).toEqual(expectedActions)
                })
        })
        
        it('should ensure opening balance is 1000 or less', () => {
            const store = mockStore({ accounts: [] })

            const expectedActions = [{
                type: actionTypes.CREATE_ACCOUNT_VALIDATION_FAILURE,
                validationResult: {
                    isValid: false,
                    nameValidationMessage: null,
                    openingBalanceValidationMessage: 'Jeez, I know this is a fake app, but we can\'t give out more than £1,000.00'
                }
            }]

            return store.dispatch(actions.createAccount('Foo', '1000.01'))
                .then(() => {
                    expect(store.getActions()).toEqual(expectedActions)
                })
        })
    })
})