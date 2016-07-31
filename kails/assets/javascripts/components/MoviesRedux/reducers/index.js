import { combineReducers } from 'redux';
import MovieList from './movieList';
// import MovieModal from './movieModal';

const MoviesApp = combineReducers({
	MovieList,
});

export default MoviesApp;