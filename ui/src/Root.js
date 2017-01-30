import React from 'react'
import { IndexRoute, Router, Route, browserHistory } from 'react-router'

import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import App from './App';
import WelcomePage from './WelcomePage';
import AccountsPage from './AccountsPage';

import './root.css';

injectTapEventPlugin();

const Root = () => (
    <MuiThemeProvider>
        <div className="content">
            <Router history={browserHistory}>
                <Route path="/" component={App}>
                    <IndexRoute component={WelcomePage} />
                    <Route path="accounts" component={AccountsPage} />
                </Route>
            </Router>
        </div>
    </MuiThemeProvider>
);

export default Root;