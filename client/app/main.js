import React from 'react';
import ReactDOM from 'react-dom';

import { Router, Route, Link, browserHistory, IndexRoute } from 'react-router';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { red900, blueGrey50 } from 'material-ui/styles/colors';

import Greeting from './greeting.component';
import VoteRoute from './components/vote';
import LoginRoute from './components/login';
import App from './app.component';

import AdminRoute from './admin/app';
import RegisterRoute from './register/app';

import Results from './components/results';
import IndexPage from './components/index';

// import 'whatwg-fetch';

class NoMatch extends React.Component {
	render() {
		return (<div>Ingen match!</div>);
	}
}


import injectTapEventPlugin from 'react-tap-event-plugin';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

const muiTheme = getMuiTheme({
//   palette: {
// 	primary1Color: red900,
// 	accent1Color: blueGrey50
//   }
});

ReactDOM.render(
	<MuiThemeProvider muiTheme={muiTheme}>
		<Router history={browserHistory}>
			<Route path="/" component={App}>
				<IndexRoute component={IndexPage} />
				<Route path="vote" component={VoteRoute} />
				<Route path="login" component={LoginRoute} />
				<Route path="results" component={Results} />
			</Route>
			{AdminRoute}
			{RegisterRoute}
			<Route path="*" component={NoMatch} />
		</Router>
	</MuiThemeProvider>
	,
	document.getElementById('root')
);