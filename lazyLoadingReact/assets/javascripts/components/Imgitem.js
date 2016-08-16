import React, {Component} from 'react';

class Imgitem extends Component{
	constructor(props){
		super(props);
	}

	componentDidMount(){
		let id = this.props.id;
		this.loadSmallImg(id);
		this.loadBigImg(id);
	}

	loadSmallImg(id){
		let smallImg = new Image();
		let small = document.querySelectorAll('.img_small')[id];
		smallImg.src = small.src;
		//因为无法监听页面上的html元素的加载
		smallImg.addEventListener('load', () => small.classList.add('loaded'));
	}

	loadBigImg(id){
		let imgLarge = new Image();
		let placeholder = document.querySelectorAll('.placeholder')[id];
		let imgLargeSrc = this.props.src;

		let observer =  new IntersectionObserver((changes) => {
		  imgLarge.src = imgLargeSrc;
		  imgLarge.alt = this.props.alt;
		  placeholder.appendChild(imgLarge);
		}, {
		    root: null,
		    rootMargin: '200px'
		});
		observer.observe(placeholder);

		imgLarge.addEventListener('load', () => {
		    imgLarge.classList.add('loaded');
		    observer.unobserve(placeholder);
		});
	}

	render(){
		const IMG_S = "?imageView2/2/w/30/h/20/interlace/0/q/100";
		return(
			<picture>
				<div className="placeholder">
					<img src={this.props.src + IMG_S}
						   alt={this.props.alt}
						   id={this.props.id}
						   className="img_small" />
				</div>
			</picture>
		)
	}
}

export default Imgitem;