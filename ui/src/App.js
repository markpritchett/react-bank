import React, { Component } from 'react';

import { browserHistory } from 'react-router'

import AppBar from 'material-ui/AppBar';

const styles = {
  title: {
    cursor: 'pointer',
  },
};

class App extends Component {
  goHome() {
    browserHistory.push('/')
  }
  render() {
    return (
      <div>
        <AppBar
          title={<span style={styles.title}>React Bank</span>}
          onTitleTouchTap={() => this.goHome()}
          showMenuIconButton={false}
        />
        {this.props.children}
      </div>
    );
  }
}

export default App;
