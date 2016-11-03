import React from 'react';

import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Paper from 'material-ui/Paper';

import 'whatwg-fetch';

export default class Admin extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			votes: [
				{ title: 'Ordförande', result: null },
				{ title: 'Överphös', result: 'Adhara' },
				{ title: 'Sexmästare', result: 'Sofia' },
			], 
			editing: false
		};

		this.onAdd = this.onAdd.bind(this);
		this.addFoReal = this.addFoReal.bind(this);
	}

	cancelVote(vote) {
		this.setState({
			votes: this.state.votes.filter(v => v !== vote)
		});
	}

	onAdd() {
		
		this.setState({
			editing: true
		});
	}

	addFoReal(title) {
		this.setState({
			votes: [{title: title, result: null}].concat(this.state.votes)
		});
		
		this.setState({
			editing: false
		});
	}

	render() {
		const editingComponent = () => {
			if(this.state.editing) {
				return (
					<Paper className="card" style={{padding: 16}}>
						<div>
							<TextField floatingLabelText="Titel" ref={(el) => {this.title = el;}} />
						</div>
						
						<div>
							<TextField floatingLabelText="Alternativ" />
						</div>
						<div>
    						<IconButton>
								<ContentAdd />
							</IconButton>
						</div>
						<div className="card-actions">
    						<FlatButton
								label="Lägg till"
								primary={true}
								onTouchTap={() => this.addFoReal(this.title.input.value)} />
						</div>
					</Paper>
				);
			}
		};
		return (
			<div>
				<FloatingActionButton className="add-vote" onTouchTap={this.onAdd} >
					<ContentAdd />
				</FloatingActionButton>
				{editingComponent()}
				{this.state.votes.map((vote) => {
					return <AdminVote key={vote.title} title={vote.title} result={vote.result} onCancel={() => this.cancelVote(vote)}></AdminVote>;
				})}
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