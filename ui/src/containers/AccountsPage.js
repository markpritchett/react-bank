import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import { fetchAccounts, showNewAccountForm } from '../actions'
import Account from '../components/Account'
import NewAccountDialog from './NewAccountDialog'

const style = {
    float: 'right'
}

class AccountsPage extends Component {
    componentDidMount() {
        const { dispatch, authenticated } = this.props
        if (!authenticated) {
            browserHistory.push('/')
        }
        dispatch(fetchAccounts());
    }

    goToTransactions(id) {
        browserHistory.push(`/accounts/${id}/transactions`)
    }

    render() {
        const { accounts, isFetching, onAddAccountClick, showNewAccountForm } = this.props
        return (
            <div>
                <h2>Accounts</h2>
                <div>
                    {accounts.map(account => <Account key={account.id} {...account} viewTransactions={this.goToTransactions} />)}
                </div>
                <FloatingActionButton style={style} title="Create a new account" onTouchTap={onAddAccountClick}>
                    <ContentAdd />
                </FloatingActionButton>
            </div>
        )
    }
}

const mapStateToProps = state => {
    const { accounts, login } = state
    return {
        isFetching: accounts.isFetching,
        accounts: accounts.items,
        authenticated: login.authenticated,
        showNewAccountForm: accounts.showNewAccountForm
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onAddAccountClick: () => {
            dispatch(showNewAccountForm())
        },
        dispatch
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountsPage)