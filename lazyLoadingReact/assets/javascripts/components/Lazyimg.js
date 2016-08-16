import React, {Component} from 'react';
import Imgitem from './Imgitem';

class Lazyimg extends Component{

	constructor(props){
		super(props);
	}

	render(){
		let imgItems = this.props.images.map((img, key) =>
							<Imgitem alt={img.alt} src={img.src} key={key} id={key} />
						);
			return (
				<div>
					{imgItems}
				</div>
			);
	}
}

export default Lazyimg;