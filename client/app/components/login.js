import React from 'react';
import { Provider, connect } from 'react-redux';

import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import CircularProgress from 'material-ui/CircularProgress';

// import store from './vote.store.js';

// import { setSelected, fetchVoteState, sendVote } from './vote.actions.js';

export default function LoginRoute() {
	
	return (
		// <Provider store={store}>
			<Login />
		// </Provider>
	);
}
class Login extends React.Component {
	constructor(props) {
		super(props);

		this.submit = this.submit.bind(this);
	}

	submit() {
		const role = this.radioButtons.state.selected;
		const username = this.usernameInput.input.value;
		const password = this.passwordInput.input.value;

		this.login(role, username, password);
	}

	login(role, username, password) {
		window.location = `/login/${role}/${username}/${password}`;
	}

	render() {
		return (
			<Card>
				<CardTitle title={'Login'} />
				<CardText>
				<div>
					<TextField
						floatingLabelText="Användarnamn"
						ref={(el) => this.usernameInput = el} />
				</div>
				<div>
					<TextField
						floatingLabelText="Lösenord"
						type="password"
						ref={(el) => this.passwordInput = el}
					/>
				</div>
				<RadioButtonGroup
					name="selected"
					defaultSelected={'admin'}
					ref={(el) => this.radioButtons = el}>

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
						onTouchTap={this.submit} />
				</CardActions>
			</Card>
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