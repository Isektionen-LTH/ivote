import React from 'react';

export default class Greeting extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>{this.props.children}, {this.props.name}!</div>
		);
	}
}