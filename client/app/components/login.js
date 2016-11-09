import React from 'react';
import { Provider, connect } from 'react-redux';

import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import CircularProgress from 'material-ui/CircularProgress';

import { setCookie } from '../cookie';

// import store from './vote.store.js';

// import { setSelected, fetchVoteState, sendVote } from './vote.actions.js';

export default function LoginRoute() {
	
	return (
		// <Provider store={store}>
			<Login />
		// </Provider>
	);
}
function hash(string) {
	var hash = 0, i, chr, len;
	if (string.length === 0) return hash;
	for (i = 0, len = string.length; i < len; i++) {
		chr   = string.charCodeAt(i);
		hash  = ((hash << 5) - hash) + chr;
		hash |= 0; // Convert to 32bit integer
	}
	return hash;
}
const salt = 'ivote';

class Login extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			username: '',
			password: '',
			role: 'admin'
		};

		this.submit = this.submit.bind(this);
	}

	submit(e) {
		e.preventDefault();

		const { username, password, role } = this.state;
		setCookie('username', username.trim());
		setCookie('hash', hash(password + salt));
		window.location = `/login/${role}`;
	}

	render() {

		const { username, password, role } = this.state;

		const validate = () => {
			return username && password;
		};
		

		const emptyForm = () => !username && !password;
		
		return (
			<form onSubmit={this.submit}>
				<Card>
					<CardTitle title={'Login'} />
					<CardText>
						<div>
							<TextField
								floatingLabelText="Användarnamn"
								value={username}
								ref={(el) => el && emptyForm() && el.focus()}
								onChange={(e) => this.setState({ username: e.target.value })} />
						</div>
						<div>
							<TextField
								floatingLabelText="Lösenord"
								type="password"
								value={password}
								onChange={(e) => this.setState({ password: e.target.value })} />
						</div>
						<RadioButtonGroup
							name="selected"
							defaultSelected={role}
							onChange={(e) => this.setState({ role: e.target.value })} >

							<RadioButton
								label={'Admin'}
								value={'admin'} />
							<RadioButton
								label={'Registrerare'}
								value={'register'} />
						</RadioButtonGroup>
					</CardText>
					<CardActions className="card-actions">
						<FlatButton
							label="Logga in"
							primary={true}
							disabled={!validate()}
							type="submit" />
					</CardActions>
				</Card>
			</form>
		);
	}
}

// Login = connect(
// 	(state) => {
// 		return {
// 			selected: state.selected,
// 			title: state.currentVote.title
// 		};
// 	}
// )(Login);