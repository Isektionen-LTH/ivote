
export const FETCH_VOTES = 'FETCH_VOTES';

export function fetchVotes() {
	return (dispatch) => {
		dispatch(requestVotes());

		return fetch('/admin/votes')
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
		return fetch(`/admin/vote/${id}/start`, { method: 'POST' })
			.then(response => response.json())
			.then((json) => {
				dispatch(recieveVotes(json));
			});
	};
}

export function deleteVote(id) {
	return (dispatch) => {
		return fetch(`/admin/vote/${id}`, { method: 'DELETE' })
			.then(response => response.json())
			.then((json) => {
				dispatch(recieveVotes(json));
			});
	};
}

export function cancelCurrent() {
	return (dispatch) => {
		return fetch('/admin/vote/cancelcurrent', { method: 'POST' })
			.then(response => response.json())
			.then((json) => {
				dispatch(recieveVotes(json));
			});
	};
}

export const ADD_NEW_VOTE = 'ADD_NEW_VOTE';

export function addNewVote() {
	return editVote(null);
}

export const EDIT_VOTE = 'EDIT_VOTE';

export function editVote(id) {
	return (dispatch, getState) => {
		const vote = getState().votes.filter(vote => id === vote.id)[0] || {};
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
