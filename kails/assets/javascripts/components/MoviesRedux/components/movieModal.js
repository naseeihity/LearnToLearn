import React,{ Component } from 'react';
import { Modal,Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import update from 'react-addons-update';
import { cancelEdit, saveEdit } from '../actions/index';

class MovieModal extends Component{

  constructor(props) {
    super(props);
    this.state = {
      movie: props.movie
    }
  }

  componentWillReceiveProps(nextProps){
    if(this.props.movie !== nextProps.movie){
      this.setMovie(nextProps.movie);
    }
  }


  movieChange(value){
    let val = 'movie_'+value;
    let item = this.refs[val].value.trim();
    let {movie} = this.state;
    movie[value] = item;
    this.setMovie(movie);
  }

  saveMovie(){
    let {movie} = this.state;
    this.props.saveEdit(movie);
  }

  setMovie(movie){
    this.setState({movie});
  }

  render(){
    let {movie} = this.state;
    let {isVisible} = this.props;

    return(
      <div className="static-modal"
           style={{display: this.props.isVisible ? 'block' : 'none'}}>
        <Modal.Dialog>
          <Modal.Header>
            <Modal.Title>Modal title</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <input value={movie.name} ref="movie_name"
                   onChange={this.movieChange.bind(this,'name')}/>name<br/>
            <input value={movie.category} ref="movie_category"
                   onChange={this.movieChange.bind(this,'category')}/>category<br/>
            <input value={movie.year} ref="movie_year"
                   onChange={this.movieChange.bind(this,'year')}/>year<br/>
            <input value={movie.star} ref="movie_star"
                   onChange={this.movieChange.bind(this,'star')}/>star<br/>
          </Modal.Body>

          <Modal.Footer>
            <Button onClick={() => this.props.cancelEdit()}>Close</Button>
            <Button onClick={this.saveMovie.bind(this)}
                    bsStyle="primary">Save changes</Button>
          </Modal.Footer>

        </Modal.Dialog>
      </div>
    );
  }

}


function mapStateToProps(state) {
  let { isVisible, movies } = state.MovieList;
  let movie = movies.filter(movie => {if(movie.selected) return movie})[0];
  return {
    isVisible: isVisible,
    movie: update({},{$merge:movie})
  }

}

function mapDispatchToProps(dispatch) {

  return {
    cancelEdit: () => dispatch(cancelEdit()),
    saveEdit: (movie) => dispatch(saveEdit(movie)),
  }

}

export default connect(mapStateToProps,mapDispatchToProps)(MovieModal);