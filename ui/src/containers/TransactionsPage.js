import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import Subheader from 'material-ui/Subheader'
import Paper from 'material-ui/Paper'
import FlatButton from 'material-ui/FlatButton'
import formatMoney from '../formatMoney'
import TransactionList from '../components/TransactionList'

class TransactionsPage extends Component {
    constructor(props) {
        super(props)

        this.state = {
            account: {},
            transactions: []
        }
    }

    componentDidMount() {
        let accountId = this.props.params.accountId

        fetch(`http://localhost:3001/accounts/${accountId}`)
            .then(response => response.json())
            .then(account => {
                this.setState({ account: account })
            })

        fetch(`http://localhost:3001/transactions?accountId=${accountId}`)
            .then(response => response.json())
            .then(transactions => {
                this.setState({ transactions: transactions })
            })
    }

    goToAccounts() {
        browserHistory.push('/accounts')
    }

    render() {
        return (
            <div>
                <FlatButton onClick={() => this.goToAccounts()} label="Back to accounts" primary={true} />

                <h2>{this.state.account.name} Transactions</h2>

                <Paper zDepth={1}>
                    <Subheader>Account balance {formatMoney(this.state.account.balance)}</Subheader>
                    {
                        this.state.transactions.length === 0 &&
                        <Subheader>No transactions available</Subheader>
                    }
                    {
                        this.state.transactions.length > 0 &&
                        <TransactionList transactions={this.state.transactions} />
                    }
                </Paper>
            </div>
        )
    }
}

export default TransactionsPage