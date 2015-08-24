==============
React and RxJS
==============

.. |flux| image:: https://facebook.github.io/flux/img/flux_logo.svg
    :class: heading-img

.. |rx| image:: http://reactivex.io/assets/Rx_Logo_S.png
    :class: heading-img

.. |react| image:: https://upload.wikimedia.org/wikipedia/commons/5/57/React.js_logo.svg
    :class: heading-img

.. image:: https://upload.wikimedia.org/wikipedia/commons/5/57/React.js_logo.svg
    :alt: React
    :height: 100px
    :width: 100px

.. image:: http://reactivex.io/assets/Rx_Logo_S.png
    :alt: Rx
    :height: 100px
    :width: 100px

React Rally 2015-08

Seth House @whiteinge

.. container:: note

    Abstract

    Facebook's React and reactive-style programming mesh quite well and have
    similar philosophies. Unidirectional data flow, state tracking over time,
    and inter-component messaging are just part of the story. This presentation
    explores ways to pair React with the popular RxJS library. We will explore
    the various pieces of the Flux recommendation and how closely each one maps
    to pieces from common reactive programming patterns. We will also explore
    pairings with some of the Flux reimaginings, namely Reflux and Redux.

    This is an elevator pitch for reactive-style programming, React, and a
    functional mindset using real and practical examples. It is not an in-depth
    introduction to reactive programming but will end with resources and advice
    for where to continue the journey.


.. class:: frame

Observables
===========

* A unified API for async operations:

  * DOM events.
  * Ajax.
  * SSE & websockets.
  * setInterval.

* A stream of events.

.. class:: note

    `Possibly slated for inclusion (in some form) to ES2016. <https://youtu.be/-vPFP-2Mkl8?t=22m58s>`__

.. class:: frame

Why React? |react|
==================

* Performant & simple API.
* Functional friendly.
* Mostly declarative.
* Flux.


.. class:: frame

Why Reactive Extensions? |rx|
=============================

* Performant & mature API.
* Functional.
* Declarative.


.. class:: frame

Observers
=========

