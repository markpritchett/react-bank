import React from 'react'
import { Route, IndexRoute } from 'react-router'
import App from './containers/App'
import WelcomePage from './containers/WelcomePage'
import AccountsPage from './containers/AccountsPage'
import TransactionsPage from './containers/TransactionsPage'

export default <Route path="/" component={App}>
  <IndexRoute component={WelcomePage} />
  <Route path="accounts" component={AccountsPage} />
  <Route path="accounts/:accountId/transactions" component={TransactionsPage} />
</Route>
