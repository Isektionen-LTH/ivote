import React from 'react';
import ReactDOM from 'react-dom';

import { Router, Route, Link, browserHistory, IndexRoute } from 'react-router';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Greeting from './greeting.component';
import VoteRoute from './components/vote';
import LoginRoute from './components/login';
import App from './app.component';

import AdminRoute from './admin/app';
import RegisterRoute from './register/app';

import Results from './components/results';

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

// import fetchMock from 'fetch-mock';

// fetchMock.get('/currentvote', new Promise((resolve) => {
// 	setTimeout(() => resolve({
// 		currentState: 'voting',
// 		currentVote: {
// 			title: 'I-sektionens VD',
// 			options: ['John', 'Kristoffer']
// 		}
// 	}), 300);
// }));

// fetchMock.post('/vote', function(url, options) {
// 	console.log('voted for', options.body);
// 	return new Promise((resolve) => {
// 		setTimeout(() => resolve({
// 			currentState: 'voted'
// 		}), 500);
// 	});
// });

ReactDOM.render(
	<MuiThemeProvider>
		<Router history={browserHistory}>
			<Route path="/" component={App}>
				<IndexRoute component={VoteRoute} />
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