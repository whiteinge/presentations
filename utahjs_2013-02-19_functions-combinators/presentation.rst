====================================================
Functions, combinators, and decorators in JavaScript
====================================================

:Organization: Utah JS
:Author: Seth House <seth@eseth.com>
:Date: 2013-02-19

A review of JavaScript Allongé
==============================

.. raw:: latex

    {
    \usebackgroundtemplate{
        \vbox to \paperheight{\vfil\hbox to \paperwidth{\hfil
        \includegraphics[height=\paperheight]{bookpage.jpg}
        \hfil}\vfil}
    }
    \begin{frame}[plain]
    \end{frame}
    }

Reginald Braithwaite
--------------------

.. container:: r2b-note

    Helped review the "Working with Functions" chapter of Effective JavaScript.

* https://github.com/raganwald
* http://allong.es/

Thinking functionally
=====================

The creation of small functions that compose with each other.

JavaScript Allongé in a nutshell
--------------------------------

Learn when it’s appropriate to write:

.. code-block:: javascript

    return splat(maybe(get('name')))(customerList);

Instead of:

.. code-block:: javascript

    return customerList.map(function (customer) {
        if (customer) {
            return customer.name
        }
    });

As Little As Possible About Functions, But No Less
--------------------------------------------------

* Identities
* Applying
* Returns
* Call by value, call by reference
* Closures, scope, & environments

Let
---

.. container:: r2b-note

    * Values vs. expressions.
    * Values & identity vs. reference types


What if you didn't have variable assignment?::

    function (diameter) {
        return diameter * Pi
    }

Let
---

Wrap within a function that takes an argument with the name you want::

    (function (Pi) {
        return function (diameter) {
            return diameter * Pi
        }
    })(3.14159265)

Let
---

.. container:: r2b-note

    Both main branches of Lisp today define a special construct called “let.”
    One, Scheme, uses define-syntax to rewrite let into an immediately invoked
    function expression that binds arguments to values as shown above.

“Let” is using an IIFE binds values to names::

    (function (Pi) {
        return function (diameter) {
            return diameter * Pi
        }
    })(3.14159265)(2)
    //=> 6.2831853

Pure functions
--------------

.. container:: r2b-note

    Closures
        Functions containing one or more free variables

* No side-effects
* It operates on its input and returns output
* No effect on other objects or states
* Contains no free variables

Function composition
====================

.. container:: r2b-note

    A decorator is a specialized combinator.

Combinators
    Higher-order pure functions that take only functions as arguments and
    return a function.

Why composition?
----------------

.. container:: r2b-note

    Whenever you are chaining two or more functions together, you’re composing them.

Chaining two or more functions together:

.. code-block:: javascript

    function cookAndEat (food) {
        return eat(cook(food))
    }

Generalized:

.. code-block:: javascript

    function compose (a, b) {
        return function (c) {
            return a(b(c))
        }
    }

    var cookAndEat = compose(eat, cook);

The for-loop
------------

.. code-block:: javascript

    var fruit = [' orange ', ' apple ', ' pear '];

    var result = [];

    for (var i = 0; i < fruit.length; i++) {
        result.push(fruit[i].trim());
    }

The map
-------

.. code-block:: javascript

    var fruit = [' orange ', ' apple ', ' pear '];

    var result = fruit.map(function(val) {
        return val.trim();
    });

The composition
---------------

.. container:: r2b-note

    Extract a method on an object into a standalone function::

        function globalize(methodName) {
            return function(obj) {
                return obj[methodName]();
            };
        }

.. code-block:: javascript

    var fruit = [' orange ', ' apple ', ' pear '];

    var result = fruit.map(globalize('trim'));

The “second argument” to array-extras
-------------------------------------

.. container:: r2b-note

    http://net.tutsplus.com/tutorials/javascript-ajax/what-they-didn't-tell-you-about-es5s-array-extras/

.. code-block:: javascript

    var fruit = [' orange ', ' apple ', ' pear '];

    var result = fruit.map(
        Function.prototype.call, String.prototype.trim);

Composing for map
-----------------

.. container:: r2b-note

    https://github.com/raganwald/homoiconic/blob/master/2013/01/madness.md

.. code-block:: javascript

    ['1', '2', '3'].map(parseFloat);
    //=> [1, 2, 3]

    // HOWEVER:

    ['1', '2', '3'].map(parseInt);
    //=> [ 1, NaN, NaN ]

.. code-block:: javascript

    ['1', '2', '3'].map(applyLast(parseInt, 10));

Function decomposition
======================

One function per task; splitting a function in two; extracting sub-functions

Partial application
-------------------

.. container:: r2b-note

    Splits the application of a function into two pieces, one of which we apply
    now with an argument, and one of which we can apply elsewhere and later
    with the remaining argument(s).

    Partial application can be thought of as decomposition along the lines of
    the arguments a function takes.

    https://github.com/raganwald/homoiconic/blob/master/2013/01/practical-applications-of-partial-application.md

