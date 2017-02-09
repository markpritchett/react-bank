import React, { Component } from 'react'
import { connect } from 'react-redux'
import Dialog from 'material-ui/Dialog'
import TextField from 'material-ui/TextField'
import SelectField from 'material-ui/SelectField'
import FlatButton from 'material-ui/FlatButton'
import MenuItem from 'material-ui/MenuItem'
import { hideTransferFunds, transferFunds } from '../actions'
import formatMoney from '../formatMoney'

class TransferFundsDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fromAccount: null,
            fromAccountErrorMessage: null,
            toAccount: null,
            toAccountErrorMessage: null,
            transferAmount: null,
            transferAmountErrorMessage: null
        }
    }

    handleFromAccountChange = (event, index, value) => this.setState({ fromAccount: value })
    handleToAccountChange = (event, index, value) => this.setState({ toAccount: value })

    submitRequest() {
        const { dispatch } = this.props

        let transferAmount = this.refs.transferAmount.input.value.trim()

        let hasErrors = this.hasErrors(this.state.fromAccount, this.state.toAccount, transferAmount)

        if (hasErrors) {
            return
        }

        dispatch(transferFunds(this.state.fromAccount, this.state.toAccount, parseFloat(transferAmount)))
    }

    hasErrors(fromAccount, toAccount, transferAmount) {
        this.setState({ fromAccountErrorMessage: null })
        this.setState({ toAccountErrorMessage: null })
        this.setState({ transferAmountErrorMessage: null })

        let hasErrors = false

        if (!fromAccount) {
            this.setState({ fromAccountErrorMessage: 'From Account is required' })
            hasErrors = true
        }

        if (!toAccount) {
            this.setState({ toAccountErrorMessage: 'To Account is required' })
            hasErrors = true
        }

        if (!transferAmount) {
            this.setState({ transferAmountErrorMessage: 'Amount is required' })
            hasErrors = true
        } else {
            transferAmount = parseFloat(transferAmount)

            if (Number.isNaN(transferAmount)) {
                this.setState({ transferAmountErrorMessage: 'Amount must be a number' })
                hasErrors = true
            } else if (transferAmount < 0.01) {
                this.setState({ openingBalanceErrorMessage: `Amount cannot be less that ${formatMoney(0.01)}` })
            } else if (transferAmount > fromAccount.balance) {
                this.setState({ transferAmountErrorMessage: `Insufficent funds in account ${fromAccount.name}.  You can transfer up to ${formatMoney(fromAccount.balance)}` })
                hasErrors = true
            }
        }

        return hasErrors
    }

    cancel() {
        const { dispatch } = this.props
        dispatch(hideTransferFunds())
    }

    render() {
        const { accounts, showTransferFunds } = this.props

        const actions = [
            <FlatButton
                label="Transfer"
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
                title="Transfer Funds"
                actions={actions}
                modal={false}
                open={showTransferFunds}
                onRequestClose={() => this.cancel()}
            >

                <div>
                    <SelectField
                        floatingLabelText="From Account"
                        value={this.state.fromAccount}
                        onChange={this.handleFromAccountChange}
                        errorText={this.state.fromAccountErrorMessage}
                    >
                        {
                            accounts.map(account => <MenuItem key={account.id} value={account} primaryText={account.name} />)
                        }
                    </SelectField>
                </div>
                <div>
                    <SelectField
                        floatingLabelText="To Account"
                        value={this.state.toAccount}
                        onChange={this.handleToAccountChange}
                        errorText={this.state.toAccountErrorMessage}
                    >
                        {
                            accounts.map(account => <MenuItem key={account.id} value={account} primaryText={account.name} />)
                        }
                    </SelectField>
                </div>
                <div>
                    <TextField ref="transferAmount" hintText="Amount" errorText={this.state.transferAmountErrorMessage} />
                </div>
            </Dialog>
        );
    }
}

const mapStateToProps = state => {
    const { accounts } = state
    return {
        accounts: accounts.items,
        showTransferFunds: accounts.showTransferFunds
    }
}

export default connect(mapStateToProps)(TransferFundsDialog)