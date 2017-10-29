# Redux with React

## Redux中的三个概念
### 1. store（单一数据源原则）

用于存储应用中所有的数据（state以对象树的形式存在），一个应用中只能有一个，他是一个上层的接口，state实际在reducer中进行初始化和更新，可以拆分成不同的部分（每一部分的state可能是原来state的某几个键值，在合并时需写明其参数）但需要用combineReducer（）把他们合并起来。
用法：
```
import { createStore } from 'redux';
import yourReducer from './reducers';

let store = createStore(yourReducer);

//for react
<Provider store={store}>
    <APP />
 </Provider>,
```

### 2. reducer（state是只读的，使用纯函数执行修改）
用于更新state的值，初始化的state的值也是写在这里，可以为空但不能为undefined。state的更新需要从action中传入更新后的state的值（`action.yourvalue`）和产生更新的行为`action.type`。

进行state的更新时需要注意，返回的state不应是对原对象的更改，而应是返回一个全新的对象。

用法：
```
export default const MyReducer = (state ={}, action) => {
    switch(action.type){
        case 'ONE_ACTION':
            return NewState;
        default:
            return state;
    }
}
```

### 3. action
是store的数据修改的来源，一般通过`dispatch(storechangeFuc(newState))`的方法将修改后的state的值（可以是state对象的某些属性值）传入reducer，然后在reducer中实现state的更新。

用法：
```
actions/index.js

export const storechangeFuc = (newState) => {
    return {
        type： 'ONE_ACTION"
        stateKey：newState
    }
}

components/oneComponent.js
// 声明一个dispatch的函数
const boundAddTodo = (text) => dispatch(addTodo(text))
//在适当的位置调用他
boundAddTodo(text);
```

## react+redux 基础流程总结
网上会有很多的框图来总结这个，但是我发现我对框图的阅读无力，所以用文字记录下，仅供自己阅读。

将redux是一个独立的数据流方案，他可以搭配任何框架使用，甚至原生js。这里，整理一下配合react使用是的总体思路。

1. 引入react-redux将两者连起来由此得到Provider和connect，分别用于传入store和将state，dispatch与react连起来。

2. 用Provider标签将应用包裹起来，并将store以props的方式传入，然后将整个Provider传入react的render中，渲染出来。
```
import { Provider } from 'react-redux';
render(
  <Provider store={store}>
    <MovieBox />
  </Provider>,
  document.getElementById('demo')
);
```
为了得到store，redux为我们封装好了createStore方法，所以在render之前我们需要拿到store：
```
import { createStore } from 'redux';
let store = createStore(MyReducer);
```
3. createStore是以你的reducer为参数的，所以我们需要完成我们的reducer函数。如果业务逻辑较多，你可以将他分为几个小的reducer然后用combineReducers将他们合并起来。
```
import { combineReducers } from 'redux';

const MyReducer = combineReducers({
    oneReducer,
    anotherReducer
});//如果这几个reducer你放在不同的文件中，你需要将他们import进来
```
4. 在reducer之前你需要完成你的actions，actions中的函数名对应以业务逻辑中dispatch的相关函数，参数为修改的state，返回action.type和state合并后的对象传入reducer中。

5. 你的react组件要对state进行更新需要去store中拿到相关数据，和相关dispatch函数。
通过 `mapStateToProps（state）`方法拿到你需要的state，并将其放在该组件的props中；
通过 `mapDispatchToProps（dispatch）`方法拿到actions中的dispatch方法，并将其放在该组件的props中。
以上要通过`connect(mapStateToProps,mapDispatchToProps)`实现
然后你就可以通过`this.props.xx` 来修改调用相关数据和函数。

6. 在state更新之后，应用就会重新render得到新的视图。

## Redux中更新state的正确姿势
state不应该被重写而是应该返回一个新的state，所以要时刻注意返回的state是一个全新的而不是在原来的地址上修改的。你可以参考文档中的immutable helpers 也可以在项目中引入Immutable.js。

### 1. 修改数组
- 添加项目（不要使用push）
```
return list.concat(newItems);
或者采用ES6的写法：
return [...list,0];
```
这里有一个小的tips，当你的state是一个对象，而数组是作为对象的一个键值的时候，如何更改这个数组。很容易误以为这个数组没有名字，实际上他的名字就是state.key。
```
let myObject={
  arr1：[1,2,3],
  others:'abc
}
let updateObject = Object.assign({},myObject,{arr1:[...myObject.arr1,[4,5,6]]});
```
- 删除项目（不要使用splice）
```
return list.slice(0,index).concat(list.slice(index+1));
或者采用ES6的写法
return [...list.slice(0, index), ...list.slice(index+1)];
```
- 修改项目
```
eg：将某一项加一
return list.slice(0,index).concat(list[index] + 1).concat(list.slice(index+1);
ES6：
return [...list.slice(0,index),list[index]+1,...list.slice(index+1)];
```
### 2. 修改对象
不能只是简单地修改对象的键值，要返回一个新的对象。
你可以新建一个新的对象然后将每组键值重写一遍。或者使用react-addons-update库中的update方法。

对于ES6中你可以使用Object.assign（{}，state，{key：newvalue}）；

注意{...state,{key:newvalue}}这样的写法在ES7中才可用。