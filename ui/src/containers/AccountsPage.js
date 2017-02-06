import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'
import { fetchAccounts } from '../actions'
import Account from '../components/Account'

class AccountsPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            accounts: []
        }
    }

    componentDidMount() {
        const { dispatch, authenticated } = this.props
        if(!authenticated) {
            browserHistory.push('/')
        }
        dispatch(fetchAccounts());
    }

    goToTransactions(id) {
        browserHistory.push(`/accounts/${id}/transactions`)
    }

    render() {
        const { accounts, isFetching } = this.props
        return (
            <div>
                <h2>Accounts</h2>
                <div>
                    {accounts.map(account => <Account key={account.id} {...account} viewTransactions={this.goToTransactions} />)}
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    const { accounts, login } = state
    return {
        isFetching: accounts.isFetching,
        accounts: accounts.items,
        authenticated: login.authenticated
    }
}

export default connect(mapStateToProps)(AccountsPage)