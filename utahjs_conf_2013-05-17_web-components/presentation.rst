==============
Web Components
==============

:Organization: Utah JS Conf 2013
:Author: Seth House <seth@eseth.com>
:Date: 2013-05-17

.. include:: /home/shouse/src/presentations/beamerdefs.txt

-------------
What's coming
-------------

An overview
===========

Slide notes
-----------

.. container:: r2b-note

    Each of these topics could be its own 50-minute presentation. Please review
    the copious slide notes for more reading.

`https://github.com/whiteinge/presentations`__

.. __: https://github.com/whiteinge/presentations/tree/master/utahjs_conf_2013-05-17_web-components

What are web components
-----------------------

.. container:: r2b-note

    Overloaded term (like HTML5) comprised of features defined in the
    in-progress web components specification in addition to a few extras.

    ``<element>`` / ``document.register()``
        Define custom HTML elements; extend the HTML vocabulary.
    Shadow DOM
        Encapsulated, self-contained DOM segments
    ``<template>``
        Define inert templates using existing HTML, CSS, JavaScript tooling.
    MutationObserver
        React to granular DOM changes.
    ``Object.observe()``
        React to changes to POJO (plain ol' JavaScript objects).

    **Resources**

    Web components spec : https://dvcs.w3.org/hg/webcomponents/raw-file/tip/explainer/index.html
        The official in-progress specification.

    <web>components</web> : http://www.webcomponentsshift.com/
        Fantastic and comprehensive presentation by Eric Bidelman of the Google
        Chrome team on all aspects of web components.

        This presentation has seen a few iterations. The most recent was at
        Google IO: https://www.youtube.com/watch?v=FDEMA6OhvGo#t=8505s

        Older version of the above presentation:
            * Slides: http://html5-demos.appspot.com/static/webcomponents/index.html
            * Video: http://www.youtube.com/watch?v=eJZx9c6YL8k

    **Other resources**

    HTML5 Demos
        http://html5-demos.appspot.com/

        Demo and more information on web components and many other HTML5
        features.

    Chromium web components resources : http://www.chromium.org/blink/web-components
        A collection of links by the Chromium team.

    Eric Bidelman : https://github.com/ebidel

        Google engineer; heavily involved in Polymer, html5rocks.com, more

* ``<element>`` / ``document.register()`` |pause|
* Shadow DOM |pause|
* ``<template>`` |pause|
* MutationObserver |pause|
* ``Object.observe()`` |pause|
* These specs are not yet finalized!

Why are web components exciting?
--------------------------------

* Encapsulation

  * Embeddable widgets

    (social media icons) |pause|

  * Reusable element libs / element frameworks

    (tabs, modals, nav bars, accordions, carousels) |pause|

* Front-end MV* frameworks

  * Model driven views (MDV)

Custom elements
===============

.. container:: r2b-note

    **Other resources**

    Custom elements spec : https://dvcs.w3.org/hg/webcomponents/raw-file/tip/spec/custom/index.html
        The official in-progress specification.

    Good introduction to custom elements by Mozilla : https://hacks.mozilla.org/2013/05/speed-up-app-development-with-x-tag-and-web-components/
        This article covers the X-Tag library in addition to the in-progress
        spec.

``<element>`` / ``document.register()``
---------------------------------------

.. container:: r2b-note

    * Extend the vocabulary of HTML.
    * Regular HTML elements (innerHTML, events, etc)
    * Must contain a dash in the name
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
        <template></template>
        <style></style>
        <script></script>
    </element>

|end_example|

Use anywhere:

|example<| index.html |>|

.. code-block:: html

    <link rel="import" href="x-mybutton.html">
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
        prototype: Object.create(
            window.HTMLButtonElement.prototype),
    });

Add constructor reference
-------------------------

.. container:: r2b-note

    Example::

        var MyButton = document.register('x-mybutton', {
            prototype: Object.create(window.HTMLButtonElement.prototype, {
                explode: {
                    value: function(e) { this.innerHTML = "Boom!" },
                },
            }),
        });

        var b = new MyButton();
        b.innerHTML = 'Detonate';
        b.addEventListener('click', function(e) {
            e.target.explode();
        });
        document.body.appendChild(b);

* Always available via standard ``document.createElement`` |pause|
* Explicitly add element constructor to ``window`` object

|example<| mybutton.html |>|

.. code-block:: html

    <element name="x-mybutton" extends="button"
            constructor="MyButton">
        <script>
            MyButton.prototype = {
                explode: function(e) {
                    this.innerHTML = "Boom!"; },
            };
        </script>
    </element>

|end_example|

Access as a regular element
---------------------------

|example<| index.html |>|

.. code-block:: html

    <link rel="import" href="x-mybutton.html">

    <script>
        var b = new MyButton();
        b.addEventListener('click', function(e) {
            e.target.explode();
        });
        document.body.appendChild(b);
    </script>

|end_example|

Getters / setters
-----------------

.. code-block:: javascript

    document.register('x-mybutton', {
        prototype: Object.create(
                window.HTMLButtonElement.prototype, {
            bar: {
                get: function() { return 'bar' },
            },
        }),
    });

    console.log(
        document.querySelector('x-mybutton').bar);

