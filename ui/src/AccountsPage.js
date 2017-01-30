import React, { Component } from 'react';

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
                <pre>
                    {JSON.stringify(this.state.accounts)}
                </pre>
            </div>
        );
    }
}

export default AccountsPage;