//预定义一些颜色
var Colors = {
    red:0xf25346,
    white:0xd8d0d1,
    brown:0x59332e,
    pink:0xF5986E,
    brownDark:0x23190f,
    blue:0x68c3c0,
};

var scene,camera,fieldOfView,aspectRatio,nearPlane,farPlane,HEIGHT,WIDTH,renderer,container;

function createScene(){

    //取得屏幕的宽高并设定视角的宽高比和渲染器的大小
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;

    //创建场景
    scene = new THREE.Scene();

    //添加雾的效果,颜色,最近和最远距离
    scene.fog = new THREE.Fog(0xf7d9aa, 100, 950);

    //创建视角
    aspectRatio = WIDTH / HEIGHT;
    fieldOfView = 60;
    nearPlane = 1;
    farPlane = 10000;

    camera = new THREE.PerspectiveCamera( fieldOfView, aspectRatio, nearPlane, farPlane );

    //设置视角位置
    camera.position.x = 0;
    camera.position.z = 200;
    camera.position.y = 100;

    //创建渲染器
    renderer = new THREE.WebGLRenderer( {
        //允许透明以显示背景
        alpha:true,
        //开启抗混叠
        antialias:true
    } );
    renderer.setSize(WIDTH,HEIGHT);

    //开启阴影渲染器
    renderer.shadowMap.enabled = true;

    container = document.getElementById('world');
    container.appendChild(renderer.domElement);

    //监听窗口大小变化，变化后重新渲染场景
    window.addEventListener('resize',handleWindowResize,false);
}

function handleWindowResize(){

    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;
    renderer.setSize(WIDTH, HEIGHT);
    camera.aspect = WIDTH / HEIGHT;
    camera.updateProjectionMatrix();

}

var hemisphereLight,shadowLight;

function createLights(){

    //半球灯是一个颜色渐变的灯，第一个参数是天空的颜色，第二个参数是地面的颜色，第三个参数是光强
    hemisphereLight = new THREE.HemisphereLight(0xaaaaaa,0x000000, .9)

    //定向光
    shadowLight = new THREE.DirectionalLight(0xffffff, .9);
    shadowLight.position.set(150, 350, 350);
    shadowLight.castShadow = true;
    //限定投射阴影的可见区域
    shadowLight.shadow.camera.left = -400;
    shadowLight.shadow.camera.right = 400;
    shadowLight.shadow.camera.top = 400;
    shadowLight.shadow.camera.bottom = -400;
    shadowLight.shadow.camera.near = 1;
    shadowLight.shadow.camera.far = 1000;

    //定义引用的分辨率，越高越好但是会影响性能
    shadowLight.shadow.mapSize.width = 2048;
    shadowLight.shadow.mapSize.height = 2048;

    //将灯光加入到场景中
    scene.add(hemisphereLight);
    scene.add(shadowLight);

    //加入周围灯光，使得阴影更加柔和
    ambientLight = new THREE.AmbientLight(0xdc8874, .5);
    scene.add(ambientLight);
}


Sea = function(){

    // 创建圆柱体
    //参数分别为 顶面和底面的半径，圆柱的高，圆周分段，高分段
    var geom = new THREE.CylinderGeometry(600,600,800,40,15);

    // 在x轴上旋转该圆柱体
    geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));
    //
    geom.mergeVertices();
    var l = geom.vertices.length;
    //创建波浪效果
    this.waves = [];

    for (var i=0;i<l;i++){
      var v = geom.vertices[i];
      this.waves.push({y:v.y,
                       x:v.x,
                       z:v.z,
                       ang:Math.random()*Math.PI*2,
                       amp:5 + Math.random()*15,
                       speed:0.016 + Math.random()*0.032
                      });
    };
    // 创建网格材质
    var mat = new THREE.MeshPhongMaterial({
        color:Colors.blue,
        transparent:true,
        opacity:.8,
        shading:THREE.FlatShading,
    });

    // 通过材质和几何体来创建一个物体
    this.mesh = new THREE.Mesh(geom, mat);

    // 使他可以接受阴影
    this.mesh.receiveShadow = true;
}
Sea.prototype.moveWaves = function (){
  //得到圆柱体的顶点
  var verts = this.mesh.geometry.vertices;
  //取顶点数
  var l = verts.length;
  for (var i=0; i<l; i++){
    var v = verts[i];
    var vprops = this.waves[i];
    //改变顶点的位置制造波浪效果
    v.x =  vprops.x + Math.cos(vprops.ang)*vprops.amp*.5;
    v.y = vprops.y + Math.sin(vprops.ang)*vprops.amp*.5;
    vprops.ang += vprops.speed;
  }
  this.mesh.geometry.verticesNeedUpdate=true;
}