Lifecycle
---------

|example<| mybutton.html |>|

.. code-block:: html

    <element name="x-mybutton" extends="button">
        <script>
            this.lifecycle({
                created: function() {},
                inserted: function() {},
                removed: function() {},
                attributeChanged: function() {},
            });
        </script>
    </element>

|end_example|

Shadow DOM
==========

.. container:: r2b-note

    An option to show the Shadow DOM exists in current versions of Chrome.

    **Other resources**

    Spec : https://dvcs.w3.org/hg/webcomponents/raw-file/tip/spec/shadow/index.html
        Official in-progress spec.

    Shadow DOM 101 : http://www.html5rocks.com/en/tutorials/webcomponents/shadowdom/
        Good introduction.

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

    * Used to provide a DOM structure. (Then, for example, a templating layer
      could be placed above this such as MDV.)

    **Other resources**

    Spec : https://dvcs.w3.org/hg/webcomponents/raw-file/tip/spec/templates/index.html
        Official in-progress specification.

    HTML's New Template Tag : * http://www.html5rocks.com/en/tutorials/webcomponents/template/
        Good introduction.

``<template>``
--------------

.. container:: r2b-note

    The <div class="email"> element is matched by both the <content
    select="div"> and <content select=".email"> elements.

.. code-block:: html

    <template>
        <img src="" class="avatar">
        <div class="comment"></div>
    </template>

* Clonable blueprint |pause|
* Parsed not rendered (``<script type="text/template">``) |pause|
* Inert until activated

  * Images not loaded, scripts not run, media not played |pause|

* Activated by appending to a DOM node

Example
-------

.. code-block:: html

    <template>
        <content select=".comment"></content>
    </template>

``Object.observe()``
====================

.. container:: r2b-note

      * High-performance data binding
      * Coming in ES7
        — https://twitter.com/BrendanEich/status/248814355980906496

    Spec : http://wiki.ecmascript.org/doku.php?id=harmony:observe
        Official in-progress specification.

    JavaScript Object.observe proposal & ChangeSummary library overview
        Rafael Weinstein
        https://www.youtube.com/watch?v=VO--VXFJnmE

    Respond to change with ``Object.observe()`` : http://updates.html5rocks.com/2012/11/Respond-to-change-with-Object-observe
        Good introduction to ``Object.observe()``.

    Call to action for lib/framework authors : https://plus.google.com/111386188573471152118/posts/6peb6yffyWG
        Rafael Weinstein makes a call to action for library and framework
        authors to dive into Object.observe().

    Difference between ``Object.observe()`` and `Object.watch()`__?
        Object.watch is Mozilla-only and was never on the standards track
        (although a getter/setter polyfill is available).

    .. __: https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/watch

Data binding
------------

* It'll change your religion |pause|
* Watch a POJO (plain ol' JavaScript object) for changes

Why
---

* Update DOM when object changes

  * MDV |pause|

* Persist object to storage backend

  * Current state
  * Changes over time |pause|

* Constraints (computed properties)

Allows good control over ordering
---------------------------------

For example:

1.  Update value
2.  Recalc computed properties
3.  Persist new values

Replaces getters & setters or dirty-checking
--------------------------------------------

* Getters / setters |pause|

  * Performant
  * Either

    * ES5 getters / setters
    * Call functions instead of referencing values |pause|

* Dirty checking |pause|

  * Usually invoked when data *can* change to check if data *did* change
  * Potentially expensive (many fast updates)
  * Usually checks entire object |pause|
  * Angular team benchmarked replacing dirty checking with ``Object.observe()``
    in Chrome Canary

    * Dropped from 40ms to 2ms
    * 20x–40x faster

Example
-------

.. code-block:: javascript

    var myobj = {};
    Object.observe(myobj, function(changes) {
        changes.forEach(function(change) {
            // new, updated, deleted, reconfigured
            change.type;
            // affected object
            change.object;
            // affected property name
            change.name;
            // value of property before the change
            change.oldValue;
        });
    });

    Object.unobserve(el, callback);

ES5 getters/setters
-------------------

* ES5 getters/setters (e.g., computed properties) are not observed

.. code-block:: javascript

    Object.defineOwnProperty(obj, 'val', {
        get: function() { return thing },
        set: function(val) { thing = val },
    });

|pause|

* Not a solvable problem
* You must include this functionality yourself inline or by decorating

MutationObserver
================

.. container:: r2b-note

    * Part of the DOM4 spec.
    * https://developer.mozilla.org/en-US/docs/DOM/MutationObserver

    DOM Mutation Observers & The Mutation Summary Library : http://www.youtube.com/watch?v=eRZ4pO0gVWw
        Presentation by Rafael Weinstein. The Mutation Summary library allows
        for very specific filtering / subscriptions.

What
----

* Triggered by DOM changes

  * Adding removing elements
  * Changing elements
  * Changing element attributes |pause|

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
        childList: true, // child insert/remove
        subtree: true, // observer subtree root at el
        characterData: true, // textContent changes
        attribute: true, // changes to attributes
    });

    observer.disconnect();

Model driven views (MDV)
========================

