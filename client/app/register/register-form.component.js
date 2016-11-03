import React from 'react';

import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

const RegisterForm = ({ title, selected, dispatch }) => {
	return (
		<Card>
			<CardTitle title={'Registrera'} />
			<CardText>
			<div>
				<TextField floatingLabelText="Namn" />
			</div>
			<div>
				<TextField floatingLabelText="E-mail" />
			</div>
			</CardText>
			<CardActions className="card-actions">
				<FlatButton
					label="Skicka"
					primary={true}
					onTouchTap={() => {}} />
			</CardActions>
		</Card>
	);
};

export default RegisterForm;