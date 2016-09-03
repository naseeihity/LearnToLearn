import React, {Component} from 'react';


class Imgitem extends Component{
	constructor(props){
		super(props);

		this.state = {
			divStyle:{},
			iStyle:{},
			lineHeight: 300
		}
	}

	componentDidMount(){
		let img = this.props.img;
		let id = this.props.id,
			  width = img.width,
				height = img.height;

		this.setState({
			divStyle: {
				width: width*this.state.lineHeight/height + 'px',
				flexGrow: width*this.state.lineHeight/height
			},
			iStyle: {
				paddingBottom: height/width * 100 + '%'
			}
		})

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
		let small = document.querySelectorAll('.img_small')[id];
		let imgLargeSrc = this.props.img.src;

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
		    imgLarge.classList.add('img_large');
		    observer.unobserve(placeholder);
		});
	}

	render(){
		let width = Math.floor(this.props.img.width / 50),
				height = Math.floor(this.props.img.height / 50);
		const IMG_S = "?imageView2/2/w/"+ width + "/h/"+ height +"/interlace/0/q/100";
		return(
			<div className="placeholder" style={this.state.divStyle}>
				<i style={this.state.iStyle}></i>
				<img src={this.props.img.src + IMG_S}
					   alt={this.props.alt}
					   id={this.props.id}
					   className="img_small" />
			</div>
		)
	}
}

export default Imgitem;