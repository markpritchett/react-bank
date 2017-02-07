
import Dialog from 'material-ui/Dialog'
import TextField from 'material-ui/TextField'
import FlatButton from 'material-ui/FlatButton'
import React, { Component } from 'react';
import { connect } from 'react-redux'
import { createAccount, hideNewAccountForm } from '../actions'
class NewAccountDialog extends Component {


    componentDidMount() {

    }

    submitRequest() {
        const { dispatch } = this.props

        let accountName = this.refs.accountName.input.value
        let openingBalance = this.refs.openingBalance.input.value
        dispatch(createAccount(accountName, openingBalance))
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
                <TextField ref="accountName" hintText="Account name" />
                <TextField ref="openingBalance" hintText="Opening Balance" />
            </Dialog>
        );
    }
}

const mapStateToProps = state => {
    const { accounts } = state
    return {
        showNewAccountForm: accounts.showNewAccountForm
    }
}

export default connect(mapStateToProps)(NewAccountDialog)