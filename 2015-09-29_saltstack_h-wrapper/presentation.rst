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

.. code:: javascript

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

    h('ul.someclass', [
        h('li', 'foo'),
    ]);


.. class:: frame

Pretend ``h()`` is HTML
=======================

* Indent the *same way* you would with HTML.


.. class:: frame

.. code:: javascript

    <div>
        <ul>
            <li>foo</li>
            <li>bar</li>
        </ul>

        <span>Span Stuff</span>
        <span>More span Stuff</span>
    </div>

.. code:: javascript

    h('div', [
        h('ul', [
            h('li', 'foo'),
            h('li', 'bar'),
        ]),
        h('span', 'Span stuff'),
        h('span', 'More span stuff'),
    ]);


.. class:: frame

.. code:: javascript

    <div foo='Foo'
            bar='Bar'
            baz='Baz'>
         <span class="classone">Span Stuff</span>
         <span class="classtwo">More span Stuff</span>
    </div>

.. code:: javascript

    h('div', {
            foo: 'Foo',
            bar: 'Bar',
            baz: 'Baz',
        }, [
        h('span.classone', 'Span stuff'),
        h('span.classtwo', 'More span stuff'),
    ]);
