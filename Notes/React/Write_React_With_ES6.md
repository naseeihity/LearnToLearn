# 学习React的ES6写法

实习第一周，主要在学习React和Redux，写了一个帮助自己理解数据流的小demo，最开始写起来都是按照官方文档照猫画虎，但是生产环节大家都已经在用ES6来写React了，而文档中依然给的是ES5的写法，所以这里就整理一下React的一些基本思路以及ES6的写法。

## React
### 1. Fist Step -render
```
import React,{ Component } from 'react';
import ReactDOM from 'react-dom';

ReactDOM.render(
  <App />,
  document.getElementById('demo')
);
```
### 2. Second Step --components
```
class App extends Component{
  constructor(props){
    super(props);
    this.state=
  }

  func(){

  }
  
  render(){
    return(
      <div>
          <component />
          <components />
      </div>
    );
  }
}
```
### 3. 数据
1. state中存放在该组件中会改变的量，只能通过setState方法去改变state的值。
2. props中存放在该组件中不变的量或方法，一般从父组件继承而来，他的值是按地址传递的，所以当在子组件改变了传下来的值后也会影响父组件的值，你会误以为React存在双向的数据绑定。为了避免这种问题，你需要在传下来值之前对该prop进行immutable处理，实现一种深拷贝的效果。[Learn more about immutable.](https://github.com/camsong/blog/issues/3)

### 4. 组件间的通信
1. 父组件通过props把数据传给子组件，子组件需要通过父组件的props中定义的callback把修改后的数据传回子组件。
2. 兄弟组件间通信则需要在其共同的父组件上创建props，然后通过回调函数通信。
3. 当组件层级变深时，组件间的通信就变得十分复杂，因此便有了redux。
[Learn more about this.](http://www.alloyteam.com/2016/01/some-methods-of-reactjs-communication-between-components/)

## 用ES6写React

1. 引用与取值
```
import sth from ‘somewhere’;
improt { someClass } from 'somewhere';

let { someVar } = Father;//从Father中取出someVar变量
```
2. 组件定义与导出
```
export default class component from Component{
  render(){
    return (
      <div></div>
    )
  }
}
```
3. 初始化state
```
constructor(props){
   super(props);
   this.state = {
      
 };

```
4. 方法作为回调函数时  
需要用bind来绑定this，否则应该使用箭头函数。
```
onClick={this.show.bind(this);
onClick={() => show()};
```
[Learn more about ES6 Wtih React](http://bbs.reactnative.cn/topic/15/react-react-native-%E7%9A%84es5-es6%E5%86%99%E6%B3%95%E5%AF%B9%E7%85%A7%E8%A1%A8)
[One more](https://babeljs.io/blog/2015/06/07/react-on-es6-plus)
