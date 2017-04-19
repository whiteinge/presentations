======================
Rx Combining Operators
======================

.. rubric:: Various combination operators explained and compared

.. image:: http://reactivex.io/assets/Rx_Logo_S.png
    :alt: Rx

SaltStack – 2016-06-15

Seth House @whiteinge

.. class:: frame

CombineLatest
=============

* Collects an initial value from two or more observables.
* Thereafter emits whenever any one of them emit.

.. code:: javascript

    Rx.Observable.combineLatest([...obs]);
    Rx.Observable.just('foo').combineLatest(...obs);

.. class:: frame

Create a view-store with combineLatest
======================================

.. code:: javascript

    var Dispatcher = new Rx.Subject();

    var Store1 = Dispatcher.filter(x => x.tag === 'one').pluck('data');
    var Store2 = Dispatcher.filter(x => x.tag === 'two').pluck('data');
    var Store3 = Dispatcher.filter(x => x.tag === 'three')
        .flatMap(({data}) => Rx.Observable.timer(2000).map(data));

    var ViewStore = Rx.Observable.combineLatest([
        Store1,
        Store2,
        Store3,
    ]);

    var sub1 = ViewStore.subscribe(x => console.log('x', x));

.. class:: frame

View renders when view-store emits
==================================

.. code:: javascript

    Dispatcher.onNext({tag: 'one', data: 'One!'});
    // Waiting for the other values.
    Dispatcher.onNext({tag: 'two', data: 'Two!'});
    // Still waiting for the other values.
    Dispatcher.onNext({tag: 'three', data: 'Three (after delay)!'});
    // => x ["One again!", "Two again!", "Three (after delay)!"]

    Dispatcher.onNext({tag: 'one', data: 'One again!'});
    Dispatcher.onNext({tag: 'two', data: 'Two again!'});
