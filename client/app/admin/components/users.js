import React from 'react';
import { Provider, connect } from 'react-redux';

import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ContentClear from 'material-ui/svg-icons/content/clear';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import Paper from 'material-ui/Paper';
import CircularProgress from 'material-ui/CircularProgress';

import {
	fetchUsers,
	deleteUser
} from './users.actions';

import store from './users.store';

import 'whatwg-fetch';

export default function UsersRoute() {
	
	return (
		<Provider store={store}>
			<Users />
		</Provider>
	);
}

class UsersClass extends React.Component {
	componentDidMount() {
		const { dispatch } = this.props;
		dispatch(fetchUsers());
	}

	render() {
		const { users, dispatch } = this.props;		

		if (users === null) {
			return (
				<div className="loading-container">
					<CircularProgress />
				</div>
			);
		}

		
		return (
			<table>
				<tbody>
					{users.map(({ name, id }) =>
						<tr key={id}>
							<td>{name}</td>
							<td>
								<IconButton onTouchTap={() => dispatch(deleteUser(id))}>
									<ContentClear />
								</IconButton>
							</td>
						</tr>
					)}
				</tbody>
			</table>
		);
	}
}

const Users = connect(
	(state) => {
		return {
			users: state.users
		};
	}
)(UsersClass);