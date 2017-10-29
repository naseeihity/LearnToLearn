终于自己动手制作了一次Chrome插件,完成了一个有基本功能的[saveToGist](https://github.com/naseeihity/saveToGist)的插件,最大收获在于第一次通过自己查阅各种资料,文档,API完成了一个可以用的小东西,也从中体会到了开发的乐趣.这篇文章依然是写给自己,作为总结,梳理一个完整的开发流程.

## 开始之前
网上可能有形形色色的教程,他们都能帮助你去完成一个简单的Demo,但是我依然认为阅读官方的文档时最好的途径.我自己也是一开始都通过开中文的教程去慢慢摸索,只是出于一个最简单的原因,对于英文的恐惧,虽然大部分单词都认识,但是放在一起的时候如果没有开发经验,很难正确理解意思,于是便会在做出东西前丧失兴趣.但是,当我回过头来再看文档时,很多重要的概念都在初次开发时被我忽略了,而文档中却写得很清晰.

所以,培养自己阅读官方文档的能力很重要.**并不一定要从头到尾去读它,了解一个基本的概念,用到什么查什么,马上应用到实践中去**是我目前发现的一个很好的学习方法.

## 基本概念

#### Manifest

`manifest.json` 是Chrome extension的配置文件,你可以在其中配置插件的相关信息,开放相关权限,以及设置一些关键文件的路径等,完整的内容可以看官方文档中的[介绍](https://developer.chrome.com/extensions/manifest). 也许你一看到那常常的JSON文件就头大了,其实你一开始并不需要一项项去了解他们,只需要有一个概念即可,需要什么再添加什么,甚至你不需要自己去写这个文件,后面你就会知道该如何偷懒.

#### browserAction

`browser_action` 中主要配置的是插件在浏览器工具栏的显示以及行为,其基本的配置如下:

```
"browser_action": {
  "default_icon": {                    // optional
    "16": "images/icon16.png",           // optional 16x16px,下同
    "24": "images/icon24.png",           // optional
    "32": "images/icon32.png"            // optional
  },
  "default_title": "Google Mail",      // optional; shown in tooltip
  "default_popup": "popup.html"        // optional
}
```
这里,我们可以看到Chrome给我们规定了几个ICON的大小,你可以分别添加他们以提供更友好的显示,什么你问我你没有24px的icon,但有一个25px的怎么办?放心用吧,只要文件是完整的,并不需要正好使用官方推荐的大小,当然如果没有某个大小,你最好能够用稍大一点的图标去替换.如果你不会自己制作图片,你或许可以在[这里](https://www.iconfinder.com/)找到许多精美的免费图标.

使用`browser_action`你的插件一直都是点亮的,如果你的插件直接特定的页面起作用,你可以去看看`page_aciton`,配置起来大同小异.

你也许已经注意到了在`browser_action`的配置中有一个`default_popup`,其值为一个页面的相对地址,这个页面就是点击你插件图标后会弹出的页面,下面我们就来看看popup是什么.

#### popup

`popup.html`就是你点击工具栏上的图片后弹出的界面,他和一个普通的web页面没有什么区别,最大的不同可能就是你需要自己根据需要在CSS中规定一下body的大小.是的,你可以像写正常的页面一样引入css文件和js文件,不过似乎不支持行间的js代码.

popup应该说是你的插件中最像一个正常的网页的部分了(还有`background.html`,但我们一般不在其中写内容),所以其中的js也和正常的网页一样,只有在页面打开的时候才会调用.所以就要特别注意,也许你通过pupop弹出了别的窗口,然后要从那些窗口向popup传回数据,这是就要特别小心,因为可能由于浏览器版本或系统版本的不同,你弹出页面的同时popup页面就自动关闭了,或者用户点击了正在浏览的页面也会关闭popup,所以如果有数据需要传递,就要传给拥有全局生命周期的`background.js`,再从其中发送数据给popup.

你不需要在popup中重复书写background中的一些代码,你可以直接获取到其中的方法
```
var backgroundPage = chrome.extension.getBackgroundPage();
backgroundPage.dosomething();//调用background中的方法
```

说了半天,background到底是什么?

#### background

background 可以分为 `persistent background pages`和`event pages` 故名思议,前者无论插件是否有代码需要运行都会常驻后台,这当然是不好的,所以目前官方推荐我们如果不是必须,则尽可能是evet pages.而这两者的区别其实只是一个配置项而已,你只需要

```
"background": {
    "scripts": ["background.js"],
    "persistent": false //配置这一项
}
```
这样配置就可以了.

理解EvetPage的生命周期至关重要,因为它是唯一一个会常驻后台,通过事件触发的程序.官网给出的生命周期为:

- The app or extension is first installed or is updated to a new version (in order to register for events).
- The event page was listening for an event, and the event is dispatched.
- A content script or other extension sends a message.
- Another view in the extension (for example, a popup) calls runtime.getBackgroundPage.

简单概括就是**事件触发**,无论是第一安装(install事件)还是别的页面发送信息过来(onMessage事件),都会触发他.所以一般我们会在background里做右键菜单的创建,全局事件的监听,消息在不同页面间的传递.

这里需要特别注意,只有在第一次安装或者升级时,background才会完整得执行,其他时候(比如重启浏览器后),他完全是事件驱动的,所以你要保证你的事件监听函数都在该页面的顶层作用域.

#### content_script

更多时候,我们的插件的功能都是去操作页面的DOM,而这时候就要提到content_script了,他就看起来像页面原本的js一样,在页面加载后被注入到页面中,其实他的实现更加巧妙,他只是共享了页面的DOM,所以你可以用它来操作页面而不需要考虑命名空间的问题.

其配置文件大致如下:
```
"content_scripts": [
    {
      "matches": ["http://www.google.com/*"],
      "css": ["mystyles.css"],
      "js": ["jquery.js", "myscript.js"]
    }
]
```

可以看出,你不仅可以在页面插入js,还可以插入css,甚至你可以针对不同的页面插入不同的文件.这里需要注意的时,如果你要引入第三方库的话,必须将其下载到本地,并不支持从cdn直接引入.

在content中支持的API也相对有限,只支持 `extension`,`i18n`,`runtime`,`storage`中的部分API.


## 消息传递
很多时候我们都需要在 popup,background,content之间传递消息.

在popup和background间或者从content向background传递消息,我们一般直接使用`chrome.runtime.sendMessage`和`chrome.runtime.onMessage.addListener`这两个API即可.需要注意的是,我们如果想从background向content传递消息的话,就必须使用`chrome.tab.sendMessage`这个API了,因为runtime.sendMessage并不支持被多个页面监听,而通过tab的API我们可以指定发送到的对象的tabID.

## 你还可能会用到的API
- `chrome.runtime.connect`,`chrome.tabs.connect` 建立长连接
- `chrome.tabs` 读取当前tab的相关信息
- `chrome.storage.sync` 存储
- `chrome.identity` 进行OAuth2 的认证
- `chrome.contextMenus` 右键菜单

## 使用脚手架
说了这么多,你也许想开始自己动手搭建一个插件了,但又想到长长的配置文件,和各种各样记不清的文件,以及最后打包发布,想想就麻烦.其实,你根本不需要从头开始自己搭建了,早有比你更懒的人看到了这里面的重复劳动,于是脚手架便诞生了.

[generator-chrome-extension](https://github.com/yeoman/generator-chrome-extension)
按照他的说明文档操作,你就能很快搭起基本的环境了.(注意在初始化的最后会进行`npm install`,如果你那里和我一样没有反应,你可以手动停掉他,然后自己来`cnpm install`)

如果你还有开发其他东西的需要,你可以在yeoman.io里找到更多丰富的脚手架.
