======================
Utah Python User Group
======================
My Favorite Python Gotchas, Tips, and Tricks
--------------------------------------------

:Author: Seth House <seth@eseth.com>
:Date: 2010-05-13

.. include:: <s5defs.txt>


Use an ``else`` clause in ``try-except`` blocks
===============================================

Don’t:

.. class:: tiny

    .. code-block:: python

        try:
            # stuff
            # more stuff
            # stuff that might raise IndexError
            # even more stuff
        except IndexError:
            # do something

Use an ``else`` clause in ``try-except`` blocks
===============================================

Do:

.. class:: tiny

    .. code-block:: python

        try:
            # stuff that might raise IndexError
        except IndexError:
            # do something
        else:
            # stuff
            # more stuff
            # even more stuff


Catch multiple exceptions
=========================

Don't:

.. class:: tiny

    .. code-block:: python

        try:
            # some code
        except SomeException:
            # do stuff
        except OtherException:
            # do stuff

Catch multiple exceptions
=========================

Do:

.. class:: tiny

    .. code-block:: python

        try:
            # some code
        except (SomeException, OtherException):
            # do stuff

Use exception hierarchies
=========================

.. class:: tiny

    BaseException
        +-- httplib.HTTPException
            +-- httplib.NotConnected
            +-- httplib.InvalidURL

Use exception hierarchies
=========================

Never do this:

.. class:: tiny

    .. code-block:: python

        try:
            ...
        except Exception:
            ...

Create custom exceptions to improve readability
===============================================

Don’t:

.. class:: tiny

    .. code-block:: python

        try:
            result = myniftyfunction()
            myotherfunction(result[3])
        except IndexError:
            # do something

Create custom exceptions to improve readability
===============================================

Do:

.. class:: tiny

    .. code-block:: python

        class MyCustomError(Exception):
            """Docstring explaining intended usage."""
            pass

        try:
            result = myniftyfunction()

            if 'something expected' not in result:
                raise MyCustomError()
        except MyCustomError:
            # do something

Do fancy stuff with your exceptions subclasses
==============================================

.. class:: tiny

    .. code-block:: python

        class MyException(Exception):
            """Docstring explaining intended usage."""
            def __init__(self, message, extra_info):
                Exception.__init__(self, message)

                # do stuff with extra_info

        raise MyException("OMG!", importantvariable)


Short-circuit evaluation
========================

Don’t:

.. class:: tiny

    .. code-block:: python

        if a:
            if b:
                if c:
                    # do stuff

Short-circuit evaluation
========================

Do:

.. class:: tiny

    .. code-block:: python

        if a and b and c:
            # do stuff

Chain comparison operators
==========================

Don’t:

.. class:: tiny

    .. code-block:: python

        10 < x and x < 20

Chain comparison operators
==========================

Do:

.. class:: tiny

    .. code-block:: python

        10 < x < 20

Multi-assignment
================

.. class:: tiny

    .. code-block:: python

        def somefunc():
            return True, False, True

        one, two, three = somefunc()

Multi-assignment
================

.. class:: tiny

    .. code-block:: python

        >>> a, b = 4, 5
        >>> a, b = b, a
        >>> a, b
        (5, 4)

Verbose regular expressions
===========================

Don’t:

.. class:: tiny

    .. code-block:: python

        ^M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$

Verbose regular expressions
===========================

Do:

.. class:: tiny

    .. code-block:: python

        pattern = """
            ^                   # beginning of string
            M{0,4}              # thousands - 0 to 4 M's
            (CM|CD|D?C{0,3})    # hundreds - 900 (CM), 400 (CD), 0-300 (0 to 3 C's),
                                #            or 500-800 (D, followed by 0 to 3 C's)
            (XC|XL|L?X{0,3})    # tens - 90 (XC), 40 (XL), 0-30 (0 to 3 X's),
                                #        or 50-80 (L, followed by 0 to 3 X's)
            (IX|IV|V?I{0,3})    # ones - 9 (IX), 4 (IV), 0-3 (0 to 3 I's),
                                #        or 5-8 (V, followed by 0 to 3 I's)
            $                   # end of string
            """

        re.search(pattern, 'M', re.VERBOSE)

C modules
=========

.. class:: tiny

    .. code-block:: python

        try:
            import cPickle
        except ImportError:
            import pickle

        try:
            from xml.etree import cElementTree as etree
        except ImportError:
            from xml.etree import ElementTree as etree

Python imports
==============

1.  Imports are cheap. Python just looks in ``sys.modules``.
2.  You can put imports in functions to reduce start-up time.
3.  Don’t put imports in loops:

    .. code-block:: python

        for num in range(100000):
            doit() # contains an import

How to diagnose circular imports
================================

1.  Source files are read sequentially.
2.  When it arrives at an ``import`` it sequentially reads the imported file.

Fixes:

* Move imports to the end of the file
* Move imports inside a function or method

“Import time” vs “run time”
===========================

Mostly important for long-running Python, such as web processes:

.. class:: tiny

    .. code-block:: python

        from datetime.datetime import now

        def somefunction(curtime=now()):
            print curtime.strftime("%Y-%m-%d")

Calling functions is expensive
==============================

Don’t:

.. class:: tiny

    .. code-block:: python

        for i in list:
            doit()

Calling functions is expensive
==============================

Do:

.. class:: tiny

    .. code-block:: python

        def doit(list):
            for i in list:
                # do it

String concatenation is expensive
=================================

Don’t:

.. class:: tiny

    .. code-block:: python

        "Oh" + "em" + "gee"

String concatenation is expensive
=================================

Do:

.. class:: tiny

    .. code-block:: python

        " ".join(['Oh', 'em', 'gee'])

String interpolation is awesome
===============================

.. class:: tiny

    .. code-block:: python

        person = "Dave"
        pejorative = "dandy"

        "%(person)s is a %(pejorative)s." % locals()

The Python shell is awesome
===========================

* ``help``
* ``dir``
* ``_``

::

    export PYTHONSTARTUP=$HOME/.pythonrc.py

reStructuredText everywhere
===========================

.. class:: incremental

    * One lightweight markup language to rule them all
    * Output formats
    * rst2all
    * Sphinx

pdb is awesome
==============

``$HOME/.pdbrc``
