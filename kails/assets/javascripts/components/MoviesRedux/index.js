import React,{ Component } from 'react';
import { connect } from 'react-redux';
import MovieForm from './components/movieForm';
import MovieList from './components/movieList';
import { addMovie, selectMovie } from './actions/index';

class MovieBox extends Component {

  render(){

    const { movies } = this.props;

    return (
      <div className="movieBox">
        <MovieForm onAddClick = {movie =>
          this.props.addMovie(movie)
        }/>
        <MovieList
        movies = {movies}
        onItemClick = {movie =>
          this.props.selectMovie(movie)
        }/>
      </div>
    );

  }
}

function mapStateToProps(state) {
  let { movies } = state.MovieList;
  return {
    movies: movies
  }
}

function mapDispatchToProps(dispatch) {
  return {
    addMovie: (movie) => {
      dispatch(addMovie(movie));
    },
    selectMovie: (movie) => {
      dispatch(selectMovie(movie));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MovieBox);