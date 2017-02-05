import * as ActionTypes from '../actions'
import { routerReducer as routing } from 'react-router-redux'
import { combineReducers } from 'redux'

const errorMessage = (state = null, action) => {
  const { type, error } = action

  if (type === ActionTypes.RESET_ERROR_MESSAGE) {
    return null
  } else if (error) {
    return error
  }

  return state
}

const accounts = (state = {
  isFetching: false,
  items: []
}, action) => {
  switch (action.type) {
    case ActionTypes.REQUEST_ACCOUNTS:
      return Object.assign({}, state, {
        isFetching: true
      })
    case ActionTypes.RECEIVE_ACCOUNTS:
      return Object.assign({}, state, {
        isFetching: true,
        items: action.accounts
      })
    default:
      return state
  }
}

const transactions = (state = {
  isFetching: false,
  items: []
}, action) => {
  switch (action.type) {
    case ActionTypes.REQUEST_TRANSACTIONS:
      return Object.assign({}, state, {
        isFetching: true
      })
    case ActionTypes.RECEIVE_TRANSACTIONS:
      return Object.assign({}, state, {
        isFetching: true,
        items: action.transactions
      })
    default:
      return state
  }
}

const rootReducer = combineReducers({
    errorMessage,
    routing,
    accounts,
    transactions
})

export default rootReducer