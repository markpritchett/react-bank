import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import nock from 'nock'
import * as actionTypes from './constants'
import * as actions from './asyncActionCreators'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('async actions', () => {
    afterEach(() => {
        nock.cleanAll()
    })

    it('should fetch accounts', () => {
        const accounts = [
            { id: 1, name: 'Test Account', balance: 25.01 }
        ]

        nock('http://localhost:3001')
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