.. code-block:: javascript

    function xhr(method, path, data, headers) {
        …
    }

.. code-block:: javascript

    var post = applyLeft(xhr, 'POST');

    var get = applyLeft(xhr, 'GET');

Partial application
-------------------

.. code-block:: javascript

    var status = applyLeft(xhr, 'GET', '/status');

    var getJSON = applyRight(xhr, {
                'Accept': 'application/json',
                'Content-Type': 'application/json'})

Maybe
-----

.. code-block:: javascript

    function Model () {};

    Model.prototype.setSomething = maybe(function(value) {
        this.something = value;
    });

Cleaner callbacks with partial application
------------------------------------------

.. container:: r2b-note

    http://danwebb.net/2006/11/3/from-the-archives-cleaner-callbacks-with-partial-application

.. code-block:: javascript

    post('entry/create',
        postFormAndUpdate('formname', 'mydiv'));

Currying
--------

.. container:: r2b-note

    Like recursion with Fibinacci and OOO with talking animals, currying is one
    of those concepts that always comes with a contrived example that is
    useless in the real-world.

Extract single-argument functions out of a multi-argument function.

.. code-block:: javascript

    add('sum', 5, 6)

Becomes:

.. code-block:: javascript

    addCurried('sum')(6)(5)

Currying
--------

.. container:: r2b-note

    http://javascriptweblog.wordpress.com/2010/10/25/understanding-javascript-closures/

.. code-block:: javascript

    function converter(toUnit, factor, offset, input) {
        …
    }

    var milesToKm = converter.curry(
        'km', 1.60936, undefined);
    var poundsToKg = converter.curry(
        'kg', 0.45460, undefined);
    var farenheitToCelsius = converter.curry(
        'degrees C', 0.5556, -32);

    milesToKm(10);            //=> 16.09 km
    poundsToKg(2.5);          //=> 1.14 kg
    farenheitToCelsius(98);   //=> 36.67 degrees C

Currying
--------

.. container:: r2b-note

    "Configure" a function
    http://www.reddit.com/r/programming/comments/181y2a/what_is_the_advantage_of_currying/c8bacgs

.. code-block:: javascript

    function logError(message, inDevmode) {
        if (inDevmode) console.error(message);
    }

    function makeLogger(inDevmode) {
        return function (err) {
            return logError(err.message || err.toString(),
                inDevmode);
        };
    }

    window.onerror = makeLogger(true);

Decorators
==========

Decorators

Decorators
----------

Takes one function as an argument, returns another function, and the returned
function is a variation of the argument function.

Example
-------

.. code-block:: javascript

    function Todo (name) {
        …
    };

    Todo.prototype.do = fluent(function () {
        this.done = true;
    });

    Todo.prototype.undo = fluent(function () {
        this.done = false;
    });

Common decorators
-----------------

AKA “advice”, AKA aspect oriented programming, AKA Lisp Flavors

* before
* after
* around
* provided

Common decorators
-----------------

.. code-block:: javascript

    function SomeModel(name) {
        …
    };

    SomeModel.prototype.delete = isAdmin(user, function () {
        this.delete();
    });

Further reading
===============

.. raw:: latex

    {
    \usebackgroundtemplate{
        \hbox to \paperheight{\hfil\vbox to \paperheight{\vfil
        \includegraphics[width=\paperwidth]{how-we-learned.png}
        \vfil}\hfil}
    }
    \begin{frame}[plain]
    \end{frame}
    }

Angus Croll
-----------

    “Some developers like rulebooks and boilerplate—which is why we have Java.
    The joy of JavaScript is rooted in its lack of rigity and the infinite
    possibilities that this allows for.”

    — Angus Croll

.. container:: r2b-note

    * https://speakerdeck.com/anguscroll/how-we-learned-to-stop-worrying-and-love-javascript
    * http://javascriptweblog.wordpress.com/2011/05/31/a-fresh-look-at-javascript-mixins/

Functional mixins
-----------------

* https://github.com/raganwald/method-combinators
* https://github.com/PuerkitoBio/advice
* https://github.com/twitter/flight/

Functional mixins
-----------------

.. code-block:: javascript

    function() {
        function withDrama() {
            this.before('announce', function() {
                clearThroat();
            });

            this.after('leaving', function() {
                slamDoor();
            });
        }

        return withDrama;
    }

Functional reactive programming (FRP)
-------------------------------------

.. container:: r2b-note

    For when you want to concisely listen for when a user is holding both the
    spacebar and F key, while tapping the Q key once every three seconds, but
    only on the second Thursday of the month and only between the hours of 3:00
    and 3:15.

* Bacon.js
* Demo: http://raimohanska.github.com/bacon.js-slides/
