import React, { Component } from 'react';
import MovieItem from '../MovieItem/index';
import MovieModal from '../MovieModal/index';


class MovieList extends Component{

  constructor(props){
    super(props);

    this.state = {
      modalVisible: false,
      selectedMovie: props.data[0]
    }
  }

  show(){
    this.setState({modalVisible: true});
  }

  hide(){
    this.setState({modalVisible: false});
  }

  callback(status){
    this.setState({modalVisible: status});
  }

  render(){

    let data = this.props.data;
    let MovieItemNodes = data.map((item, key) => {
      return (
        <MovieItem
          onClick={this.show.bind(this)}
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
          movie={this.state.selectedMovie}
          />
      </div>
    );
  }

}

export default MovieList;
