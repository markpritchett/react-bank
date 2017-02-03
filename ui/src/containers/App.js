import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import AppBar from 'material-ui/AppBar'
import { resetErrorMessage } from '../actions'

const styles = {
  title: {
    cursor: 'pointer',
  },
}

class App extends Component {
  static propTypes = {
    errorMessage: PropTypes.string,
    resetErrorMessage: PropTypes.func.isRequired,
    children: PropTypes.node
  }

  goHome() {
    browserHistory.push('/')
  }

  handleDismissClick = e => {
    this.props.resetErrorMessage()
    e.preventDefault()
  }

  renderErrorMessage() {
    const { errorMessage } = this.props
    if (!errorMessage) {
      return null
    }

    return (
      <p style={{ backgroundColor: '#e99', padding: 10 }}>
        <b>{errorMessage}</b>
        {' '}
        (<a href="#"
            onClick={this.handleDismissClick}>
          Dismiss
        </a>)
      </p>
    )
  }

  render() {
    const { children } = this.props
    return (
      <div>
        <AppBar
          title={<span style={styles.title}>React Bank</span>}
          onTitleTouchTap={() => this.goHome()}
          showMenuIconButton={false}
        />
        {this.renderErrorMessage()}
        {children}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  errorMessage: state.errorMessage
})

export default connect(mapStateToProps, {
  resetErrorMessage
})(App)