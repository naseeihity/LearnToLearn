import React,{ Component } from 'react';
import { Modal,Button } from 'react-bootstrap';

class MovieModal extends Component{

  constructor(props) {
    super(props);
    let movie = props.movie;
    this.state = {
      showModal: false,
      name: movie.name,
      category: movie.category,
      year: movie.year,
      star: movie.star
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

  saveChanges(){
    console.log('saved!');
    this.close();
  }

  movieNameChange(e){
    let name = e.target.value.trim();
    this.setState({
      name: name
    })
  }

  render(){
    const style = {
      display: this.state.showModal ? 'block': 'none',
    }

    return (
      <div className="static-modal" style={style}>
        <Modal.Dialog>
          <Modal.Header>
            <Modal.Title>Modal title</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <input value={this.state.name} onChange={this.movieNameChange.bind(this)}/>
          </Modal.Body>

          <Modal.Footer>
            <Button onClick={this.callbackIn.bind(this,0)}>Close</Button>
            <Button onClick={this.saveChanges.bind(this)}bsStyle="primary">Save changes</Button>
          </Modal.Footer>

        </Modal.Dialog>
      </div>
    );
  }
}

export default MovieModal;