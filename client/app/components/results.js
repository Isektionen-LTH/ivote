import React from 'react';

import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import { Provider, connect } from 'react-redux';
import socket from '../socket';
import store from './results.store';
import { updateResults } from './results.actions';

import { getCookie } from '../cookie';
const role = getCookie('role');

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

		socket.emit('join results', role);
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
	const total = options.reduce((sum, option) => sum + option.votes, 0);

	return (
		<table className="bar-chart">
			<tbody>
				{options.map(({ name, votes }) => {
					const width = Math.max(100 * votes / total, 5);
					return <tr key={name}>
						<td>{name}</td>
						<td>
							<div style={{width: `${width}%`}}>{votes}</div>
						</td>
					</tr>;
				})}
			</tbody>
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
