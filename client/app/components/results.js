import React from 'react';

import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
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
	
		this.onResultsUpdate = this.onResultsUpdate.bind(this);
		
		socket.emit('join results');
		socket.on('new results', this.onResultsUpdate);
	}

	componentWillUnmount() {
		socket.emit('end results');
		socket.off('new results', this.onResultsUpdate);
	}

	onResultsUpdate(response) {
		const { dispatch } = this.props;
		const results = response.map(({ title, options, id }) => ({
			title,
			id,
			options: options.map(
				({ title, numberOfVotes }) => ({name: title, votes: numberOfVotes})
			)
		}));
		dispatch(updateResults(results));
	}

	render() {
		const { results } = this.props;

		return (
			<div>
				{results.map(({ title, options, id }) =>
					<Card key={id} className="card">
						<CardTitle title={title} />
						<CardText>
							<Result options={options}/>
						</CardText>
						<CardActions>
						</CardActions>
					</Card>)
				}
			</div>
		);
	}
}

const Result = ({ options }) => {
	// const data = {
	// 	values: options.map(({ name, votes }) => ({x: name, y: votes}))
	// };
	
	
	// [{
	// 	label: 'somethingA',
	// 	values: [{x: 'SomethingA', y: 10}, {x: 'SomethingB', y: 4}, {x: 'SomethingC', y: 3}]
	// }];
	const total = options.reduce((sum, option) => sum + option.votes, 0);

	return (
		<table className="bar-chart">
			{options.map(({ name, votes }) => {
				const width = Math.max(100 * votes / total, 5);
				return <tr key={name}>
					<td>{name}</td>
					<td>
						<div style={{width: `${width}%`}}>{votes}</div>
					</td>
				</tr>;
			})}
		</table>
	);
};

const Results = connect(
	(state) => {
		return {
			results: state.results
		};
	}
)(ResultsClass);