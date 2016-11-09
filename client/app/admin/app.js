import React from 'react';
// import { Link } from 'react-router';

import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import FlatButton from 'material-ui/FlatButton';
import { withRouter } from 'react-router';
import { Route, IndexRoute } from 'react-router';

import AppBar from 'material-ui/AppBar';

import ConfigureVotes from './components/configure-votes';
import Users from './components/users';

import loginLogout from '../login-logout';

let AppComponent = ({ router, children }) => {

	return (
		<div>
			<AppBar title="Admin"
				iconElementRight={loginLogout(router)} />
			<div id="container">{children}</div>
		</div>
	);
};
AppComponent = withRouter(AppComponent);

let route = <Route path="/admin" component={AppComponent}>
				<IndexRoute component={ConfigureVotes} />
				<Route path="users" component={Users} />
			</Route>;

export default route;