Cloud = function(){
    //创建一个能够包裹云的不同部分的容器
    this.mesh = new THREE.Object3D();
    //创建一个能够被复制以构建云的立方体
    var geom = new THREE.BoxGeometry(20,20,20);
    var mat = new THREE.MeshPhongMaterial({
        color:Colors.white,
    });
    //随机创建立方体一定数量的副本
    var nBlocs = 3+Math.floor(Math.random()*3);

    for (var i = 0; i < nBlocs; i++) {

        var m = new THREE.Mesh(geom,mat);

        m.position.x = i*15;
        m.position.y = Math.random()*10;
        m.position.z = Math.random()*10;
        m.rotation.z = Math.random()*Math.PI*2;
        m.rotation.y = Math.random()*Math.PI*2;

        //随机创建方块的大小
        var s = .1+Math.random()*.9;
        m.scale.set(s,s,s);

        //允许每个方块可以投射和接受阴影
        m.castShadow = true;
        m.receiveShadow = true;

        this.mesh.add(m);

    }

}

Sky = function(){

    this.mesh = new THREE.Object3D();

    //定义散落在空中的云朵数量
    this.nClouds = 20;
    this.clouds = [];
    //将云朵在圆周上均匀分布
    var stepAngle = Math.PI*2 / this.nClouds;

    //创建云朵
    for (var i = 0; i < this.nClouds; i++) {

        var c = new Cloud();
        this.clouds.push(c);
        //云朵所处的角度
        var a = stepAngle*i;
        //设定云朵和轴之间的距离
        var h = 750 + Math.random()*200;
        //通过三角变换得到xy的值
        c.mesh.position.y = Math.sin(a)*h;
        c.mesh.position.x = Math.cos(a)*h;
        //让云朵自转
        c.mesh.rotation.z = a + Math.PI/2;
        //将云朵放在场景的不同景深中
        c.mesh.position.z = -400-Math.random()*400;
        //随机设定云朵大小
        var s = 1+Math.random()*2;
        c.mesh.scale.set(s,s,s);

        this.mesh.add(c.mesh);
     }
}

