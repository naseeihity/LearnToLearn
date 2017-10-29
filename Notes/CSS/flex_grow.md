前两天看到一个纯CSS方案实现类似于**500px**的图片瀑布流，主要特点是每行近似等高，每幅图不等宽，可以根据窗口大小自动调整每一行的图片数目。

模仿给自己的博客做了个相册，结合了之前做的图片渐进式加载和懒加载，样式还没调整，最后的效果是这样的：
![](http://7xr09v.com1.z0.glb.clouddn.com/demo_cssphoto.PNG)

实际上最后的方案还是要依靠JS进行计算，得到每个

核心代码也就几行，主要依赖flex布局的`flex-grow`属性。这里我用React进行的模板渲染，初始设置每行图片的高度为300px左右（`lineHeight`），拿到图片的宽度和高度后计算得到每一个图片的宽度，然后依靠`flex-grow`属性使得图片自动拉伸填满整行。

核心代码如下：
```
divStyle: {
				width: width*this.state.lineHeight/height + 'px',
				flexGrow: width*this.state.lineHeight/height
			},
			iStyle: {
				paddingBottom: height/width * 100 + '%'
			}
```
其中，`padding-bottom`还是起到之前的placeholder的作用，防止图片加载过程中布局不断地重排，闪瞎眼睛。

```
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
                    <span>{this.props.alt}</span>
                </div>
            )
        }
```

```
.img_box{
    display: flex;
    flex-wrap: wrap;
}

.img_box::after {
  content: '';
  flex-grow: 1e4;
  min-width: 20%;
}

.placeholder{
    margin: 2px;
    background-color: #ddd;
    position: relative;
    cursor: pointer;
}


.placeholder img{
    position: absolute;
    top: 0;
    width: 100%;
    vertical-align: bottom;
}
```

可以通过 **[这里](http://www.gaococ.com/demos/gallery/)** 查看我的相册，由于有的图片太大，可能会有些卡（不过可以看到优美的图片渐进加载效果哦）。

#### 参考
1. [使用纯 CSS 实现 Google Photos 照片列表布局](https://github.com/xieranmaya/blog/issues/4)
2. [由flickr提供的js版本](https://github.com/flickr/justified-layout)
