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
const login = (state = {
  authenticated: false
}, action) => {
  switch (action.type) {
    case ActionTypes.REQUEST_LOGIN:
      return state;
    case ActionTypes.REQUEST_LOGIN_SUCCESS:
      return Object.assign({}, state, {
        authenticated: true
      })
    case ActionTypes.REQUEST_LOGOUT_SUCCESS:
      return Object.assign({}, state, {
        authenticated: false
      })
    case ActionTypes.REQUEST_LOGIN_FAILURE:
      return Object.assign({}, state, {
        authenticated: false,
        errorMessage: action.errorMessage
      })
    default:
      return state
  }
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
    case ActionTypes.SHOW_NEW_ACCOUNTS_FORM:
      return Object.assign({}, state, {
        showNewAccountForm: true
      })
    case ActionTypes.HIDE_NEW_ACCOUNTS_FORM:
      return Object.assign({}, state, {
        showNewAccountForm: false
      })
    case ActionTypes.ACCOUNT_CREATED:
      return Object.assign({}, state, {
        items: [...state.items, action.account]
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
    login,
    accounts,
    transactions
})
export default rootReducer