var AirPlane = function(){

    this.mesh = new THREE.Object3D();

    //创建客舱
    var geomCockpit = new THREE.BoxGeometry(80,50,50);
    var matCockpit = new THREE.MeshPhongMaterial({
        color:Colors.red,shading:THREE.FlatShading
    });
    //修改顶点位置（0-8依次为从右向左两个面上的四个顶点)
    geomCockpit.vertices[4].y-=10;
    geomCockpit.vertices[4].z+=20;
    geomCockpit.vertices[5].y-=10;
    geomCockpit.vertices[5].z-=20;
    geomCockpit.vertices[6].y+=30;
    geomCockpit.vertices[6].z+=20;
    geomCockpit.vertices[7].y+=30;
    geomCockpit.vertices[7].z-=20;

    var cockpit = new THREE.Mesh(geomCockpit, matCockpit);
    cockpit.castShadow = true;
    cockpit.receiveShadow = true;
    this.mesh.add(cockpit);

    //创建发动机
    var geomEngine =  new THREE.BoxGeometry(20,50,50);
    var matEngine = new THREE.MeshPhongMaterial({
        color:Colors.white,shading:THREE.FlatShading
    });
    var engine = new THREE.Mesh(geomEngine,matEngine);
    engine.position.x = 50;
    engine.castShadow = true;
    engine.receiveShadow = true;
    this.mesh.add(engine);

    //创建尾翼
    var geomTailPlane = new THREE.BoxGeometry(15,20,5);
    var matTailPlane = new THREE.MeshPhongMaterial({
        color:Colors.red,shading:THREE.FlatShading
    });
    var tailPlane = new THREE.Mesh(geomTailPlane,matTailPlane);
    tailPlane.position.set(-40,20,0);
    tailPlane.castShadow = true;
    tailPlane.receiveShadow = true;
    this.mesh.add(tailPlane);

    //创建机翼
    var geomSideWing = new THREE.BoxGeometry(30,5,140);
    var matSideWing = new THREE.MeshPhongMaterial({color:Colors.red, shading:THREE.FlatShading});
    var sideWing = new THREE.Mesh(geomSideWing, matSideWing);
    sideWing.position.set(0,15,0);
    sideWing.castShadow = true;
    sideWing.receiveShadow = true;
    this.mesh.add(sideWing);



    //创建螺旋桨
    var geomPropeller = new THREE.BoxGeometry(20,10,10);
    geomPropeller.vertices[4].y-=5;
    geomPropeller.vertices[4].z+=5;
    geomPropeller.vertices[5].y-=5;
    geomPropeller.vertices[5].z-=5;
    geomPropeller.vertices[6].y+=5;
    geomPropeller.vertices[6].z+=5;
    geomPropeller.vertices[7].y+=5;
    geomPropeller.vertices[7].z-=5;
    var matPropeller = new THREE.MeshPhongMaterial({color:Colors.brown, shading:THREE.FlatShading});
    this.propeller = new THREE.Mesh(geomPropeller, matPropeller);
    this.propeller.castShadow = true;
    this.propeller.receiveShadow = true;

    //创建叶片
    var geomBlade = new THREE.BoxGeometry(1,80,10);
    var matBlade = new THREE.MeshPhongMaterial({color:Colors.brownDark, shading:THREE.FlatShading});
    var blade1 = new THREE.Mesh(geomBlade, matBlade);
    blade1.position.set(8,0,0);

    blade1.castShadow = true;
    blade1.receiveShadow = true;

    var blade2 = blade1.clone();
    blade2.rotation.x = Math.PI/2;

    blade2.castShadow = true;
    blade2.receiveShadow = true;

    this.propeller.add(blade1);
    this.propeller.add(blade2);
    this.propeller.position.set(60,0,0);
    this.mesh.add(this.propeller);

    //创建轮子
    var wheelProtecGeom = new THREE.BoxGeometry(30,15,10);
    var wheelProtecMat = new THREE.MeshPhongMaterial({color:Colors.red, shading:THREE.FlatShading});
    var wheelProtecR = new THREE.Mesh(wheelProtecGeom,wheelProtecMat);
    wheelProtecR.position.set(25,-20,25);
    this.mesh.add(wheelProtecR);

    var wheelTireGeom = new THREE.BoxGeometry(24,24,4);
    var wheelTireMat = new THREE.MeshPhongMaterial({color:Colors.brownDark, shading:THREE.FlatShading});
    var wheelTireR = new THREE.Mesh(wheelTireGeom,wheelTireMat);
    wheelTireR.position.set(25,-28,25);

    var wheelAxisGeom = new THREE.BoxGeometry(10,10,6);
    var wheelAxisMat = new THREE.MeshPhongMaterial({color:Colors.brown, shading:THREE.FlatShading});
    var wheelAxis = new THREE.Mesh(wheelAxisGeom,wheelAxisMat);
    wheelTireR.add(wheelAxis);

    this.mesh.add(wheelTireR);

    var wheelProtecL = wheelProtecR.clone();
    wheelProtecL.position.z = -wheelProtecR.position.z ;
    this.mesh.add(wheelProtecL);

    var wheelTireL = wheelTireR.clone();
    wheelTireL.position.z = -wheelTireR.position.z;
    this.mesh.add(wheelTireL);

    var wheelTireB = wheelTireR.clone();
    wheelTireB.scale.set(.5,.5,.5);
    wheelTireB.position.set(-35,-5,0);
    this.mesh.add(wheelTireB);

    var suspensionGeom = new THREE.BoxGeometry(4,20,4);
    suspensionGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0,10,0))
    var suspensionMat = new THREE.MeshPhongMaterial({color:Colors.red, shading:THREE.FlatShading});
    var suspension = new THREE.Mesh(suspensionGeom,suspensionMat);
    suspension.position.set(-35,-5,0);
    suspension.rotation.z = -.3;
    this.mesh.add(suspension);

    this.pilot = new Pilot();
    this.pilot.mesh.position.set(-10,27,0);
    this.mesh.add(this.pilot.mesh);

    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
}

