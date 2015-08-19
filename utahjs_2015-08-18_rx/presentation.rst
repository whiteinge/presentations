====
RxJS
====

.. rubric:: A (practical) introduction to RxJS

.. image:: http://reactivex.io/assets/Rx_Logo_S.png
    :alt: Rx

Utah JS North – 2015-08-18

Seth House @whiteinge

.. class:: frame

Unified API for Async Operations
================================

* DOM Events
* Ajax Events
* Server-sent Events
* Websockets
* setInterval
* Service Workers
* jQuery events, Node streams, etc.

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

Get an observer:

.. code:: javascript

    var myelem = document.querySelector('someel.myelem');
    var keyups = Rx.Observable.fromEvent(myelem, 'keyup')

.. class:: frame

Observers
=========

Get an observer from anything:

.. code:: javascript

    Rx.Observable.from(...)
    Rx.Observable.fromCallback(...)
    Rx.Observable.fromEvent(...)
    Rx.Observable.fromEventPattern(...)
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
    var keyups = Rx.Observable
        .fromEvent(myelem, 'keyup')
        .take(1);

.. class:: frame

Observable Methods
==================

* Filtering (``filter``)
* Transforming (``map``, ``reduce``)
* Collecting (``scan``)
* Buffering (``takeLast(10)``)
* Combining (``merge``, ``concat``, ``combineLatest``, ``flatMap``)

.. class:: frame

DOM Events
==========

Close a modal:

.. code:: javascript

    var keysource = Rx.dom.keydown(window)
        .pluck('keycode')
        .filter(x => x === 27); // escape key

    var clicksource = Rx.dom.click(window)
        .skip(1) // ignore first click that opens the modal
        .filter(ev =>
            document.querySelector(this).contains(ev.target));

    keysource.merge(clicksource)
        .take(1)
        .subscribe(closeModal);

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

.. class:: frame

Merge Two Ajax Requests
=======================

How do you want to combine the results?

* Output each response as soon as it comes in?
* Output each response in the same order as the request?
* Wait for both to complete and combine them?

.. class:: frame

Merge Two Ajax Requests
=======================

.. code:: javascript

    var combinedResponse = Rx
        .flatMap(function() {
            var request1 = Rx.dom.get('/url1');
            var request2 = Rx.dom.get('/url2');

            return request1.zip(request2, function(response1, response2) {
                // Manually combine responses here...
            });
        });

.. class:: frame

Side-effects
============

Useful for debugging:

.. code:: javascript

    myobsrv
        .filter(x => x.someAttr)
        .do(x => console.log('Passed the filter: ', x))
        .map(doSomethingWithSomeAttr)
        .do(x => console.log('Current value of x: ', x));

.. class:: frame

Resources
=========

* `The big list of Rx methods <https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md>`_
* `The Rx Decision Tree <http://reactivex.io/documentation/operators.html#connectable>`_
* `Netflix's introduction to map/filter/reduce/etc
  <http://reactivex.io/documentation/operators.html>`_
