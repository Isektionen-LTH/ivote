import React from 'react';
// import { Link } from 'react-router';

import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import FlatButton from 'material-ui/FlatButton';
import { withRouter } from 'react-router';
import { Route, IndexRoute, Link } from 'react-router';

import Paper from 'material-ui/Paper';

import RegisterForm from './register-form.component';

import AppBar from 'material-ui/AppBar';
let AppComponent = ({ router, children }) => {
	return (
		<div>
			<AppBar title="Registrera" />
			<div id="container">{children}</div>
		</div>
	);
};

const Registered = () => {
	return (
		<Paper className="index-page">
			<h1>Du är registrerad!</h1>
			<div>
				<Link to={'/register'}>Registera ny användare</Link>
			</div>
		</Paper>
	);
};

let route = <Route path="/register" component={AppComponent}>
				<IndexRoute component={RegisterForm} />
				<Route path="done" component={Registered} />
			</Route>;

export default route;