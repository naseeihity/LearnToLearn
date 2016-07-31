import React,{ Component } from 'react';
import { Modal,Button } from 'react-bootstrap';

class MovieModal extends Component{

  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      movie:props.movie
    }
  }

  componentDidMount(){
    if(this.props.visible){
      this.open();
    }
  }

  componentWillReceiveProps(nextProps){
    if (!this.props.visible && nextProps.visible){
        this.open();
    } else if (this.props.visible && !nextProps.visible) {
        this.close();
    }
    if(this.props.movie !== nextProps.movie){
      this.setMovie(nextProps.movie);
    }

  }

  setMovie(movie){
    this.setState({movie});
  }
  close(){
    this.setState({
      showModal: false
    });
  }

  open(){
    this.setState({
      showModal: true
    });
  }

  callbackIn(status){
    this.props.callback(status);
  }

  saveChanges(status,movie){
    this.props.callback(status,movie);
    this.props.saveChanges(movie);
  }

  movieChange(part){
    let Part = 'movie_'+part;
    let item = this.refs[Part].value.trim();
    let {movie} = this.state;
    movie[part] = item;
    this.setMovie(movie);
  }


  render(){
    const style = {
      display: this.state.showModal ? 'block': 'none',
    }
    let {movie} = this.state;
    return (
      <div className="static-modal" style={style}>
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
            <Button onClick={this.callbackIn.bind(this,false)}>Close</Button>
            <Button onClick={this.saveChanges.bind(this,false,this.state.movie)}bsStyle="primary">Save changes</Button>
          </Modal.Footer>

        </Modal.Dialog>
      </div>
    );
  }
}

export default MovieModal;