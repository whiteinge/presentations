========
setup.py
========

:Organization: Utah Python User Group
:Author: Seth House <seth@eseth.com>
:Date: 2011-07-11

.. .. container:: r2b-simplecolumns

.. role:: raw-latex(raw)
    :format: latex

Distutils
=========

.. container:: r2b-note

    A Few Corrections To “On Packaging”

        Distribution
            This is something-with-a-setup.py. Usually a distribution will have the
            same name as a package.
        package/module
            This is something you import.
        Setuptools The Distribution
            This is what you install when you install Setuptools.
        setuptools The Package
            This is what you get when you do import setuptools. Setuptools largely
            works by monkeypatching distutils
        pkg_resources The Module
            This is also included in Setuptools The Distribution. […] That provides
            the ability to query what distributions are installed, metadata about
            those distributions, information about the location where they are
            installed

        — http://blog.ianbicking.org/2008/12/14/a-few-corrections-to-on-packaging/

Python distribution utilities (“Distutils”)

setup.py
--------

.. container:: r2b-note

    Python Distribution Utilities (“Distutils”)

        As a developer, your responsibilities (apart from writing solid,
        well-documented and well-tested code, of course!) are:

        * write a setup script (setup.py by convention)
        * (optional) write a setup configuration file
        * create a source distribution
        * (optional) create one or more built (binary) distributions

        — http://docs.python.org/distutils/introduction.html

“If all you want to do is distribute a module called foo, contained in a file
foo.py, then your setup script can be as simple as this:”

.. code-block:: python

    from distutils.core import setup
    setup(name='foo',
        version='1.0',
        py_modules=['foo'])

Or:

.. code-block:: python

    from distutils.core import setup
    setup(name='foomatic',
        version='1.0',
        packages=['foomatic'])

Create a source distribution
----------------------------

.. code-block:: bash

    % python setup.py sdist
    % tar tf ./dist/foo-1.0.tar.gz
    foo-1.0/
    foo-1.0/foo.py
    foo-1.0/PKG-INFO
    foo-1.0/setup.py

Install the module
------------------

.. code-block:: bash

    % python setup.py install

Required metadata
-----------------

.. container:: r2b-note

    Metadata for Python software packages is defined in :pep:`314`.
    Module version number recommendations are defined in :pep:`396`.

        The setup() function can take dozens of parameters. For the sanity of
        everyone involved, you must use named arguments for every parameter.
        This is not merely a convention; it’s a hard requirement. Your setup
        script will crash if you try to call the setup() function with
        non-named arguments.

        — http://diveintopython3.org/packaging.html

.. code-block:: python

    setup(name='foomatic',
        version='1.0',
        author='Memyself Andi',
        author_email='mandi@example.net',
        url='http://example.net',
        packages=['foomatic'])

Recommended metadata
--------------------

.. code-block:: python

    setup(...
        description='Automating foo',
        long_description="""\
            A multi-line string in reStructuredText
            format. PyPI converts this to HTML.""",
        classifiers=[
            'Development Status :: 4 - Beta',
            'Programming Language :: Python'])

Requiring other packages
------------------------

.. container:: r2b-note

    “Any version after 1.0 and before 2.0 is compatible, except 1.5.1”

    — http://docs.python.org/distutils/setupscript.html

Version specifiers::

    <    >    ==
    <=   >=   !=

.. code-block:: python

    setup(...
        requires=[
            'bar==1.3',
            'meh>1.0, !=1.5.1, <2.0',
        ])

Satisfying requirements
-----------------------

.. code-block:: python

    setup(...
        provides=[
            'baz',
        ])

Installing scripts
------------------

.. code-block:: python

    setup(...
        scripts=[
            'scripts/runfoo'])

Grabbing the version
--------------------

.. code-block:: python

    import pkg_resources
    version = pkg_resources.require(
        "foomatic")[0].version

Directory structure
-------------------

.. container:: r2b-note

    Suggestions:

        To accomodate Windows users, your “read me” file should include a .txt
        extension, and it should use Windows-style carriage returns.

        If your Python software is a single .py file, you should put it in the
        root directory along with your “read me” file and your setup script.

        — http://diveintopython3.org/packaging.html

::

    foomatic/
        |- README.txt
        |- LICENSE.txt
        |- setup.py
        |- docs/
            |- stuff
        |- foomatic/
            |- __init__.py
            |- foo.py
        |- scripts/
            |- runfoo

setuptools
==========

setuptools

setuptools
----------

.. container:: r2b-note

    setuptools is a collection of enhancements to the Python distutils (for
    Python 2.3.5 and up on most platforms; 64-bit platforms require a minimum
    of Python 2.4) that allow you to more easily build and distribute Python
    packages, especially ones that have dependencies on other packages.

    Easy Install is a python module (easy_install) bundled with setuptools that
    lets you automatically download, build, install, and manage Python
    packages.

.. code-block:: bash

    easy_install SomePackage
    easy_install "SomePackage==2.0"
    easy_install "SomePackage>2.0"
    easy_install --upgrade SomePackage
    easy_install http://example.com/ExamplePackage-2.0-py2.4.egg

Distribute
----------

.. container:: r2b-note

    Distribute is a fork of the Setuptools project.

    Distribute is intended to replace Setuptools as the standard method for
    working with Python module distributions.

    Distribute is a drop-in replacement for Setuptools.

.. code-block:: bash

    % curl -O \
        http://python-distribute.org/distribute_setup.py
    % python ./distribute_setup.py
    ...
    % easy_install --version
    distribute 0.6.10

PyPI
====

The Python Package Index

Register
--------

.. code-block:: bash

    python ./setup.py register

Python 3
========

Python 3

disutils2 is dead; long live packaging
--------------------------------------

.. container:: r2b-note

    PyCon 2011: Packaging, from Distutils to Distutils2:

    http://blip.tv/pycon-us-videos-2009-2010-2011/pycon-2011-packaging-from-distutils-to-distutils2-4898961

http://docs.python.org/dev/packaging/index.html
