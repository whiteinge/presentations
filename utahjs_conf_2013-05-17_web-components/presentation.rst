==============
Web Components
==============

:Organization: Utah JS Conf 2013
:Author: Seth House <seth@eseth.com>
:Date: 2013-05-17

.. include:: /home/shouse/src/presentations/beamerdefs.txt

.. 1.   Create a loose outline of ideas, references, and talking points.
.. 2.   Categorize into: must know, need to know, don't need to know (cut).
.. 3.   Restructure into the following sections:
..
    * Opening. Capture attention; avoid introductions and fluff.
    * Current situation. Establish importance.
    * Recommendation.
    * Benefits. Personalize for the audience.
    * Evidence. Support the recommendation; don't revisit current situation.
    * Summary. Short!
    * Action steps. Specific actions; specific time-frame.

|part<| What's coming |>|

An overview
===========

|frame|
|end_frame|

What are web components
-----------------------

.. container:: r2b-note

    Overloaded term (like HTML5)

    ``<element``
        Define custom HTML elements; extend the HTML vocabulary.
    ``<template>``
        Define inert templates using existing HTML, CSS, JavaScript tooling.
    Shadow DOM
        Encapsulated, self-contained DOM segments
    MutationObserver
        React to granular DOM changes.
    ``Object.observe()``
        React to changes to POJO (plain ol' JavaScript objects).

    Resources

    WIP spec
        https://dvcs.w3.org/hg/webcomponents/raw-file/tip/explainer/index.html
    <web>components</web>
        Presentation by the Google Chrome team

        Slides:
        http://html5-demos.appspot.com/static/webcomponents/

        Video:
        http://www.youtube.com/watch?v=eJZx9c6YL8k

    Other resources

    * http://www.chromium.org/blink/web-components

* ``<element>`` |pause|
* Shadow DOM |pause|
* ``<template>`` |pause|
* MutationObserver |pause|
* ``Object.observe()`` |pause|
* These specs are not yet finalized!

Why are web components exciting?
--------------------------------

* Embeddable widgets

  * Social media buttons |pause|

* Reusable element libs / element frameworks

  * Tabs, modals, nav bars, accordions, carousels, etc |pause|

* Front-end MV* frameworks

  * Model driven views (MDV)

Custom elements
===============

.. container:: r2b-note

    Other resources

    * https://hacks.mozilla.org/2013/05/speed-up-app-development-with-x-tag-and-web-components/

|frame|
|end_frame|

``<element>`` / ``document.register()``
---------------------------------------

.. container:: r2b-note

    * Extend the vocabulary of HTML.
    * Regular HTML elements (innerHTML, events, etc)
    * A declarative renaissance for app development?

* New HTML elements
* Extend existing elements |pause|
* Element lifecycle hooks |pause|
* Import / share external components
* Using standard web techniques

Example: declarative style
--------------------------

Register the element once:

|example<| mybutton.html |>|

.. code-block:: html

    <element name="x-mybutton" extends="button">
        <template>…</template>
        <style>…</style>
        <script>…</script>
    </element>

|end_example|

Use anywhere:

|example<| index.html |>|

.. code-block:: html

    <link rel="import" href="x-mybutton.html">
    […]
    <x-mybutton>Detonate</x-mybutton>

|end_example|

Example: imperative style
-------------------------

.. code-block:: javascript

    document.register('x-mybutton');

Extend existing elements
------------------------

* Create new element object from an element prototype
* Extends ``HTMLElement`` by default

.. code-block:: javascript

    document.register('x-mybutton', {
        prototype: Object.create(window.HTMLButtonElement.prototype),
    });

Add constructor reference
-------------------------

* Always available via standard ``document.createElement``
* Explicitly add element constructor to ``window`` object

|example<| mybutton.html |>|

.. code-block:: html

    <element name="x-mybutton" extends="button" constructor="MyButton">
        <script>
            MyButton.prototype = {
                explode: function(e) { this.innerHTML = "Boom!" },
            };
        </script>
    </element>

|end_example|

|example<| index.html |>|

.. code-block:: html

    <link rel="import" href="x-mybutton.html">
    […]
    <script>
        var b = new MyButton();
        b.addEventListener('click', function(e) { e.target.explode() });
        document.body.appendChild(b);
    </script>

|end_example|

Getters / setters
-----------------

.. code-block:: javascript

    document.register('x-mybutton', {
        prototype: Object.create(window.HTMLButtonElement.prototype, {
            bar: {
                get: function() { return bar || 'bar' },
                set: function(val) { bar = val },
            },
        }),
    });

Lifecycle
---------

|example<| mybutton.html |>|

.. code-block:: html

    <element name="x-mybutton" extends="button">
        <script>
            this.lifecycle({
                created: function() { … },
                inserted: function() { … },
                removed: function() { … },
                attributeChanged: function() { … },
            });
        </script>
    </element>

|end_example|

Shadow DOM
==========

.. container:: r2b-note

    Difficult to polyfill; reqs. browser additions.

    Other resources

    * https://dvcs.w3.org/hg/webcomponents/raw-file/tip/spec/shadow/index.html
    * http://www.html5rocks.com/en/tutorials/webcomponents/shadowdom/

|frame|
|end_frame|

Encapsulation
-------------

* Styles inside a shadow root are scoped
* Styles outside a shadow root don't apply

  * Can opt-in
  * ``resetStyleInheritance``, ``applyAuthorStyle`` |pause|

* Browsers already host hidden DOM

  * Browser-native controls
  * ``<input type="date">``
  * ``<video src="…">``

Creating a shadow DOM
---------------------

.. code-block:: javascript

    var shadow = host.createShadowRoot();
    shadow.innerHTML = "<p>Things</p>";

Template
========

.. container:: r2b-note

    Difficult to polyfill; reqs. browser additions.

    Other resources

    * https://dvcs.w3.org/hg/webcomponents/raw-file/tip/spec/templates/index.html
    * http://www.html5rocks.com/en/tutorials/webcomponents/template/

|frame|
|end_frame|

``<template>``
--------------

* Clonable blueprint |pause|
* Parsed not rendered (``<script type="text/template">``) |pause|
* Inert until activated

  * Images not loaded, scripts not run, media not played |pause|

* Activated by appending to a DOM node

Templating a ``<template>``
---------------------------

.. container:: r2b-note

    The <div class="email"> element is matched by both the <content
    select="div"> and <content select=".email"> elements.

Example
-------

.. code-block:: html

    <element name="my-tabs">
    <template>
        <style>...</style>
        <content select="hgroup:first-child"></content>
    </template>
    </element>

``Object.observe()``
====================

.. container:: r2b-note

      * high-performance data binding
      * Coming in ES7
        — https://twitter.com/BrendanEich/status/248814355980906496

    JavaScript Object.observe proposal & ChangeSummary library overview
        Rafael Weinstein
        https://www.youtube.com/watch?v=VO--VXFJnmE

|frame|
|end_frame|

Why
---

* MDV
* Update DOM when object changes
* Persist object to storage backend

  * Current state
  * Changes history

* Constraints (computed properties)

Ordering
--------

* Good control over ordering
* Update val -> recalc computed properties -> persist new values

Existing
--------

* getters/setters

  * performant
  * requires either

    * ES5 getters/setters
    * Modifying object interface to call functions instead of reference
      properties

* Dirty checking

  * Usually invoked when data *can* change to check if data *did* change
  * potentially expensive
  * checks entire object (?)
  * potential lag (many fast updates)
  * Angular team replaced their dirty checking with Object.observe() experiment
    in Chrome Canary

    * Dropped from 40ms to 2ms
    * 20x–40x faster

Example
-------

.. code-block:: javascript

    Object.observe(myobj, function(changes) {
        changes.forEach(function(change) {
            change.type; // new, updated, deleted, reconfigured
            change.object; // affected object
            change.name; // affected property name
            change.oldValue; // value of property before the change
        });
    });

    Object.unobserve(el, callback);

ES5 getters/setters
-------------------

* ES5 getters/setters (e.g., computed properties) are not observed
* Not a solvable problem
* You must include this functionality yourself inline or by decorating

.. code-block:: javascript

    Object.defineOwnProperty(obj, 'val', {
        get: function() { return thing },
        set: function(val) { thing = val },
    });

ChangeSummary lib
-----------------

* Mention?

MutationObserver
================

.. container:: r2b-note

    * Part of the DOM4 spec.
    * https://developer.mozilla.org/en-US/docs/DOM/MutationObserver

    DOM Mutation Observers & The Mutation Summary Library
        Rafael Weinstein
        http://www.youtube.com/watch?v=eRZ4pO0gVWw

|frame|
|end_frame|

What
----

* Triggered by DOM changes

  * Adding removing elements
  * Changing elements
  * Changing element attributes

* Observer not listener
* Callback triggered at end of DOM changes with list of all changes

Replaces Mutation Events
------------------------

.. container:: r2b-note

    Demo in vid compares each of three methods shuffling a <ul> of a deck of
    cards 2000 times.

    * Mutation events: fired 2000 events
    * Mutation observer: callback fired once with all changes
    * Mutation summary lib: callback fired once, noted only seven cards changed
      place

* Fired too often (fired for each change)
* Slow (event based)
* Deprecated
* Stability problems

Why
---

* Browser extensions

  * Google Voice extension listens for text changes to transform phone number
    patterns into hyperlinks.
  * JS libs enhancing HTML; Dojo implementing a combo box, tough to monitor
    changes after setting it up

* Framework / library authors

Example
-------

.. code-block:: javascript

    var observer = new MutationObserver(function(mutations, observer) {
        mutations.forEach(function(record) {
            record.addedNodes; // nodes
        });
    });

    observer.observe(el, {
        childList: true, // include childnode insertion/removals
        subtree: true, // observer subtree root at el
        characterData: true, // include textContent changes
        attribute: true, // include changes to attributes
    });

    observer.disconnect();

MutationSummary lib
-------------------

* Mention?
* Very specific filtering / subscriptions

Model driven views (MDV)
------------------------

.. container:: r2b-note

    https://code.google.com/p/mdv/

.. code-block:: html

    <div id="example">
    <ul>
        <template iterate>
            <li>{{ name }}
            <ul><template iterate="skills"><li>...</li></template></ul>
            </li>
        </template>
    </ul>
    </div>

    <script>
        document.querySelector('#example').model = [
            {name: 'Sally', skills: ['carpentry']},
            {name: 'Helen', skills: ['weaving', 'omnipotence']}
        ];
    </script>

.. ............................................................................

|part<| What's usable now |>|

Ok, let's do this thing
=======================

.. container:: r2b-note

    Shim
        Code that intercepts an API call to provide a layer of abstraction.
    Polyfill
        Type of shim that enables new/coming functionality in older browsers.

    — http://stackoverflow.com/a/6671015/127816

    MDV

    https://github.com/toolkitchen/mdv
    https://github.com/toolkitchen/mdv/blob/master/README.md

    Object.observe

    Object.observe vs Object.watch vs MutationObserver?
    https://plus.google.com/111386188573471152118/posts/6peb6yffyWG
    http://www.js-bind.com/
    https://github.com/KapIT/observe-shim/
    http://updates.html5rocks.com/2012/11/Respond-to-change-with-Object-observe
    https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/watch    <-- old
    https://github.com/rafaelw/ChangeSummary  <-- dirty checking?
    http://wiki.ecmascript.org/doku.php?id=harmony:observe

    <element>

    http://www.broken-links.com/2013/04/10/the-template-element/
    https://gist.github.com/wycats/51c96e3adcdb3a68cbc3#referencing-modules-in-html
    http://x-tags.org/
    http://polymer-project.appspot.com/ (formerly toolkitchen)

.. container:: r2b-note

    * Angular
    * http://www.dartlang.org/articles/web-ui/
    * Mozilla's X-Tag
    * WatchJS + Rivets
    * Toolkitchen

|frame|
|end_frame|

``document.register()``
=======================

|frame|
|end_frame|

Mozilla's web-components
------------------------

.. container:: r2b-note

    Uses clever hack around CSS hook to detect elements added/removed from DOM.

* https://github.com/mozilla/web-components
* ``document.register()`` polyfill

  * Lifecycle events
  * Prototypical element inheritance

* Browser support: ES5

Mozilla's X-Tag
---------------

.. container:: r2b-note

    Other resources

    * http://x-tags.org/blog

* http://x-tags.org/
* https://github.com/x-tag
* Originally a proof-of-concept

  * Begat the true polyfill

Polymer
-------

.. container:: r2b-note

    “You're headed for trouble if all you do is stare in the rear-view mirror.”

    Other resources

    * https://twitter.com/aerotwist/status/285049020685107200

* http://polymer-project.appspot.com/
* Shims HTML imports (via XHR)
* Shims style namespacing???
* Working with Mozilla to ensure compat between shims
* Browser support: evergreen

``Object.observe()``
====================

|frame|
|end_frame|

Watch.JS
--------

Stuff
