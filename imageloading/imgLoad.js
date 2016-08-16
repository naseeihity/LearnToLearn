var ImgLoad = function(){

    const placeholder = document.querySelector('.placeholder'),
          small = placeholder.querySelector('.img_small');

    //加载小图
    let ImgSmall = (function(){

        let smallImg = new Image();
        smallImg.src = small.src;
        //因为无法监听页面上的html元素的加载
        smallImg.onload = function () {
         small.classList.add('loaded');
        };

    })();

    //加载大图
    let proxyImage = function(imgLargeSrc){

        let imgLarge = new Image();

        let observer =  new IntersectionObserver((changes) => {
          imgLarge.src = imgLargeSrc;
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
    };

    proxyImage(placeholder.dataset.large);

};

window.onload = function(){
    ImgLoad();
}