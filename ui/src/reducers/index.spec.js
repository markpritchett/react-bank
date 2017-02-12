import deepFreeze from 'deep-freeze'
import rootReducer from './index'
import * as actions from '../actions'

describe('reducers', () => {
    it('should return initial state', () => {
        const expectedDefaultState = {
            errorMessage: null,
            routing: { locationBeforeTransitions: null },
            login: { authenticated: false },
            accounts: { isFetching: false, items: [] },
            transactions: { isFetching: false, items: [] }
        }

        const actualDefaultState = rootReducer(undefined, {})

        expect(actualDefaultState).toEqual(expectedDefaultState)
    })

    it('should handle REQUEST_LOGIN_SUCCESS', () => {
        const stateBefore = {
            login: { authenticated: false }
        }

        const expectedStateAfter = {
            authenticated: true
        }

        deepFreeze(stateBefore)

        const stateAfter = rootReducer(stateBefore, actions.loginSuccessful())

        const { login } = stateAfter

        expect(login).toEqual(expectedStateAfter)
    })
})