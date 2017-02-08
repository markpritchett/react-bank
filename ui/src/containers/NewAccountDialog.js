import React, { Component } from 'react'
import { connect } from 'react-redux'
import Dialog from 'material-ui/Dialog'
import TextField from 'material-ui/TextField'
import FlatButton from 'material-ui/FlatButton'
import formatMoney from '../formatMoney'
import { createAccount, hideNewAccountForm } from '../actions'

class NewAccountDialog extends Component {
    constructor(props) {
        super(props)
        this.state = {
            accountNameErrorMessage: null,
            openingBalanceErrorMessage: null
        };
    }

    submitRequest() {
        const { dispatch, accounts } = this.props

        let accountName = this.refs.accountName.input.value.trim()
        let openingBalance = this.refs.openingBalance.input.value.trim()

        let hasErrors = this.hasErrors(accounts, accountName, openingBalance)

        if (hasErrors) {
            return
        }

        dispatch(createAccount(accountName, openingBalance))
    }

    hasErrors(accounts, accountName, openingBalance) {
        this.setState({ accountNameErrorMessage: null })
        this.setState({ openingBalanceErrorMessage: null })

        let hasErrors = false
        
        if (!accountName) {
            this.setState({ accountNameErrorMessage: 'Account Name is required' })
            hasErrors = true
        } else if (accounts.find(account => account.name.toLowerCase() === accountName.toLowerCase())) {
            this.setState({ accountNameErrorMessage: `Account Name ${accountName} already exists!` })
            hasErrors = true
        }

        if (!openingBalance) {
            this.setState({ openingBalanceErrorMessage: 'Opening Balance is required' })
            hasErrors = true
        } else {
            openingBalance = parseFloat(openingBalance)

            if (Number.isNaN(openingBalance)) {
                this.setState({ openingBalanceErrorMessage: 'Opening Balance must be a number' })
                hasErrors = true
            } else if (openingBalance < 0.01) {
                this.setState({ openingBalanceErrorMessage: `Opening Balance cannot be less that ${formatMoney(0.01)}` })
                hasErrors = true
            } else if (openingBalance > 1000.00) {
                this.setState({ openingBalanceErrorMessage: `Jeez, I know this is a fake app, but we can't give out more than ${formatMoney(1000.00)}` })
                hasErrors = true
            }
        }

        return hasErrors
    }

    cancel() {
        const { dispatch } = this.props

        dispatch(hideNewAccountForm())
    }

    render() {
        const { showNewAccountForm } = this.props

        const actions = [
            <FlatButton
                label="Submit"
                primary={true}
                onTouchTap={() => this.submitRequest()}
            />,
            <FlatButton
                label="Cancel"
                primary={true}
                onTouchTap={() => this.cancel()}
            />
        ]

        return (
            <Dialog
                title="Create New Account"
                actions={actions}
                modal={false}
                open={showNewAccountForm}
                onRequestClose={() => this.cancel()}
            >
                <div>
                    <TextField ref="accountName" hintText="Account name" errorText={this.state.accountNameErrorMessage} />
                </div>
                <div>
                    <TextField ref="openingBalance" hintText="Opening Balance" errorText={this.state.openingBalanceErrorMessage} />
                </div>
            </Dialog>
        );
    }
}

const mapStateToProps = state => {
    const { accounts } = state
    return {
        accounts: accounts.items,
        showNewAccountForm: accounts.showNewAccountForm
    }
}

export default connect(mapStateToProps)(NewAccountDialog)