Make an observer (if you're a library author):

.. code:: javascript

    var Rx = require('rx');

    var myobsv = Rx.Observer.create(
        (x) => console.log('onNext', x),
        (err) => console.log('onError', err),
        () => console.log('onCompleted'));

    myobsv.onNext(1);
    myobsv.onNext(2);
    myobsv.onCompleted();


.. class:: frame

Observers
=========

Get a pre-made observer (if you're everyone else):

.. code:: javascript

    var myelem = document.querySelector('someel.myelem');
    var clicks = Rx.Observable.fromEvent(myelem, 'click')


.. class:: frame

Observers
=========

Pre-made observers for everything:

.. code:: javascript

    Rx.Observable.from(...)
    Rx.Observable.fromEvent(...)
    Rx.Observable.fromEventPattern(...)
    Rx.Observable.fromCallback(...)
    Rx.Observable.fromNodeCallback(...)
    Rx.Observable.fromPromise(...)
    Rx.Observable.generate(...)
    Rx.Observable.generateWithAbsoluteTime(...)
    Rx.Observable.generateWithRelativeTime(...)


.. class:: frame

Observables
===========

“Think of an Observable as an asynchronous immutable array.”

.. code:: javascript

    var mysubscription = myobsv.subscribe(
        (x) => console.log('onNext', x),
        (err) => console.log('onError', err),
        () => console.log('onCompleted'));

.. class:: note

    https://medium.com/@andrestaltz/2-minute-introduction-to-rx-24c8ca793877 


.. class:: frame

Observables
===========

Stop Listening:

.. code:: javascript

    mysubscription.dispose();


.. class:: frame

Observables
===========

Stop Listening Automatically

.. code:: javascript

    var myelem = document.querySelector('someel.myelem');
    var clicks = Rx.Observable
        .fromEvent(myelem, 'clicks')
        .take(1);

.. class:: note

    Subscriptions do not need to be disposed if the source completes. You may
    dispose the subscription if you wish to stop listening _before_ the source
    is exhausted. It's more common to dispose of subscriptions by using an
    operator that terminates the subscription as part of its design like Take,
    TakeWhile, TakeUntil.


.. class:: frame

Observable Methods
==================

* Filtering (``filter``)
* Transforming (``map``, ``reduce``, ``flatMap``)
* Collecting (``scan``)
* Buffering (``buffer``, ``bufferWithCount``, ``bufferWithTime``, ``sample``,
  ``debounce``)
* Combining (``merge``, ``concat``, ``combineLatest``)


.. class:: frame

Ajax Events
===========

Fetching usernames from GitHub:

.. code:: javascript

    var github_users = Rx.DOM.ajax({
            method: 'GET',
            url: 'https://api.github.com/users'});
        .filter(x => x.status === 200)
        .map(JSON.parse)
        // Cache the deserialized response.
        .shareReplay(1)
        // Explode items in JSON response into stream items.
        .flatMap(x => Rx.Observable.from(x));

    var usernames_list = github_users
        .pluck('login')
        .subscribe(x => console.log('GitHub user:', x));


.. class:: frame

Merge Ajax Events with DOM Events
=================================

Combine users with click events:

.. code:: javascript

    var clicks = Rx.DOM.click(document.querySelector('#thelink'));

    // Combine each click with a user.
    clicks.zip(usernames_list, (click, user) => user)
        // When the list is exhausted the event handler is removed.
        .subscribe(x => console.log('GitHub user:', x));

A unified API for async operations.


.. class:: frame

Merge Multiple Ajax Requests
============================

How do you want to combine the results?

* Output each response as soon as it comes in? (``merge``)
* Output each response in the same order as the request? (``concat``)
* Wait for both to complete and combine them? (``zip`` & ``flatMap``)


.. class:: frame

Flux |flux|
===========

A code organization pattern:

* Unidirectional data flow.
* Immutable data structures are helpful.
* State lives in predictable places.

.. image:: https://facebook.github.io/flux/img/flux-simple-f8-diagram-1300w.png
    :alt: Unidirectional data flow

.. class:: note

    Flux and FRP are syntactically different but semantically nearly identical.

.. class:: frame

Flux Variants
=============

.. container:: bigger

    Alt, Barracks, Delorean, disto, fluce, fluctuations, Flummox, Flux, Flux
    This, Fluxette, Fluxible, Fluxxor, Fluxy, Lux, Marty.js, MartyJS, Material
    Flux, McFly, microcosm, microflux, mmox, Nuclear.js, NuclearJS,
    OmniscientJS, Reducer, Redux, Reflux

.. container:: note

    `How Reflux stores and actions can be observables.`__

    .. __: http://spoike.ghost.io/refluxjs-0-1-8/


.. class:: frame

Variations on a theme
=====================

* Often kill / hide dispatcher.
* Reduce boilerplate.
* Async helpers.

.. class:: note

    Dan Abramov's `The Evolution of Flux Frameworks`__ is a very succinct
    overview of the state of Flux variants.

    .. __: https://medium.com/@dan_abramov/the-evolution-of-flux-frameworks-6c16ad26bb31

    `Stateless Stores`__ is a reoccuring theme in next-gen Flux variants.
    Stores can be a reduce operation over time – pure functions, easily
    testable.

    .. __: https://blog.javascripting.com/2015/06/19/flux-no-more-stores-meet-reducer/

    `The value held by the store is the result of a reduce operation over
    the list of all actions that have been dispatched. Also easy to record and
    replay to diagnose bugs.`__

    .. __: https://github.com/fdecampredon/rx-flux/issues/10

    `Why a central dispatcher is useful and shouldn't be avoided.`__

    .. __: https://speakerdeck.com/jmorrell/jsconf-uy-flux-those-who-forget-the-past-dot-dot-dot-1


.. class:: frame

Rx |rx|
=======

Shares the Flux philosophy:

* Unidirectional data flow.
* "Immutable" data structures.
* Minimization of state tracking.

.. container:: note

    Props are ok. Avoid setState(). Absolutely everything goes through the
    dispatcher.

    Influenced by `What if the user was a Function`__ by Andre Staltz.

    .. __: https://www.youtube.com/watch?v=1zj7M1LnJV4


.. class:: frame

Dispatcher
==========

Push messages to subscribers; receive messages from elsewhere:

.. code:: javascript

    var Dispatcher = new Rx.Subject();


.. class:: frame

Dispatcher
==========

Example message:

.. code:: javascript

    {
         channel: MY_MODULE,
         type: act.SOME_ACTION,
         data: {extraData: 'important'},
         args: [DOMEvent],
    }


.. class:: frame

Store
=====

Subscribe only to certain channels:

.. code:: javascript

    var myStore = Dispatcher
        .filter(x => x.channel === channels.MY_MODULE);


.. class:: frame

Store
=====

*Manage* state; don't store state.

.. code:: javascript

    var myAjax = myStore
        .startWith({type: act.REFRESH})
        .filter(x => x.type === act.REFRESH)
        .flatMap(() => Rx.DOM.get('/some/url'))
        .shareReplay(1);

    var myAjaxSummarized = myAjax
        .pluck('subdata')
        .map(x => {x.someval.toLower(); return x})
        .map(summarizeData);


.. class:: frame

Store
=====

Accumulate values over time:

.. code:: javascript

    var clickCounter = myStore
        .filter(x => x.type === act.CLICK)
        .scan((acc, x) => { acc += 1; return acc }, 0);


.. class:: frame

Store
=====

Combine multiple stores:

.. code:: javascript

    import {otherStore} from 'related/module';

    var combinedStore = myStore
        .combineLatest(otherStore, (x, y) => ({x, y}));


.. class:: frame

View
====

Just another transformation step in the stream.

.. code:: javascript

    var app = myAjaxSummarized
        .map(function(summaryData) {
            return (
                <h3 onClick={(ev) => {Dispatcher.onNext({
                    channel: channels.MY_MODULE,
                    type: act.REFRESH,
                })}}>Refresh</h3>

                <ul>
                    {summaryData.map(x => <li>x</li>)}
                </ul>
            );

Push messages back into the Dispatcher. (Constants / action creators.)

.. container:: note

    For idiomatic React the onNext() method can be used as a regular
    React-style component/element callback that will push events into the
    dispatcher. A helper function can be syntactic sugar. Actions can be inline
    or in a separate module using constants.


.. class:: frame

Helpers
=======

Enforce an interface with a helper function.

.. code:: javascript

    function sendMsg(channel, action, data = {}) {
        return function(...args) {
            var msg = {channel, action, data, args};
            return Dispatcher.onNext(msg);
        };
    }

Reduce repetition with currying.

.. code:: javascript

    const send = _.curry(sendMsg, channels.MY_MODULE, 2);

    <h3 onClick={
        send(type.REFRESH, {extraData: 'important'})
    }>Refresh</h3>


.. class:: frame

Side-effects
============

Rendering to the DOM is a one-way side-effect.

.. code:: javascript

    app.subscribe(function(content) {
        React.render(
            React.createElement('div', content), 
            document.querySelector('#content'));
    });


.. class:: frame

More side-effects
=================

Log the dispatcher:

.. code:: javascript

    Dispatcher.subscribe(function(event) {
        console.log('Dispatching event', event);
    });


.. class:: frame

And more side-effects
=====================

Upload analytics information:

.. code:: javascript

    Dispatcher
        .map(formatAndFilterData)
        .bufferWithTimeOrCount(300, 100)
        .subscribe(
            uploadAnalyticsData,
            uploadAnalyticsErrors);


.. class:: frame

Even more side-effects
======================

Record the dispatcher:

.. code:: javascript

    Dispatcher
        .takeLast(100)
        .subscribe(writeRecording);

    // => [
    //  {type: act.AUTOCOMPLETE, data: {text: 's'}},
    //  {type: act.AUTOCOMPLETE, data: {text: 'se'}},
    //  {type: act.AUTOCOMPLETE, data: {text: 'sea'}},
    //  {type: act.AUTOCOMPLETE, data: {text: 'sear'}},
    //  {type: act.AUTOCOMPLETE, data: {text: 'searc'}},
    //  ...
    // ]


.. class:: frame

Even more side-effects
======================

Play back the recording:

.. code:: javascript

    var recording = readRecording();
    var tgtGroupStore = Rx.Observable
        .from(recording)
        .zip(Rx.Observable.interval(500), x => x);


.. class:: frame

Resources
=========

Slides: https://github.com/whiteinge/presentations

* `The big list of Rx methods <https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md>`__
* `The Rx Decision Tree <http://reactivex.io/documentation/operators.html#connectable>`__
* `Netflix's introduction to map/filter/reduce/etc <http://reactivex.io/documentation/operators.html>`__
* `RxMarbles <http://rxmarbles.com/>`__

.. container:: note

    More resources:

    * `Intro to reactive programming you've been missing <https://gist.github.com/staltz/868e7e9bc2a7b8c1f754>`__
    * `Simple hands-on, plain-English kind of intro <https://www.youtube.com/watch?v=2btEt0W7UxU>`__
    * Anything by Jafar Husain of Netflix; many presentations on YouTube.

    Interactive vs reactive. Interactive exposes functions so others can change it;
    "Someone else is responsible for me." Reactive listens to events and
    exposes events that can be listened to by others; "I am in full control of
    myself."
    http://staltz.com/dont-react/#/
    https://www.youtube.com/watch?v=9QObt0SGriI&feature=youtu.be
    https://news.ycombinator.com/item?id=8819422
    http://futurice.com/blog/reactive-mvc-and-the-virtual-dom

    Difference between reactive programming and full FRP.
    https://www.youtube.com/watch?v=Agu6jipKfYw
    Or this (simpler): https://twitter.com/andrestaltz/status/607856091192545280
