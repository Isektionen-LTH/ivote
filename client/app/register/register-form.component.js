import React from 'react';

import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

class RegisterForm extends React.Component {
	constructor(props) {
		super(props);

		this.register = this.register.bind(this);
	}
	register() {
		const name = this.nameInput.input.value;
		const email = this.emailInput.input.value;
		window.location = `register/voter?name=${name}&email=${email}`;
	}
	render() {
		return (
			<Card>
				<CardTitle title={'Registrera'} />
				<CardText>
				<div>
					<TextField
						floatingLabelText="Namn"
						ref={(el) => this.nameInput = el} />
				</div>
				<div>
					<TextField
						floatingLabelText="E-mail"
						type="email"
						ref={(el) => this.emailInput = el} />
				</div>
				</CardText>
				<CardActions className="card-actions">
					<FlatButton
						label="Skicka"
						primary={true}
						onTouchTap={this.register} />
				</CardActions>
			</Card>
		);
	}
	
}

export default RegisterForm;