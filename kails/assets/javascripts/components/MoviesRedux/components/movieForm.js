import React,{ Component } from 'react';

class MovieForm extends Component {

	handleSubmit(e){
	  e.preventDefault();

	  let name = this.refs.name.value.trim();
	  let category = this.refs.category.value.trim();
	  let year = this.refs.year.value.trim();
	  let star = this.refs.star.value.trim();

	  let movie = {
	  	name: name,
	  	category: category,
	  	year: year,
	  	star: star
	  };

	  if (!name || !category || !year || !star) {
	    return;
	  }

	  this.props.onAddClick(movie);

	  this.refs.name.value = '';
	  this.refs.category.value = '';
	  this.refs.year.value = '';
	  this.refs.star.value = '';
	}

	render(){
		return (
			<form className="movieForm" onSubmit={(e) => this.handleSubmit(e)}>
			  <input type="text" placeholder="MovieName" ref="name"/>
			  <input type="text" placeholder="MoveCategory" ref="category"/>
			  <input type="text" placeholder="MoveYear" ref="year"/>
			  <input type="text" placeholder="MoveStar" ref="star"/>
			  <button type="submit" >Add Movie</button>
			</form>
		)
	}

}


export default MovieForm;