=============================
Program layout best practices
=============================

:Organization: Utah Python User Group
:Author: Seth House <seth@eseth.com>
:Date: 2011-06-09

Packages and modules
====================

Module skeleton
---------------

.. r2b_note::

    PEP8
    http://www.python.org/dev/peps/pep-0008/

    Docstrings:
    http://www.python.org/dev/peps/pep-0257/

    Versions:
    http://www.python.org/dev/peps/pep-0386/

::

    #!/usr/bin/env python
    # coding: utf-8
    """Module docstring"""
    __author__ = 'Mr. Me <me@example.net>'
    __version__ = '1.2.3'
    if __name__=='__main__':
        main()

Module or class?
----------------

.. r2b_note::

    “if you do not exploit hierarchies and relations (and you don't as you have
    no inheritance and no polymorphism) there is very little difference between
    module and class levels”

    — http://www.daa.com.au/pipermail/pygtk/2011-January/019364.html

Namespacing.

Be mindful of the interface
---------------------------

::

    >>> from UserDict import UserDict
    >>> from ConfigParser import ConfigParser
    >>> from pprint import pprint
    >>> from fabric.api import *

Executable code
---------------

.. r2b_note::

    There is no guarantee the code will be executed every time the module is
    imported.

Avoid putting executable statements directly in a module.

Avoid relative imports
----------------------

.. r2b_note::

    http://docs.python.org/faq/programming.html#what-are-the-best-practices-for-using-import-in-a-module

::

    pkg/
        __init__.py
        moduleA.py
        moduleB.py

    # in moduleB
    import moduleA
    
Executing modules as scripts
----------------------------

.. r2b_note::

    This PEP defines semantics for executing any Python module as a script,
    either with the -m command line switch, or by invoking it via
    ``runpy.run_module(modulename)``.

:pep:`338`::

    python -m SimpleHTTPServer

Executing modules as scripts
----------------------------

::

    python -m smtpd -n -c \
            DebuggingServer localhost:1025

    >>> import smtplib
    >>> mailserver = smtplib.SMTP('localhost:1025')
    >>> mailserver.sendmail(
            'me@example.com',
            'you@example.net',
            'O HAI!')

Executing modules as scripts
----------------------------

* ``python -m unittest mymodule``
* ``python -m pdb mymodule``
* ``python -m timeit -s "range(1000)"``

Executing modules as scripts
----------------------------

::

    runpy.run_module()

Executing modules as scripts
----------------------------

::

    devel/
    pkg/
        __init__.py
        moduleA.py
        moduleB.py
        test/
            __init__.py
            test_A.py
            test_B.py

Executing modules as scripts
----------------------------

::

    python -m pkg.test.test_A
    python -m pkg.test.test_B

Django
======

Avoid manage.py
---------------

::

    django-admin.py

Avoid local_settings.py
-----------------------

::

    try:
        from local_settings import *
    except ImportError, exp:
        pass

Use managers
------------

::

    from django.db import models
    class MyModelQuerySets(models.query.QuerySet):
        pass
    class MyModelManager(models.Manager):
        def get_query_set(self):
            return MyModelQuerySets(self.model)
        def __getattr__(self, attr, *args):
            try:
                return getattr(self.__class__,
                        attr, *args)
            except AttributeError:
                return getattr(self.get_query_set(),
                        attr, *args)

Command-line apps
=================

The hashbang
------------

::

    #!/usr/bin/env python

Future-proof your script
------------------------

.. r2b_note::

    “This works because the global __name__ is set to "__main__" when
    evaluating the code in the file invoked on the command line. This has a
    problem, though. It also puts all of those functions and classes into a
    module named "__main__". Sometimes this isn't an issue, but usually it will
    become one.”

    http://jcalderone.livejournal.com/45604.html

::

    if __name__ == '__main__':
        import mymodule
        raise SystemExit(mymodule.main())

    import some.modules

    def main():
        # stuff

Interactive interpreter
-----------------------

.. r2b_note::

    http://www.doughellmann.com/PyMOTW/cmd/
    http://docs.python.org/library/code.html
    http://aspn.activestate.com/ASPN/Cookbook/Python/Recipe/438813/

::

    import cmd
    from code import InteractiveConsole
