import React from 'react';

import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import { BarChart } from 'react-d3';
import { Provider, connect } from 'react-redux';
import socket from '../socket';
import store from './results.store';
import { updateResults } from './results.actions';

// import 'whatwg-fetch';

export default function ResultsRoute() {
	return (
		<Provider store={store}>
			<Results />
		</Provider>
	);
}

class ResultsClass extends React.Component {
	componentDidMount() {
		const { dispatch } = this.props;

		// TODO remove
		dispatch(updateResults([
			{
				title: 'Ordförande',
				options: [
					{ name: 'John', votes: 3 },
					{ name: 'Kristoffer', votes: 1 }
				]
			},
			{
				title: 'Överphös',
				options: [
					{ name: 'John', votes: 32 },
					{ name: 'Kristoffer', votes: 31 }
				]
			}
		]));
	
		this.onResultsUpdate = this.onResultsUpdate.bind(this);
		
		socket.emit('join results');
		socket.on('new results', this.onResultsUpdate);
	}

	componentWillUnmount() {
		socket.emit('end results');
		socket.off('new results', this.onResultsUpdate);
	}

	onResultsUpdate(results) {
		const { dispatch } = this.props;
		dispatch(updateResults({
			title: results.title,
			options: results.options.map(
				({ title, numberOfVotes }) => ({name: title, votes: numberOfVotes})
			)
		}));
	}

	render() {
		const { results } = this.props;
		return (
			<div>
				{results.map(({ title, options }) =>
					<Card key={title} className="card">
						<CardTitle title={title} />
						<CardText>
							{options.map(({ name, votes }) =>
								<div key={name}>{name} {votes}</div>
							)}
						</CardText>
						<CardActions>
						</CardActions>
					</Card>)
				}
			</div>
		);
	}
}

const Results = connect(
	(state) => {
		return {
			results: state.results
		};
	}
)(ResultsClass);