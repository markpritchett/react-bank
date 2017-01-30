import React, { Component } from 'react';

import Account from './Account';

class AccountsPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            accounts: []
        };
    }

    componentDidMount() {
        fetch('http://localhost:3001/accounts')
            .then(response => response.json())
            .then(accounts => {
                this.setState({ accounts: accounts });
            });
    }
    
    render() {
        return (
            <div>
                <h2>Accounts</h2>
                <div>
                    {this.state.accounts.map(account => <Account key={account.id} {...account} />)}
                </div>
            </div>
        );
    }
}
export default AccountsPage;