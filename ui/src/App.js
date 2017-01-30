import React from 'react';

import AppBar from 'material-ui/AppBar';

const App = (props) => (
  <div>
    <AppBar showMenuIconButton={false} title="React Bank" />
    {props.children}
  </div>
);

export default App;
