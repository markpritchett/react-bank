import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import Account from '../components/Account'

class AccountsPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            accounts: []
        }
    }

    componentDidMount() {
        fetch('http://localhost:3001/accounts')
            .then(response => response.json())
            .then(accounts => {
                this.setState({ accounts: accounts })
            })
    }

    goToTransactions(id) {
        browserHistory.push(`/accounts/${id}/transactions`)
    }

    render() {
        return (
            <div>
                <h2>Accounts</h2>
                <div>
                    {this.state.accounts.map(account => <Account key={account.id} {...account} viewTransactions={this.goToTransactions} />)}
                </div>
            </div>
        )
    }
}
export default AccountsPage