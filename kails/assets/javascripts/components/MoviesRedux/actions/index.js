
export const addMovie = (movie) => {
	return {
		type: 'ADD_MOVIE',
		movie: movie
	}
}

export const selectMovie = (movie) => {
  return {
    type: 'SELECT_MOVIE',
    movie: movie
  }
}

export const cancelEdit = () => {
	return {
		type: 'CANCEL_EDIT',
	}
}

export const saveEdit = (movie) => {
	return {
		type: 'SAVE_EDIT',
		movie: movie
	}
}