import React from 'react';
import { connect } from 'react-redux';

import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ContentClear from 'material-ui/svg-icons/content/clear';
import Paper from 'material-ui/Paper';
import CircularProgress from 'material-ui/CircularProgress';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

import { 
	cancelEditing,
	addEditOption,
	saveVote,
	editTitleChanged,
	editOptionChanged,
	removeEditOption,
	setNumberOfChoices
} from './configure-votes.actions';

function count(n) {
	var array = [];
	for (let i = 0; i < n; i++) {
		array.push(i);
	}
	return array;
}

let EditVote = ({ editing, dispatch }) => {
	if (editing === null) {
		return null;
	}

	const { title, options, id, numberOfChoices } = editing;

	const validate = () => {
		if (!title) { return false; }

		if (options.length < 2) { return false; }

		const validOptions = options.filter((option) => option);
		if(validOptions.length !== options.length) { return false; }

		return true;
	};

	const emptyForm = () => {
		return !title && !options.filter(x => x).length;
	};

	const editOption = (option, i) => {
		return (
			<div key={i}>
				<TextField
					floatingLabelText={`Alternativ ${i + 1}`}
					value={option}
					tabIndex={0}
					onChange={(e) => dispatch(editOptionChanged(e.target.value, i))} />
				{/* TODO bara kunna ta bort om man har mer än 2*/}
				<IconButton tabIndex={10} onTouchTap={() => dispatch(removeEditOption(i))}>
					<ContentClear />
				</IconButton>
			</div>
		);
	};
	const addOption = () => {
		return (
			<div key={options.length}>
				<TextField
					floatingLabelText={'Lägg till alternativ'}
					value={''}
					tabIndex={0}
					onChange={(e) => dispatch(addEditOption(e.target.value))} />
			</div>
		);
	};

	return (
		<Paper className="card" style={{padding: 16}}>
			<div>
				<TextField
					hintText="Titel"
					value={title}
					tabIndex={0}
					className="big-textfield"
					ref={(el) => el && emptyForm() && el.focus()}
					onChange={(e) => dispatch(editTitleChanged(e.target.value))}/>
			</div>
			<div className="subtitle">{id ? 'Ändra omröstning' : 'Ny omröstning'}</div>
			<div>
				{options.concat(['']).map((option, i) =>
					i < options.length ? editOption(option, i) : addOption(option, i)
				)}
			</div>
			<div>
				<span>Tillåt</span>
				<DropDownMenu value={numberOfChoices} onChange={(e, i, value) => dispatch(setNumberOfChoices(value))}>
					{count(options.length - 1).map((i) =>
						<MenuItem key={i} value={i + 1} primaryText={i + 1} />
					)}
				</DropDownMenu>
				<span>alternativ</span>
			</div>
			<div className="card-actions">
				<FlatButton
					label="Avbryt"
					secondary={true}
					tabIndex={1}
					onTouchTap={() => dispatch(cancelEditing())} />
				<FlatButton
					label={id ? 'Ändra' : 'Lägg till'}
					primary={true}
					disabled={!validate()}
					tabIndex={0}
					onTouchTap={() => dispatch(saveVote({ title, options, id, numberOfChoices }))} />
			</div>
		</Paper>
	);
};
export default EditVote = connect(
	(state) => ({
		editing: state.editing
	})
)(EditVote);