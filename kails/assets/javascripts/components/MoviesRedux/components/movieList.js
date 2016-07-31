import React,{ Component } from 'react';
import { connect } from 'react-redux';
import MovieItem from './movieItem';
import MovieModal from './movieModal';

class MovieList extends Component {

  render(){
    let movies = this.props.movies;
    return (
      <div className="movieList">
        <table className="table">
          <thead>
            <tr>
              <th>Movie Name</th>
              <th>Movie Category</th>
              <th>Movie Year</th>
              <th>Movie Star</th>
            </tr>
          </thead>
          <tbody>
            {movies.map(( movie, key ) =>
              <MovieItem
                key={key}
                movie={movie}
                onClick={() => this.props.onItemClick(movie)}
              />
            )}
          </tbody>
        </table>
        <MovieModal />
      </div>
    );
  }

}

export default MovieList;
