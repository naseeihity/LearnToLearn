import React, {Component} from 'react';
import Imgitem from './Imgitem';

class Lazyimg extends Component{

	constructor(props){
		super(props);
	}

	render(){
		let imgItems = this.props.images.map((img, key) =>
					<Imgitem alt={img.alt} img={img} key={key} id={key} />);
			return (
				<div className="img_box">
					{imgItems}
				</div>
			);
	}
}

export default Lazyimg;