.. container:: r2b-note

    A general concept and also a specific implementation (now Polymer).

The big picture
---------------

.. container:: r2b-note

    This simple exapmle showcases custom elements (a reusable, encapsulated,
    self-contained widget), methods on custom elements, declaratively adding
    event handlers, and data binding. (Example taken from the Google IO '13
    Polymer presentation.)

* Two-way data binding without any code |pause|

.. code-block:: html

    <polymer-panels
            on-select="panelSelectHandler"
            selected="{{selectedPanelIndex}}">
    </polymer-panels>

Templating and data binding
---------------------------

.. code-block:: html

    <ul id="example">
        <template iterate>
            <li>{{ name }}
            <ul>
                <template iterate="skills">
                    <li></li>
                </template>
            </ul>
            </li>
        </template>
    </ul>

Templating and data binding
---------------------------

.. code-block:: html

    <script>
        document.querySelector('#example').model = [
            {name: 'Sally', skills: ['carpentry']},
            {name: 'Helen', skills: ['weaving', 'omnipotence']}
        ];
    </script>

.. ............................................................................

-----------------
What's usable now
-----------------

.. container:: r2b-note

    Shim
        Code that intercepts an API call to provide a layer of abstraction.
    Polyfill
        Type of shim that enables new/coming functionality in older browsers.

    — http://stackoverflow.com/a/6671015/127816

Frameworks
==========

Angular
-------

* *Not* a polyfill
* ``Object.observe()`` -like data-binding (POJO)
* ``document.register()`` -like custom elements (Directives)
* MDV-like templating

Dart
----

.. container:: r2b-note

    Web UI Package : http://www.dartlang.org/articles/web-ui/
        An introduction to the Web UI package for Dart.

        “Web UI combines the ideas from web components and MDV, adapting them
        to work well with Dart. The package takes advantage of advanced browser
        features when possible, emulating missing features when necessary.”

* http://www.dartlang.org/
* Web components (``<element>``)
* Templates (``<template>``)
* Encapsulation (emulates Shadow DOM)
* Data binding (watchers)
* MDV (DOM templating)

Polymer
-------

.. container:: r2b-note

    * Custom elements

      * Polyfills both the ``<element>`` tag and ``document.register()``

    * Shadow DOM

      * Polyfilled using wrapper elements
      * No CSS encapsulation

    **Other resources**

    Polymer annoucement at Google IO : https://www.youtube.com/watch?v=0g0oOOT86NY
        The live Google IO Polymer announcement.

    2013 style : https://twitter.com/aerotwist/status/285049020685107200
        “You're headed for trouble if all you do is stare in the rear-view
        mirror.”

    https://github.com/toolkitchen/mdv
    https://github.com/toolkitchen/mdv/blob/master/README.md

* http://polymer-project.appspot.com/
* Formerly Toolkitchen; fomerly Toolkitchensink |pause|
* ``platform.js`` (31 KB)

  * Polyfills (shadow DOM, custom elements, mutation observer, MDV)

* ``polymer.js``

  * Web application framework |pause|

* Custom functional elements
* Custom UI widget elements |pause|

* Working with Mozilla to ensure compat between shims
* Browser support: evergreen

X-Tag
-----

.. container:: r2b-note

    **Other resources**

    X-Tags blog : http://x-tags.org/blog
        Informative (but short) overview of the origins of X-Tag and the
        subsequent split into the lib and the polyfill.

* http://x-tags.org/
* https://github.com/x-tag
* Originally a proof-of-concept

  * Begat the true polyfill

Libraries
=========

Mozilla's web-components
------------------------

.. container:: r2b-note

    Uses MutationObserver if supported, falls back to several event listeners
    (IE; buggy) to detect elements added/removed from DOM.

    http://www.broken-links.com/2013/04/10/the-template-element/
    https://gist.github.com/wycats/51c96e3adcdb3a68cbc3#referencing-modules-in-html

* https://github.com/mozilla/web-components
* ``document.register()`` polyfill

  * Lifecycle events
  * Prototypical element inheritance
  * (1.9 KB)

* Browser support: ES5

``Object.observe()``
--------------------

* https://github.com/jdarling/Object.observe

  * Uses polling and getters / setters
  * Can miss very quick changes

* https://github.com/KapIT/observe-shim

  * Requires manually checking for changes (?)

Watch.JS
--------

.. container:: r2b-note

    Although not a polyfill for ``Object.observe()`` it performs the same
    functionality just with a different interface. It is an active and robust
    project.

* *Not* a polyfill for ``Object.observe()`` |pause|
* https://github.com/melanke/Watch.JS
* Automatic getters / setters
* Overrides ``.push()`` etc
* Macro-level dirty-checking
* (1.4 KB)
* Browser support: ES5

DOM-based templating with data binding
--------------------------------------

* Rivets

  * http://rivetsjs.com/
  * Two-way data binding

    * Pluggable backends

  * DOM-based templating
  * (2.3 KB) |pause|

* JS-Bind

  * http://www.js-bind.com/ |pause|
  * (6.9 KB)

* Knockout

  * http://knockoutjs.com/ |pause|

* Many others
