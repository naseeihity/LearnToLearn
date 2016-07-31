import React, { Component } from 'react';

class MovieItem extends Component {

  render(){
    let movie = this.props.movie;
    return (
      <tr onClick={this.props.onClick}>
        <th>{movie.name}</th>
        <th>{movie.category}</th>
        <th>{movie.year}</th>
        <th>{movie.star}</th>
      </tr>
    );
  }

}

export default MovieItem;