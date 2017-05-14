import React from 'react';
import {render} from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {fade} from 'material-ui/utils/colorManipulator';
import {white, black, blue500} from 'material-ui/styles/colors';
import App from './App.jsx';
import "../less/index.less";

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

const muiTheme = getMuiTheme({
  palette: {
      accent1Color: blue500
  },
  tabs: {
    backgroundColor: fade(blue500, 0.1),
    textColor: fade(black, 0.4),
    selectedTextColor: blue500,
  },
});

render(
    <MuiThemeProvider muiTheme={muiTheme}>
        <App/>
    </MuiThemeProvider>,
    document.getElementById('app')
);
