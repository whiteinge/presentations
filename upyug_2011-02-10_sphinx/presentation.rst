======================
Utah Python User Group
======================
Sphinx: Python Documentation Generator
--------------------------------------

:Author: Seth House <seth@eseth.com>
:Date: 2011-02-10

.. include:: <s5defs.txt>

Background
==========

http://docs.python.org/

reStructuredText
================

.. class:: handout

    “The primary goal of reStructuredText is to define a markup syntax for use
    in Python docstrings and other documentation domains, that is readable and
    simple, yet powerful enough for non-trivial use. The intended purpose of
    the reStructuredText markup is twofold:

    * the establishment of a set of standard conventions allowing the
      expression of structure within plaintext, and
    * the conversion of such documents into useful structured data formats.

    The secondary goal of reStructuredText is to be accepted by the Python
    community (by way of being blessed by PythonLabs and the BDFL [1]) as a
    standard for Python inline documentation (possibly one of several
    standards, to account for taste).”

    — http://docutils.sourceforge.net/docs/ref/rst/introduction.html#goals

http://docutils.sourceforge.net/docs/ref/rst/restructuredtext.html

reStructuredText
================

* rst2html
* rst2latex
* rst2man
* rst2odt
* rst2s5
* rst2xml

reStructuredText
================

* http://rst2a.com/
* http://docutils.sourceforge.net/docs/user/links.html

Docutils
========

.. class:: handout

    By far the most powerful and flexible of the lightweight markup languages.

Parsing and translating suite

Docutils
========

::

                    +---------------------------+
                    |        Docutils:          |
                    | docutils.core.Publisher,  |
                    | docutils.core.publish_*() |
                    +---------------------------+
                    /            |            \
        +--------+       +-------------+       +--------+
        | READER | ----> | TRANSFORMER | ====> | WRITER |
        +--------+       +-------------+       +--------+
            /     \\                                  |
    +-------+   +--------+                        +--------+
    | INPUT |   | PARSER |                        | OUTPUT |
    +-------+   +--------+                        +--------+

Sphinx
======

.. class:: tiny

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

Sphinx
======

.. code-block:: bash

    % sphinx-quickstart

Sphinx
======

Docutils additions: “semantic markup and automatic links for functions,
classes, citations, glossary terms and similar pieces of information”

* Extensive cross-references
* Automatic indices: general index as well as a module index

  * TOC Tree
  * Index
  * Glossary

* Extensions

Domains
=======

* Python
* C
* C++
* JavaScript
* reStructuredText
* Ruby (contrib)
* Erlang (contrib)

https://bitbucket.org/birkenfeld/sphinx-contrib/src

Domains
=======

.. code-block:: rst

    .. py:function:: Timer.repeat([repeat=3[, number=1000000]])

Domains
=======

.. code-block:: rst

    .. js:function:: $.getJSON(href, callback[, errback])

        :param string href: An URI to the location of the resource.
        :param callback: Get's called with the object.
        :param errback:
            Get's called in case the request fails. And a lot of other
            text so we need multiple lines
        :throws SomeError: For whatever reason in that case.
        :returns: Something

HTML templating / theming
=========================

* Jinja
* Themes

Extensions
==========

* Builders
* Domains
* Nodes
* Directives
* Roles
* Crossrefs
* Transforms

Extensions
==========

Core events

http://sphinx.pocoo.org/ext/tutorial.html#build-phases
