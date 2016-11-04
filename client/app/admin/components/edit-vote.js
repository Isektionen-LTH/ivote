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

import { 
	cancelEditing,
	addEditOption,
	saveVote,
	editTitleChanged,
	editOptionChanged,
	removeEditOption
} from './configure-votes.actions';

let EditVote = ({ editing, dispatch }) => {
	if (editing === null) {
		return null;
	}

	const { title, options, id } = editing;

	const validate = () => {
		if (!title) { return false; }

		if (options.length < 2) { return false; }

		const validOptions = options.filter((option) => option);
		if(validOptions.length !== options.length) { return false; }

		return true;
	};

	return (
		<Paper className="card" style={{padding: 16}}>
			<div>
				<TextField
					hintText="Titel"
					value={title}
					tabIndex={-1}
					className="big-textfield"
					onChange={(e) => dispatch(editTitleChanged(e.target.value))}/>
			</div>
			<div className="subtitle">{id ? 'Ändra omröstning' : 'Ny omröstning'}</div>
			
			<div>
				{options.map((option, i)=>
					<div key={i}>
						<TextField
							floatingLabelText={`Alternativ ${i + 1}`}
							value={option}
							tabIndex={i}
							onChange={(e) => dispatch(editOptionChanged(e.target.value, i))} />
						<IconButton tabIndex={100} onTouchTap={() => dispatch(removeEditOption(i))}>
							<ContentClear />
						</IconButton>
					</div>
				)}
			</div>
			<div>
				<FlatButton
					label="Lägg till alternativ"
					primary={true}
					tabIndex={50}
					onTouchTap={() => dispatch(addEditOption())} />
				{/* 
				<IconButton tabIndex={100} onTouchTap={() => dispatch(addEditOption())}>
					<ContentAdd />
				</IconButton>
				*/}
			</div>
			<div className="card-actions">
				<FlatButton
					label="Avbryt"
					secondary={true}
					tabIndex={50}
					onTouchTap={() => dispatch(cancelEditing())} />
				<FlatButton
					label="Lägg till"
					primary={true}
					disabled={!validate()}
					tabIndex={50}
					onTouchTap={() => dispatch(saveVote({ title, options, id }))} />
			</div>
		</Paper>
	);
};
export default EditVote = connect(
	(state) => ({
		editing: state.editing
	})
)(EditVote);