var Pilot = function(){

    this.mesh = new THREE.Object3D();
    this.mesh.name = "pilot";

    //头发的动画
    this.angleHairs = 0;

    //飞行员的身体
    var bodyGeom = new THREE.BoxGeometry(15,15,15);
    var bodyMat = new THREE.MeshPhongMaterial({
        color:Colors.brown,shading:THREE.FlatShading
    });
    var body = new THREE.Mesh(bodyGeom,bodyMat);
    body.position.set(2,-12,0);
    this.mesh.add(body);

    //飞行员的面部
    var faceGeom = new THREE.BoxGeometry(10,10,10);
    var faceMat = new THREE.MeshPhongMaterial({
        color:Colors.pink
    });
    var face = new THREE.Mesh(faceGeom,faceMat);
    this.mesh.add(face);

    //飞行员的头发
    var hairGeom = new THREE.BoxGeometry(4,4,4);
    var hairMat = new THREE.MeshPhongMaterial({
        color:Colors.brown
    });
    var hair = new THREE.Mesh(hairGeom,hairMat);
    //使头发从底部对齐，便于后面整体缩放(通过矩阵变换改变了立方体的中心点)
    hair.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0,2,0));

    //创建一个头发容器
    var hairs = new THREE.Object3D();
    //创建一个包裹顶部头发的容器(这部分头发可以动)
    this.hairsTop = new THREE.Object3D();
    //创建头顶的头发，并把它们放在一个3x4的网格中
    for (var i = 0; i < 12; i++) {
        var h = hair.clone();
        var col = i%3;
        var row = Math.floor(i/3);
        var startPosX = -4;
        var startPosZ = -4;
        h.position.set(startPosX + row*4,0,startPosZ + col*4);
        this.hairsTop.add(h);
    }
    hairs.add(this.hairsTop);

    //创建靠近脸的那部分头发
    var hairSideGeom = new THREE.BoxGeometry(12,4,2);
    //将中心轴点转移到x=-6的轴面上
    hairSideGeom.applyMatrix(new THREE.Matrix4().makeTranslation(-6,0,0));
    var hairSideR = new THREE.Mesh(hairSideGeom,hairMat);
    var hairSideL = hairSideR.clone();
    hairSideR.position.set(8,-2,6);
    hairSideL.position.set(8,-2,-6);
    hairs.add(hairSideR);
    hairs.add(hairSideL);

    //创建脑袋后方的头发
    var hairBackGeom = new THREE.BoxGeometry(2,8,10);
    var hairBack = new THREE.Mesh(hairBackGeom,hairMat);
    hairBack.position.set(-1,-4,0);
    hairs.add(hairBack);
    hairs.position.set(-5,5,0)

    this.mesh.add(hairs);

    //创建眼镜部分
    var glassGeom = new THREE.BoxGeometry(5,5,5);
    var glassMat = new THREE.MeshLambertMaterial({color:Colors.brown});
    var glassR = new THREE.Mesh(glassGeom,glassMat);
    glassR.position.set(6,0,3);
    var glassL = glassR.clone();
    glassL.position.z = -glassR.position.z;
    //创建镜架
    var glassAGeom = new THREE.BoxGeometry(11,1,11);
    var glassA = new THREE.Mesh(glassAGeom, glassMat);
    this.mesh.add(glassR);
    this.mesh.add(glassL);
    this.mesh.add(glassA);
    //创建耳朵部分
    var earGeom = new THREE.BoxGeometry(2,3,2);
    var earL = new THREE.Mesh(earGeom,faceMat);
    earL.position.set(0,0,-6);
    var earR = earL.clone();
    earR.position.set(0,0,6);
    this.mesh.add(earL);
    this.mesh.add(earR);
}

