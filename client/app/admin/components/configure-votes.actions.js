
export const FETCH_VOTES = 'FETCH_VOTES';

export function fetchVotes() {
	return (dispatch) => {
		dispatch(requestVotes());

		return fetch('/admin/votes', {method: 'GET', credentials: 'same-origin'})
			.then(response => response.json())
			.then((json) => {
				dispatch(recieveVotes(json));
			});
	};
}

export const REQUEST_VOTES = 'REQUEST_VOTES';

function requestVotes() {
	return {
		type: REQUEST_VOTES
	};
}

export const RECIEVE_VOTES = 'RECIEVE_VOTES';

function recieveVotes(json) {
	return {
		type: RECIEVE_VOTES,
		votes: json
	};
}

export function startVote(id) {
	return (dispatch) => {
		return fetch(`/admin/vote/${id}/start`, { method: 'POST', credentials: 'same-origin' })
			.then(response => response.json())
			.then((json) => {
				dispatch(recieveVotes(json));
			});
	};
}

export function deleteVote(id) {
	return (dispatch) => {
		return fetch(`/admin/vote/${id}`, { method: 'DELETE', credentials: 'same-origin' })
			.then(response => response.json())
			.then((json) => {
				dispatch(recieveVotes(json));
			});
	};
}

export function cancelCurrent() {
	return (dispatch) => {
		return fetch('/admin/vote/cancelcurrent', { method: 'POST', credentials: 'same-origin' })
			.then(response => response.json())
			.then((json) => {
				dispatch(recieveVotes(json));
			});
	};
}

export const ADD_NEW_VOTE = 'ADD_NEW_VOTE';

export function addNewVote() {
	return {
		type: ADD_NEW_VOTE
	};
}

export const EDIT_VOTE = 'EDIT_VOTE';

export function editVote(id) {
	return (dispatch, getState) => {
		const vote = getState().votes.filter(vote => id === vote.id)[0];
		dispatch({
			type: EDIT_VOTE,
			vote
		});
	};
}

export const CANCEL_EDITING = 'CANCEL_EDITING';

export function cancelEditing() {
	return {
		type: CANCEL_EDITING
	};
}

export const ADD_EDIT_OPTION = 'ADD_EDIT_OPTION';

export function addEditOption(value) {
	return {
		type: ADD_EDIT_OPTION,
		value
	};
}

export const REMOVE_EDIT_OPTION = 'REMOVE_EDIT_OPTION';

export function removeEditOption(index) {
	return {
		type: REMOVE_EDIT_OPTION,
		index
	};
}


export const EDIT_TITLE_CHANGED = 'EDIT_TITLE_CHANGED';

export function editTitleChanged(title) {
	return {
		type: EDIT_TITLE_CHANGED,
		title
	};
}

export const EDIT_OPTION_CHANGED = 'EDIT_OPTION_CHANGED';

export function editOptionChanged(option, index) {
	return {
		type: EDIT_OPTION_CHANGED,
		option,
		index
	};
}

export const SAVE_VOTE = 'SAVE_VOTE';

export function saveVote(vote) {
	return (dispatch) => {
		dispatch({
			type: SAVE_VOTE
		});
		// Allow id = 0 (falsey)
		const headers = new window.Headers({'Content-Type': 'application/json'});
		if (vote.id != null) {
			return fetch(`/admin/vote/${vote.id}`, { method: 'PUT', body: JSON.stringify(vote), headers, credentials: 'same-origin' })
				.then(response => response.json())
				.then((json) => {
					dispatch(recieveVotes(json));
				});
		} else {
			return fetch('/admin/vote/new', { method: 'POST', body: JSON.stringify(vote), headers, credentials: 'same-origin' })
			.then(response => response.json())
			.then((json) => {
				dispatch(recieveVotes(json));
			});
		}
	};
}
