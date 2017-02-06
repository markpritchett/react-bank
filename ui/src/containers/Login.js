import React, { Component } from 'react';
import { connect } from 'react-redux'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import { attemptLogin } from '../actions'

class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loginClicked: false,
            usernameSet: false,
            passwordSet: false
        };
    }
    onLoginClick() {
        const { dispatch } = this.props

        let username = this.refs.username.input.value
        let password = this.refs.password.input.value

        this.setState({ loginClicked: true })
        this.setState({ usernameSet: !!username })
        this.setState({ passwordSet: !!password })

        if (!username || !password) {
            return;
        }

        dispatch(attemptLogin({
            username,
            password
        }))
    }
    renderErrorText(label) {
        return (
            this.state.loginClicked && !this.state[`${label.toLowerCase()}Set`] && `${label} is required`
        )
    }
    render() {
        return (
            <div>
                <h2>Login</h2>
                <div>
                    <TextField
                        hintText="Username"
                        ref="username"
                        errorText={this.renderErrorText("Username")}
                    />
                </div>
                <div>
                    <TextField
                        hintText="Password"
                        floatingLabelText="Password"
                        type="password"
                        ref="password"
                        errorText={this.renderErrorText("Password")}
                    />
                </div>
                <RaisedButton label="Login" primary={true} onClick={() => this.onLoginClick()} />
            </div>
        );
    }
}

export default connect()(Login) 