//使头发运动起来
Pilot.prototype.updateHairs = function(){

    var hairs = this.hairsTop.children;

    var l = hairs.length;
    for (var i = 0; i < l; i++) {

        var h = hairs[i];
        //每个头发按周期在75%到100%之间缩放,也就是将头发变为斜坡形
        h.scale.y = .75 + Math.cos(this.angleHairs + i/3)*.25;
    }
    //下一轮的增量
    this.angleHairs += 0.16;
}

// 实例化物体并加到场景中

var sea,
    sky,
    airplane;

function createSea(){
    sea = new Sea();
    sea.mesh.position.y = -600;
    scene.add(sea.mesh);
}
function createSky(){
    sky = new Sky();
    sky.mesh.position.y = -600;
    scene.add(sky.mesh);
}
function createPlane(){
    airplane = new AirPlane();
    airplane.mesh.scale.set(.25,.25,.25);
    airplane.mesh.position.y = 100;
    scene.add(airplane.mesh);
}

var mousePos = {x:0,y:0};

function handleMouseMove(event){

    //将鼠标位置归一化为-1到1之间的值
    var tx = -1 +(event.clientX / WIDTH)*2;
    var ty = 1 - (event.clientY / HEIGHT)*2;

    mousePos = {x:tx,y:ty};
}

function updatePlane(){
    //规定飞机可以运动的位置
    var targetX = normalize(mousePos.x,-.75,.75,-100,100);
    var targetY = normalize(mousePos.y,-.75,.75,25,175);

    //更新飞机的位置
    // 使飞机移动划分为一帧一帧的改变
    airplane.mesh.position.y += (targetY-airplane.mesh.position.y)*0.1;
    airplane.mesh.position.x += (targetX-airplane.mesh.position.x)*0.1;

    // 给飞机加上一定的自传
    airplane.mesh.rotation.z = (targetY-airplane.mesh.position.y)*0.0128;
    airplane.mesh.rotation.x = (airplane.mesh.position.y-targetY)*0.0064;
    //螺旋桨的旋转
    airplane.propeller.rotation.x += 0.3;
}

//镜头前后调整
function updateCameraFov(){
  camera.fov = normalize(mousePos.x,-1,1,40, 80);
  camera.updateProjectionMatrix();
}

function normalize(v,vmin,vmax,tmin, tmax){

    var nv = Math.max(Math.min(v,vmax), vmin);
    var dv = vmax-vmin;
    var pc = (nv-vmin)/dv;
    var dt = tmax-tmin;
    var tv = tmin + (pc*dt);
    return tv;

}

//获得飞行距离
function updateDistance(){
  game.distance += game.speed*deltaTime*game.ratioSpeedDistance;
  // fieldDistance.innerHTML = Math.floor(game.distance);
  var d = 502*(1-(game.distance%game.distanceForLevelUpdate)/game.distanceForLevelUpdate);
  // levelCircle.setAttribute("stroke-dashoffset", d);

}

function loop(){

  updatePlane();
  sea.mesh.rotation.z += .008;
  sky.mesh.rotation.z += .01;
  sea.moveWaves();
  airplane.pilot.updateHairs();
  updateCameraFov();

  renderer.render(scene, camera);
  //调用自身
  requestAnimationFrame(loop);

}


function init(){

    //创建场景、视角和渲染器
    createScene();

    //增加灯光效果
    createLights();

    //增加物体
    createSea();
    createSky();
    createPlane();


    document.addEventListener('mousemove', handleMouseMove, false);

    //循环更新物体的位置并重新渲染场景
    loop();
}

window.addEventListener('load',init,false);