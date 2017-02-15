import * as ActionTypes from '../actions/constants'
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
        authenticated: true,
        usernameValidationMessage: null,
        passwordValidationMessage: null
      })
    case ActionTypes.REQUEST_LOGOUT_SUCCESS:
      return Object.assign({}, state, {
        authenticated: false,
        usernameValidationMessage: null,
        passwordValidationMessage: null
      })
    case ActionTypes.REQUEST_LOGIN_FAILURE:
      return Object.assign({}, state, {
        authenticated: false,
        usernameValidationMessage: action.validationResult.usernameValidationMessage,
        passwordValidationMessage: action.validationResult.passwordValidationMessage
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
        items: action.response
      })
    case ActionTypes.SHOW_NEW_ACCOUNTS_FORM:
      return Object.assign({}, state, {
        showNewAccountForm: true
      })
    case ActionTypes.HIDE_NEW_ACCOUNTS_FORM:
      return Object.assign({}, state, {
        showNewAccountForm: false,
        nameValidationMessage: null,
        openingBalanceValidationMessage: null
      })
    case ActionTypes.CREATE_ACCOUNT_VALIDATION_FAILURE:
      return Object.assign({}, state, {
        nameValidationMessage: action.validationResult.nameValidationMessage,
        openingBalanceValidationMessage: action.validationResult.openingBalanceValidationMessage
      })
    case ActionTypes.CREATE_ACCOUNT_SUCCESS:
      return Object.assign({}, state, {
        items: [...state.items, action.response],
        showNewAccountForm: false
      })
    case ActionTypes.SHOW_TRANSFER_FUNDS:
      return Object.assign({}, state, {
        showTransferFunds: true
      })
    case ActionTypes.HIDE_TRANSFER_FUNDS:
      return Object.assign({}, state, {
        showTransferFunds: false,
        fromAccountValidationMessage: null,
        toAccountValidationMessage: null,
        transferAmountValidationMessage: null
      })
    case ActionTypes.TRANSFER_FUNDS_VALIDATION_FAILURE:
      return Object.assign({}, state, {
        fromAccountValidationMessage: action.validationResult.fromAccountValidationMessage,
        toAccountValidationMessage: action.validationResult.toAccountValidationMessage,
        transferAmountValidationMessage: action.validationResult.transferAmountValidationMessage
      })
    case ActionTypes.UPDATE_ACCOUNT_BALANCE_SUCCESS:
      let index = state.items.indexOf(state.items.find(a => a.id === action.response.id))
      let account = Object.assign({}, state.items[index], { balance: action.response.balance })
      let result = Object.assign({}, state, {
        items: [
          ...state.items.slice(0, index),
          account,
          ...state.items.slice(index + 1)
        ]
      })
      return result
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
        items: action.response
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