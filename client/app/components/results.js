import React from 'react';

import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

import 'whatwg-fetch';

export default class Admin extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			votes: [
				{ title: 'Ordförande', result: null },
				{ title: 'Överphös', result: 'Adhara' },
				{ title: 'Sexmästare', result: 'Sofia' },
			]
		};
	}

	cancelVote(vote) {
		this.setState({
			votes: this.state.votes.filter(v => v !== vote)
		});
	}

	render() {
		return (
			<div>
				{this.state.votes.map(({ title, result }) => 
					<Card key={title} className="card">
						<CardTitle title={title} subtitle={'AKA bäst på isek'} />
						<CardText>
						<div>
							{<div>Resultat: {result}</div>}
						</div>
						</CardText>
						<CardActions>
						</CardActions>
					</Card>)
				}
			</div>
		);
	}
}
// : <OngoingVote voted={0} total={1}></OngoingVote>}
const AdminVote = ({ title, result }) => {
	return (
		<Card className="card">
			<CardTitle title={title} subtitle={'AKA bäst på isek'} />
			<CardText>
			<div>
				{<div>Resultat: {result}</div>}
			</div>
			</CardText>
			<CardActions>
			{result
				? <FlatButton
					label="Ta bort"
					secondary={true}
					onTouchTap={() => {}} />
				: <FlatButton
					label="Avsluta"
					primary={true}
					onTouchTap={() => {}} /> }
				
			</CardActions>
		</Card>
	);
};