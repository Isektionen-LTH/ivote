import React from 'react';
// import { Link } from 'react-router';

import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import FlatButton from 'material-ui/FlatButton';
import { withRouter } from 'react-router';
import { Route, IndexRoute } from 'react-router';

import RegisterForm from './register-form.component';

import AppBar from 'material-ui/AppBar';
let AppComponent = ({ router, children }) => {
	return (
		<div>
			<AppBar title="Register" />
			<div id="container">{children}</div>
		</div>
	);
};
let route = <Route path="/register" component={AppComponent}>
				<IndexRoute component={RegisterForm} />
			</Route>

export default route;