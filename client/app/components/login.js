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
let Login = () => {
	return (
		<Card>
			<CardTitle title={'Login'} />
			<CardText>
			<div>
				<TextField floatingLabelText="Användarnamn" />
			</div>
			<div>
				<TextField
					floatingLabelText="Lösenord"
	      			type="password"
				/>
			</div>
			</CardText>
			<CardActions className="card-actions">
				<FlatButton
					label="Logga in"
					primary={true}
					onTouchTap={() => {}} />
			</CardActions>
		</Card>
	);
};

// Login = connect(
// 	(state) => {
// 		return {
// 			selected: state.selected,
// 			title: state.currentVote.title
// 		};
// 	}
// )(Login);