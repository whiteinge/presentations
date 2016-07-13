<section id="reactive-programming" class="titleslide slide level1 present" data-background="http://reactivex.io/assets/reactivex_bg.jpg" data-background-image="http://reactivex.io/assets/reactivex_bg.jpg" style="top: 186px; display: block">
<h1 style="color: white">Reactive Programming</h1>
</section>

## A Practical Introduction

Open West 2016

by Seth House  
@whiteinge

https://github.com/whiteinge/presentations/  
tree/master/openwest_2016-07_reactive-programming

## What is Reactive?

* Declarative.
* React to an event.
* A unified API for sync & async operations.

<div class="notes">
* DOM Events
* Ajax Events
* Server-sent Events
* Websockets
* setInterval, setTimeout
* Service Workers
* jQuery events, Node streams, etc.
</div>

## Reactive Extensions

![](http://reactivex.io/assets/Rx_Logo_S.png)  
http://reactivex.io/

# Learning Rx

## Common API

> It is better to have 100 functions operate on one data structure than 10
> functions on 10 data structures.

– Alan Perlis

<div class="notes">
http://pu.inf.uni-tuebingen.de/users/klaeren/epigrams.html
</div>

## Rx API

* Large API, but...

* Filtering: `filter`
* Transforming: `map`, `reduce`
* Collecting: `scan`
* Buffering: `take`, `takeLast`, `pauseable`/`pauseableBuffered`
* Combining: `merge`/`concat`, `flatMap`/`concatMap`, `combineLatest`

## Primitives

* Observer.
* Observable.
* Subscriptions.
* Disposables.

## Language Implementations

C#, C# (Unity), C++, Clojure, Groovy, JRuby, Java, JavaScript, Kotlin, Python,
Ruby, Scala, and Swift.

Platform-specific support for Android, Cocoa, and Netty.

# Short Examples

## Ajax Request

```js
var mySubscription = Rx.DOM.get('https://api.github.com/users')
    .subscribe(response => console.log('Got response', response));
```

## DOM Events

```js
var domEl = document.querySelector('#thelink');
var clicks = Rx.Observable.fromEvent(el, 'click')
    .scan(acc => acc + 1, 0)
    .subscribe(count => console.log(`Seen ${count} clicks.`));
```

## Server-sent events

```js
var source = Rx.DOM.fromEventSource("/events");
source.map(JSON.parse).subscribe(
    msg => console.log('msg', msg),
    err => console.log('Stream complete.'));
```

## Polling

```js
var results = Rx.Observable.interval(20000)
    .flatMapLatest(() => Rx.DOM.get('https://api.github.com/users'))
    .distinctUntilChanged()
    .subscribe(x => console.log('New results: ', x));
```

## Combine Ajax Requests

```js
var combinedResults = Rx.DOM.getJSON('https://api.github.com/users/1')
    .flatMap(user_resp => Rx.DOM.getJSON(user_resp.followers_url)
        .map(followers => ({user: user_resp, followers}));
    });
```

# Implementation

## Observer

* A consumer.
* Optional next, error, and completed methods.

```js
var myObserver = {
    onNext: x => console.log('Got value', x),
    onError: err => console.log('Got error', err),
    onCompleted: () => console.log('Completed'),
};
```

<div class="notes">
Excellent overview of Observers, Observables, operators by Ben Lesh:
https://medium.com/@benlesh/learning-observable-by-building-observable-d5da57405d87
</div>

## Observable

* A function that takes an observer and returns a cancellation function.
* Glue to connect a producer to a consumer (observer).

```js
function myObservable(observer) {
    setTimeout(() => observer.onNext('Hello'), 1000);
    setTimeout(() => observer.onCompleted(), 2000);

    return function() {
        console.log('Canceled.');
    };
}
```

## Common Observable Sources

`just`, `from`, `range`, `fromEvent`, `fromEventPattern`, `fromCallback`,
`fromNodeCallback`, `fromPromise`, `generate`, `generateWithAbsoluteTime`,
`generateWithRelativeTime`

## Subscriptions and Disposables

Start Listening:
```js
var mySubscription = myObservable.subscribe(myObserver);
```

Stop Listening:
```js
mySubscription.dispose();
```

Stop Listening Automatically:
```js
mySubscription.take(3);
```

## Cold vs. Hot

* Movie vs. live performance.

## Operators

```js
function map(source, projectionFn) {
    return new Observable(function(observer) {
        var mapObserver = {
            onNext: x => observer.next(projectionFn(x)),
            onError: err => observer.onError(err),
            onCompleted: observer.onCompleted(),
        };

        return source.subscribe(mapObserver);
    });
}
```

<div class="notes">
Subscriptions do not need to be disposed if the source completes. You may
dispose the subscription if you wish to stop listening _before_ the source is
exhausted. It's more common to dispose of subscriptions by using an operator
that terminates the subscription as part of its design like Take, TakeWhile,
TakeUntil.
</div>

## Unicast vs. Multicast

* Reuse & share the underlying subscription, or
* Subscribe individually.

# Use Rx

## Use Descision Trees

* [Which RxJS creation operator?](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/gettingstarted/which-static.md)
* [Which RxJS instance operator?](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/gettingstarted/which-instance.md)

## Merge Observables

Example questions to ask when combining Ajax requests:

* Output each response as soon as it comes in?
* Output each response in the same order as the request?
* Wait for both to complete and combine them?
* Do one request, and use the result within the next?

## Debugging

```js
myObservable
    .filter(x => x.someAttr)
    .do(x => console.log('Passed the filter: ', x))
    .map(doSomethingWithSomeAttr)
    .do(x => console.log('Current value of x: ', x));
```

# Long Examples

## Close a Modal

```js
var keysource = Rx.dom.keydown(window)
    .pluck('keycode')
    .filter(x => x === 27); // escape key

var clicksource = Rx.dom.click(window)
    .skip(1) // ignore first click that opens the modal
    .filter(ev => document.querySelector(this).contains(ev.target));

keysource.merge(clicksource)
    .take(1)
    .subscribe(closeModal);
```

## Track Application State

React's Flux implemented in RxJS. [Full
example](https://gist.github.com/whiteinge/e8edb98ca8e94d769b8b827de6082427).

```js
var Dispatcher = new Rx.Subject();

var Store1 = Dispatcher
    .filter(x => x.tag === 'foo')
    .scan(collectUserInput)
    .flatMap(ajaxRequest);

var View1 = Store1
    .map(formatResponseAsHTML);

var contentEl = document.querySelector('#content');
var renderer = View1.subscribe(function(content) {
    React.render(content, contentEl);
});

```

<div class="notes">
Simple but _heavily_ customizable (easy to add routing, logging, modules).
</div>

## Serve HTTP Requests

Use Node.js's builtin HTTP module. [Full example](https://gist.github.com/whiteinge/997d2be18f51637340dc).

```js
var requests$ = createServer(8000).share();

var handleSomePath = requests$
    .filter(x => return x.req.url === '/somepath')
    [...];

function createServer(port) {
    return Rx.Observable.create(function(observer) {
        var server = http.createServer(function(req, resp) {
            observer.onNext({req: req, resp: resp});
        });

        server.listen(port);

        // Disposing the server observable will stop the server.
        return function() {
            observer.onCompleted();
            server.close();
        };
    });
}
```

## Listen to Salt's Event Bus

Using RxPy. (Watch for Salt PR.)

```python
def salt_events_observable(observer):
    log.debug('Starting Salt event listener.')
    event_bus = salt.utils.event.get_event(...)

    def deserialize_and_emit(raw):
        mtag, data = salt.utils.event.SaltEvent.unpack(raw)
        observer.on_next({'tag': mtag, 'data': data})

    def destroy():
        log.debug('Destroying Salt event listener.')
        event_bus.destroy()

    event_bus.set_event_handler(deserialize_and_emit)
    return destroy

source = Observable.create(salt_events_observable).publish().ref_count()
job_events = source
    .filter(lambda x: fnmatch(x['tag'], 'salt/job/*/ret/*'))
    .subscribe(lambda x: print('Job Event: {0}'.format(x)))
```

# Resources

## Sandbox

```html
data:text/html,<!doctype html><html><script src="https://cdnjs.cloudflare.com/ajax/libs/rxjs/4.1.0/rx.all.js"></script><script src="https://cdnjs.cloudflare.com/ajax/libs/rxjs-dom/7.0.3/rx.dom.js"></script><script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.13.1/lodash.min.js"></script></html>
```

## Links

API Docs:

* [Operators documentation](http://reactivex.io/documentation/operators.html)
* [The Big List (TM) of RxJS operators](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md)

Decision Trees:

* [Which RxJS creation operator?](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/gettingstarted/which-static.md)
* [Which RxJS instance operator?](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/gettingstarted/which-instance.md)
* [Broad Rx Decision Tree](http://reactivex.io/documentation/operators.html#connectable)

Beginner resources:

* [RxJS Koans](https://github.com/Reactive-Extensions/RxJSKoans)
* [The Rx Book](http://xgrommx.github.io/rx-book)

Advanced resources:

* [Building Observables](https://medium.com/@benlesh/learning-observable-by-building-observable-d5da57405d87#.fohg6dc55)

<div class="notes">
1.   Create a loose outline of ideas, references, and talking points.
2.   Categorize into: must know, need to know, don't need to know (cut).
3.   Restructure into the following sections:

* Opening. Capture attention; avoid introductions and fluff.
* Current situation. Establish importance.
* Recommendation.
* Benefits. Personalize for the audience.
* Evidence. Support the recommendation; don't revisit current situation.
* Summary. Short!
* Action steps. Specific actions; specific time-frame.

Reactive programming has gotten a lot of attention this year and for good
reason. It presents a unified API for asynchronous operations and
drastically reduces having to manage application state. The result is often
terse code that presents a simple interface on complex operations.

Reactive programming itself is composed of a few simple primitives. Popular
reactive libraries have built high-level and often large interfaces on
those low-level parts which can make learning reactive programming feel
daunting and academic for newcomers. A good grasp of the fundamentals
paired with real-world examples can make the large API approachable and
even appreciated.

This talk will provide an introduction to reactive programming by building
an observer and an observable, and then exploring a wide range of
real-world problems. We will demo event listeners, user interaction, HTTP
requests, retrying failed operations, live data streaming, tracking
application state, as well as methods of combining all those into a single
data stream. All examples are plucked from production code and adapted for
a presentation format.

Code examples will use the popular, mature, and performant ReactiveX
library from Microsoft -- specifically the JavaScript port RxJS -- but the
examples are directly applicable to other language ports. At the time of
this writing ReactiveX has been ported to the following languages and
platforms: C#, C#(Unity), C++, Clojure, Groovy, JRuby, Java, JavaScript,
Kotlin, Python, Ruby, Scala, and Swift. Plus platform-specific support for
Android, Cocoa, and Netty.  :-D
</div>

