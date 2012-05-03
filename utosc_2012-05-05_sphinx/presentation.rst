=======================================
Sphinx, the Python Documentation System
=======================================

:Organization: Utah Open Source Conference 2011
:Author: Seth House <seth@eseth.com>
:Date: 2012-05-05

.. |rST| replace:: reStructuredText

.. Outline

    * extensions

    * hook points

    * Appendix of output formats and links

|rST| vs. Sphinx
================

.. container:: r2b-note

    The goals of |rST|

        The primary goal of reStructuredText is to define a markup syntax for
        use in Python docstrings and other documentation domains, that is
        readable and simple, yet powerful enough for non-trivial use. The
        intended purpose of the reStructuredText markup is twofold:

        * the establishment of a set of standard conventions allowing the
          expression of structure within plaintext, and
        * the conversion of such documents into useful structured data formats.

        The secondary goal of reStructuredText is to be accepted by the Python
        community [...] as a standard for Python inline documentation [...].

        - http://docutils.sourceforge.net/docs/ref/rst/introduction.html#goals

    The goals of Sphinx

        Extensive cross-references: semantic markup and automatic links for
        functions, classes, glossary terms and similar pieces of information.
        [...] Automatic indices: general index as well as a module index.

        - http://pythonic.pocoo.org/2008/3/21/sphinx-is-released

* `reStructuredText Primer <http://sphinx.pocoo.org/rest.html>`_
* `Sphinx Markup Constructs <http://sphinx.pocoo.org/markup>`_

|rST| `goal #10`__

    Extensible. The markup should provide a simple syntax and interface for
    adding more complex general markup, and custom markup.

.. __: http://docutils.sourceforge.net/docs/ref/rst/introduction.html#goals

Vocabulary: directives
======================

http://docutils.sourceforge.net/docs/ref/rst/directives.html

.. code-block:: rst

    .. name:: arguments
        :options:

        content

    .. figure:: picture.png
        :scale: 50 %
        :alt: map to buried treasure

        This is the caption of the figure
        (a simple paragraph).

Vocabulary: roles
=================

http://docutils.sourceforge.net/docs/ref/rst/roles.html

.. code-block:: rst

    :rolename:`interpreted text`
    `interpreted text`:rolename:

    See :PEP:`287` for more information about
    reStructuredText.

    The area of a circle is
    :math:`A_\text{c} = (\pi/4) d^2`.

Quick Start
===========

.. code-block:: bash

    % sphinx-quickstart

The TOC tree
============

.. container:: r2b-notes

    * All documents must be linked from a TOC tree
    * The master document (``master_doc``) is the root of the TOC tree
      hierarchy
    * sub-TOC tree directives can appear anywhere so long as they're linked
      from another toctree
    * TOC tree directives can be hidden
    * This is not the same as the |rST| ``contents`` directive

.. code-block:: rst

    .. toctree::
        :maxdepth: 2
        :glob:

        intro/*
        strings
        datatypes
        numeric

File organization
=================

.. code-block:: rst

    .. toctree::
        :maxdepth: 1

        majortopic_1/index
        majortopic_2/index
        majortopic_3/index

Cross-referencing documents
===========================

.. code-block:: rst

    * :role:`target`
    * :role:`title <target>`
    * :role:`~parent.child.target`

* Objects (domains)
* Arbitrary locations (``:ref:`` & "reference names")
* Documents (``:doc:`` absolute or relative paths)
* Downloads (``:download:``)
* Index-generating references (``:envvar:``, ``:term:``, ``.. index::``)

Semantic markup
===============

* ``:abbr:``
* ``:command:``
* ``:program:`` & ``:option:``
* ``:file:``
* ``:kbd:`C-x C-f```
* ``:manpage:`ls(1)```
* ``:menuselection:`Start --> Programs```
* ``:samp:`print 1+{variable}```

``conf.py`` tricks
==================

It's Python!

* Version numbers
* `Mocking`__

  .. code-block:: python

    MOCK_MODULES = ['pygtk', 'gtk']
    for mod_name in MOCK_MODULES:
        sys.modules[mod_name] = Mock()

* Environments

  .. code-block:: python

    sys.path.append(os.path.dirname(__file__))
    import settings
    from django.core.management \
            import setup_environ
    setup_environ(settings)

.. __: http://read-the-docs.readthedocs.org/en/latest/faq.html#i-get-import-errors-on-libraries-that-depend-on-c-modules

Extensions
==========

* extlinks

  .. code-block:: rst

    :issue:`384`
    
* intersphinx (``objects.inv``)

  .. code-block:: rst

    :py:class:`zipfile.ZipFile`

autodoc
=======

.. container:: r2b-note

    * modules, classes, exceptions, functions, data, methods, attributes

.. code-block:: rst

    .. automodule:: mypackage.mymodule
        :members:

``autodoc-process-docstring(app, what, name, obj, options, lines)``

Templating
==========

.. code-block:: django

    {% extends "!layout.html" %}
    {%- block rootrellink %}
    <li><a href="{{ pathto('index') }}">
            My home</a>&nbsp;|&nbsp;</li>
    <li><a href="{{ pathto('home') }}">
            Documentation</a> &raquo;</li>
    {%- endblock %}

.. code-block:: python

    html_additional_pages = {
        'index': 'index.html',
        '404': '404.html',
    }

    html_sidebars = { ... }

Extensions
==========

.. code-block:: python

    def setup(app):
        app.add_crossref_type(...)
        app.add_directive(...)
        app.add_role(...)
        app.connect('event_name', handler)
        app.add_config_value(name, default, rebuild)
        app.add_node(node, \
                html=(visit_mynode_html, \
                depart_mynode_html))
        app.add_event(name)
        app.emit(event, *arguments)

.. ** vim syntax fix

Sphinx build events
===================

http://sphinx.pocoo.org/ext/appapi.html#events

* ``builder-inited(app)``
* ``source-read(app, docname, source)``
* ``html-page-context(app, pagename, templatename, context, doctree)``
* ``build-finished(app, exception)``

.. code-block:: python

    app.builder.env
    app.builder.outdir
    app.config
    app.builder.warn("Look out!")

Appendix: |rST| output formats
==============================

* rst2html
* rst2latex
* rst2man
* rst2odt
* rst2s5
* rst2xml

Appendix: Sphinx builders
=========================

* StandaloneHTMLBuilder
* DirectoryHTMLBuilder
* SingleFileHTMLBuilder
* HTMLHelpBuilder (Microsoft CHM)

  * QtHelpBuilder (KDE)
  * DevhelpBuilder (Gnome)

* EpubBuilder
* LaTeXBuilder
* TextBuilder
* ManualPageBuilder
* SerializingHTMLBuilder (pickle, simplejson, phpserialize)
* PickleHTMLBuilder
* JSONHTMLBuilder
* ChangesBuilder (versionadded, versionchanged and deprecated)
* CheckExternalLinksBuilder

Appendix: Other links
=====================

* http://rst2a.com/
* http://docutils.sourceforge.net/docs/user/links.html
