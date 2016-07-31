import React, { Component } from 'react';
import update from 'react-addons-update';
import MovieItem from '../MovieItem/index';
import MovieModal from '../MovieModal/index';


class MovieList extends Component{

  constructor(props){
    super(props);

    this.state = {
      modalVisible: false,
      movies: props.data,
      selectedMovie: props.data[0]
    }
  }


  show(item){

    let selectedMovie = update({},{$merge:item});

    this.setState({
      modalVisible: true,
      selectedMovie: selectedMovie
    });
  }

  hide(){
    this.setState({modalVisible: false});
  }

  callback(status){
    this.setState({modalVisible: status});
  }

  saveChanges(movie){
    let index;
    let movies = this.state.movies;
    movies.map((item, key) => {
      if (item.id === movie.id){
        index = key;
      }
    });
    movies[index] = movie;
    this.setState({movies: movies});
  }

  render(){

    let movies = this.state.movies;
    let MovieItemNodes = movies.map((item, key) => {
      return (
        <MovieItem
          onClick={this.show.bind(this,item)}//yinyong leixing de chuandi
          item={item}
          key={key}
        />
      );
    });
    return(
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
            {MovieItemNodes}
          </tbody>
        </table>
        <MovieModal
          visible={this.state.modalVisible}
          onClose={this.hide.bind(this)}
          callback={this.callback.bind(this)}
          saveChanges={this.saveChanges.bind(this)}
          movie={this.state.selectedMovie}
        />
      </div>
    );
  }

}

export default MovieList;
