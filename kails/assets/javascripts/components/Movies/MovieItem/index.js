import React, { Component } from 'react';

class MovieItem extends Component{

  show(item){
    this.props.onClick(item);
  }

  render(){
    let {item} = this.props;
    return (
      <tr onClick={this.show.bind(this,item)}>
        <th>{item.name}</th>
        <th>{item.category}</th>
        <th>{item.year}</th>
        <th>{item.star}</th>
      </tr>
    );
  }
}

export default MovieItem;