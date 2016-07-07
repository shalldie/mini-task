# Task

### Include the callbacks,queue,promise,async(series...others're coming)

### Make it easy to control the process :).

### 包含了这些模块： callbacks,queue,promise,async(series...添加中)

### 专为异步流程控制，如此简单 :)。

> It's api like jQuery and async.  
> api 跟 jQuery 和 async 类似

## Why chose task (为什么要使用task)?
    Front end boom! There are many asynchronous library, promise, Co, async, Q and so on......
    But! I am not used to, the original promise I think it is too difficult to use, CO to change my writing habits, async, yes, and async.
    Async some parameters to pass null (or I'm not used at present? )! Almost anti human!
    
    Here need to mention jQuery, I personally think jQuery too cock, not only is a DOM, a series of methods for built-in let me stop.
    But! A lot of people think that jQuery is too low, just to those low level of slag to use, I use a JQ to be ready to be sprayed.
    
    Think of a piece here:
    -- colleague A points to a special Xuan to ask: "you don't have to JQ can make this come out?""
    -- Thinking for a long time... Don't leave JQ ah, simply wrote the first JQ.
    Of course I can't write it out.
    
    So, the task of this article, just make me feel good, and I like to use, asynchronous process control aspects of the API, with my way to achieve it again!
    I believe you will like it!


    前端异常繁荣！异步库有很多，promise，co，async，Q 等等等等......
    但是！我用不惯，原生的 promise 我觉得太难用了，co 要改变我的写作习惯，async，对，还有async。
    async中一些参数要传null(或者是我目前没用到？)！简直反人类！
    
    这里需要提一下 jQuery ，我个人觉得 jQuery 太屌，不仅仅是dom，内置的一系列方法让我欲罢不能。
    但是！很多人觉得 jQuery 太low，只是给那些低水平的渣渣来用，我用个jq就要做好被喷的准备。

    这里想起一个段子：
    -- 同事A指着一个特别炫的轮显问：“你不用jq能把这个做出来么？”
    -- 思考良久...离开jq搞不定啊，索性先写了个jq出来。
    当然我是写不出来的。

    So，本篇的task，只是把我觉得优秀的，且我喜欢用的，异步流程控制方面的api，用我的方式实现了一遍！

    相信你也会喜欢！ 

## Api and demos， Api 和 例子

### extension

    Done,description is coming.
    已完成，待添加描述。

### tool

    Done,description is coming.
    已完成，待添加描述。

### callbacks

    Like jQuery.Callbacks,follow Pub/Sub
    跟jq的callbacks很像，这里我看了它的代码，在我能看懂的范围内及其精简化。
    主要就是观察者模式 (发布/订阅)。
```js
    var cb = task.callbacks();

    cb.add(function(n){
        console.log(n);
    });

    cb.add(function(n){
        console.log(n*2);
    });

    cb.fire(1); 
    // out:
    // 1
    // 2
```
    'once'
```js
    var cb = task.callbacks('once');

    cb.add(function(n){
        console.log(n);
    });

    cb.fire(1);
    // 输出1，后面的代码没有效果
    // out:
    // 1

    cb.add(function(n){
        console.log(n*2);
    });

    cb.fire(1); 
    // nothing will happen
```
    'memory'
```js
    var cb = task.callbacks('memory');

    cb.add(function(n){
        console.log(n);
    });

    cb.fire(1);
    // out:
    // 1

    cb.add(function(n){
        console.log(n*2);
    });
    // out:
    // 2
```
    and 'stopOnFalse' ... U know what it is.Stop when a function returns false;
    还有 'stopOnFalse' ... 望文生义，某个function返回false的时候就停了。

    All args can use together,split by space
    所有的参数，都可以放在一起使用，用空格分离。
```js
    var cb = task.callbacks('once memory'); //usefull,like a deferred! 很有用，有些类似deferred。
```

### queue
    Base method(基础的方法)：
```js
    var q = task.queue();

    for(var i=0;i<10;i++){
        q.queue(function(next,num){
            console.log(num);
            setTimeout(function(){
                next(num*2);
            },1);
        });
    }

    q.dequeue(1);
    // out:1 2 4 8 16 32 64 128 256 512
```
    If u don't need params(如果不需要参数)：    
```js
    var q = task.queue();

    for(var i=0;i<10;i++){
        q.will(function(){
            console.log(new Date().getSeconds());
        }).delay(1000);
    }

    q.dequeue();
    // It likes a block~
    // 像闹钟一样，每秒打印一次
```
    Error? 万一某个地方有错误呢？
    Please use catch,请用catch
```js

    var q = task.queue();

    q
    .queue(function(next){
        //......
        next();
    })
    .will(function(){
        throw Error("I'm a error!")
    })
    .will(function(){
        //......
    })
    .catch(function(err){
        console.log(err);
    })

    q.dequeue();
    // out:[Error: I'm a error!]
```
### deferred

    Done,description is coming.
    已完成，待添加描述。

### async

    Done,description is coming.
    已完成，待添加描述。

#### series

    Done,description is coming.
    已完成，待添加描述。

#### waterfall

Done,description is coming.
已完成，待添加描述。

#### parallel

Done,description is coming.
已完成，待添加描述。

#### parallelLimit

Done,description is coming.
已完成，待添加描述。