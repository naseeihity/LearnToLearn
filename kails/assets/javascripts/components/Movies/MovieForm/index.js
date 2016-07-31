import React, { Component } from 'react';

class MovieForm extends Component{

  handleSubmit(e){

    e.preventDefault();

    let name = this.refs.name.value.trim();
    let category = this.refs.category.value.trim();
    let year = this.refs.year.value.trim();
    let star = this.refs.star.value.trim();
    let id = Date.now();

    if (!name || !category || !year || !star) {
      return;
    }

    this.props.onMovieSubmit({
      name: name,
      category: category,
      year: year,
      star: star,
      id: id
    });

    this.refs.name.value = '';
    this.refs.category.value = '';
    this.refs.year.value = '';
    this.refs.star.value = '';

    return;
  }

  render(){
    return(
      <form className="movieForm" onSubmit={this.handleSubmit.bind(this)}>
        <input type="text" placeholder="MovieName" ref="name"/>
        <input type="text" placeholder="MoveCategory" ref="category"/>
        <input type="text" placeholder="MoveYear" ref="year"/>
        <input type="text" placeholder="MoveStar" ref="star"/>
        <input type="submit" value="Submit" />
      </form>
    );
  }

}

export default MovieForm;