import React, { Component } from 'react';
import { connect } from 'react-redux'
import Login from './Login'

class WelcomePage extends Component {
    render() {
        const { authenticated } = this.props
        return (
            <div>
                <h2>Welcome to React Bank</h2>
                <p>
                    Enter your username and password
                </p>
                <p>
                    Put anything you like, it's not real :)
                </p>
                {
                    !authenticated && <Login/>
                }
            </div>
        );
    }
}

const mapStateToProps = state => {
    const { login } = state
    return {
        authenticated: login.authenticated
    }
}

export default connect(mapStateToProps)(WelcomePage)