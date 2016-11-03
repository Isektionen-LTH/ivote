export const UPDATE_RESULTS = 'UPDATE_RESULTS';

export function updateResults(results) {
	return {
		type: UPDATE_RESULTS,
		results: results
	};
}