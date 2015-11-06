===========
h() Wrapper
===========

``h()`` wrapper


.. class:: frame

virtual-hyperscript
===================

`A DSL for creating virtual trees <https://github.com/Matt-Esch/virtual-dom/tree/master/virtual-hyperscript>`__


.. class:: frame

Many Implementations
====================

* Ours: https://gist.github.com/whiteinge/02a4868ff91aeacf3b99
* react-hyperscript: https://github.com/mlmorg/react-hyperscript
* r-dom: https://github.com/uber/r-dom
* Or, maybe: ``var h = React.createElement.bind(React);``


.. class:: frame

Compare and Contrast w/ JSX
===========================

.. code:: javascript

    return (
        <ul>
            <li>foo</li>
            <li>bar</li>
        </ul>
    );

    // vs

    return (
        h('ul', [
            h('li', 'foo'),
            h('li', 'bar'),
        ])
    );


.. class:: frame

``React.createElement()``
=========================

.. code:: javascript

    // React.createElement('element', {attributes}, [children]);

    React.createElement('ul', {
        className: 'someclass',
    }, [
        React.createElement('li', null, ['foo']),
    ]);


.. class:: frame

``h()`` is a shortcut
=====================

.. code:: javascript

    React.createElement('ul', {
        className: 'someclass',
    }, [
        React.createElement('li', null, ['foo']),
    ]);

    // vs.

    h('ul.someclass', [
        h('li', 'foo'),
    ]);


.. class:: frame

Indent ``h()`` exactly like with HTML
=====================================

.. code:: javascript

    <div>
        <ul>
            <li>foo</li>
            <li>bar</li>
        </ul>
        <p>Para Stuff</p>
    </div>

    // and

    h('div', [
        h('ul', [
            h('li', 'foo'),
            h('li', 'bar'),
        ]),
        h('p', 'Para stuff'),
    ]);


.. class:: frame

Add ``id`` and ``class`` inline
===============================

.. code:: javascript

    <div id="foo" class="bar">Foo</div>

    // vs.

    h('div#foo.bar', 'Foo');


.. class:: frame

Use custom HTML attributes like with HTML
=========================================

.. code:: javascript

    <div
            foo="Foo"
            bar="Bar"
            baz="Baz"
        >
        Content here.
    </div>

    // and

    h('div', {
            foo: 'Foo',
            bar: 'Bar',
            baz: 'Baz',
        },
        'Content here.');


.. class:: frame

But ``h()`` is JavaScript
=========================

.. code:: javascript

    h('ul', arrayOfStuff.map(x => h('li', x)));

    // and

    h('table.ss-table', [
        h('thead',
            h('tr', visibleGrains.map(x =>
                h('th.search-header', searchHeader(x))))),

        h('tbody', grains.map(mgrains =>
            h('tr', mgrains.map(gval =>
                h('td', gval))))),
        ]);


.. class:: frame

Use JavaScript variables with ``h()``
=====================================

.. code:: javascript

    var color = 'red';

    h('p', {
        className: color,
    }, 'I am red.');


Watch out for JavaScript reserved words.


.. class:: frame

Use ``h()`` with React Components
=================================

.. code:: javascript

    import {MyComponent} from './components';

    h(MyComponent, {props: 'here'});


.. class:: frame

Components
==========

* Complex.
* Verbose.
* Stateful.
* Great for encapsulating *private* state or making advanced use of lifecycle
  methods.


.. class:: frame

Components
==========

.. code:: javascript

    // Creation
    var MyComponent = React.createClass({
        propTypes: {
            ...,
        },
        function lifecycleStuffs() {
            ...,
        },
        function someHelperMethod() {
            ...,
        },
        function render() {
            return h('p', 'stuff');
        },
    });


.. class:: frame

Stateless functional components
===============================

.. code:: javascript

    var MyComponent = function(props) {
        return h('p', 'A component!');
    };

    h(MyComponent);


.. class:: frame

And don't overlook the humble function
======================================

.. code:: javascript

    var assembleAWhole = function(part1, part2) {
        return h('div', [
            part1,
            part2,
        ]);
    };

    // example

    var foo = h('p', 'foo');
    var bar = h('p', 'bar');
    var vtreeMarkup = assembleAWhole(foo, bar);


.. class:: frame

Escalate to more complexity as needed
=====================================

* Do you need to...

  * Output straightforward, possibly nested markup?  ``h()``
  * Combine different bits of markup, possibly dynamically?  ``function``
  * Want a reusable HTML element? ``Stateless function component``
  * Want to abstract away complicated markup behind a callable interface?
    ``Stateless function component``, or ``function``.
  * Need internal state tracking or lifecycle hooks? ``component``
