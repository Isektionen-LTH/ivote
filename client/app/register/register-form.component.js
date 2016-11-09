import React from 'react';

import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

// http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
function validateEmail(email) {
	const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
}

class RegisterForm extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			name: '',
			email: ''
		};

		this.submit = this.submit.bind(this);
	}
	submit(e) {
		e.preventDefault();

		const { name, email } = this.state;
		window.location = `register/voter?name=${name.trim()}&email=${email.trim()}`;
	}
	render() {

		const { name, email } = this.state;

		const [ trimmedName, trimmedEmail ] = [ name.trim(), email.trim() ];

		const validateName = (name) => {
			return /^[^\s]+\s[^\s]+$/.test(name);
		};

		const validate = () => {
			return true;
			return name && email && validateName(trimmedName) && validateEmail(trimmedEmail);
		};

		// const nameError = name && !validateName(email) ? 'För och efternamn' : null;
		const emailError = email && !validateEmail(trimmedEmail) ? 'Ogiltig mailaddress' : null;

		const emptyForm = () => !name && !email;

		return (
			<form onSubmit={this.submit}>
				<Card>
					<CardTitle title={'Registrera'} subtitle={<span>Vi kan endast se <i>om</i> du röstat inte <i>vem</i> du röstat på</span>} />
					<CardText>
					<div>
						<TextField
							floatingLabelText="För- och efternamn"
							value={name}
							ref={(el) => el && emptyForm() && el.focus()}
							onChange={(e) => this.setState({ name: e.target.value })} />
					</div>
					<div>
						<TextField
							floatingLabelText="Mailadress"
							type="email"
							value={email}
     						errorText={emailError}
							onChange={(e) => this.setState({ email: e.target.value })} />
					</div>
					</CardText>
					<CardActions className="card-actions">
						<FlatButton
							label="Skicka"
							primary={true}
							disabled={!validate()}
							type="submit" />
					</CardActions>
				</Card>
			</form>
		);
	}
	
}

export default RegisterForm;