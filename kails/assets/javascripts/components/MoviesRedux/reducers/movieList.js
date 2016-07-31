import { DATA } from '../ConstValue';
export const initialState = {
  isVisible: false,
  movies: DATA
}

let movieId = 2;

const MovieItem = (state, action) => {

	switch(action.type){
		case 'ADD_MOVIE':
			return Object.assign({},action.movie,{
        selected: false,
        id: movieId++
      });

		case 'SELECT_MOVIE':
			if(state.id === action.movie.id){
				return Object.assign({},state,{
					selected: true
				});
			}else return Object.assign({},state,{
          selected: false
        });;
    case 'SAVE_EDIT':
      if(state.id === action.movie.id){
        return Object.assign({},state,action.movie);
      }else
        return state;
		default:
			return state;
	}

}

const MovieList = (state=initialState, action) =>{

	switch(action.type){
		case 'ADD_MOVIE':
			return Object.assign({},state,{
        movies:[...state.movies,MovieItem(undefined, action)]
      });
		case 'SELECT_MOVIE':
			return Object.assign({},state,{
        movies: state.movies.map(movie => MovieItem(movie, action)),
        isVisible: true
      });
    case 'CANCEL_EDIT':
      return Object.assign({},state,{
        isVisible: false
      });
    case 'SAVE_EDIT':
      return Object.assign({},state,{
        movies: state.movies.map(movie => MovieItem(movie, action)),
        isVisible: false
      });
		default:
			return state;
	}

}


export default MovieList;