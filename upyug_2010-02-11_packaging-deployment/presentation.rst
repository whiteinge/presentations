======================
Utah Python User Group
======================

:Author: Seth House <seth@eseth.com>
:Date: 2010-02-11

----------------------
Packaging & Deployment
----------------------

.. figure:: ./pip_distribute.png
    :scale: 35 %

.. ...........................................................................

---------
Packaging
---------

.. r2b_note::

    Tensions between Linux packaging and Python packaging.

    PIL

    Anyone have a good rule of thumb?

`Distutils`_ Installing Python Modules
--------------------------------------

.. r2b_note::

        “Distutils is the standard mechanism to distribute Python packages and
        extensions since Python 1.6.”

        — PythonInfo Wiki

::

    python setup.py install

`Distutils`_ Distributing Python Modules
----------------------------------------

.. r2b_note::

    1.  write a setup script (setup.py by convention)
    2.  (optional) write a setup configuration file
    3.  create a source distribution
    4.  (optional) create one or more built (binary) distributions

::

    from distutils.core import setup
    setup(
        name='myniftymodule',
        version='1.0',
        py_modules=['myniftymodule'],
    )

`setuptools`_
-------------

.. r2b_note::

    setuptools is a collection of enhancements to the Python distutils (for
    Python 2.3.5 and up on most platforms; 64-bit platforms require a minimum
    of Python 2.4) that allow you to more easily build and distribute Python
    packages, especially ones that have dependencies on other packages.

    Easy Install is a python module (easy_install) bundled with setuptools that
    lets you automatically download, build, install, and manage Python
    packages.

::

    easy_install SomePackage
    easy_install "SomePackage==2.0"
    easy_install "SomePackage>2.0"
    easy_install --upgrade SomePackage
    easy_install http://example.com/ExamplePackage-2.0-py2.4.egg

`Distribute`_
-------------

.. r2b_note::

    Distribute is a fork of the Setuptools project.

    Distribute is intended to replace Setuptools as the standard method for
    working with Python module distributions.

    Distribute is a drop-in replacement for Setuptools.

::

    % curl -O \
        http://python-distribute.org/distribute_setup.py
    % python ./distribute_setup.py
    ...
    % easy_install --version
    distribute 0.6.10


.. ...........................................................................

----------
Deployment
----------

Deployment
----------

    “Deployment is one of the things I like least about development, and yet
    without deployment the development doesn’t really matter.”

    — Ian Bicking

`virtualenv`_
-------------

::

    virtualenv --no-site-packages someproject

`pip`_
------

.. r2b_note::

    * Packages don’t have to be installed as egg archives, they can be
      installed flat (while keeping the egg metadata).
    * Uninstallation of packages.
    * Native support for other VCSes (Git, Mercurial and Bazaar).
    * Define fixed sets of requirements.
    * Freeze current setup as repeatable requirements.

* ``pip install somemodule``
* ``pip uninstall somemodule``
* ``pip install -E someproject -r /path/to/requirements.txt``
* ``pip freeze > requirements.txt``
* ``pip bundle MyBundle.pybundle -r /path/to/requirements.txt``
* ``pip install -E someproject MyBundle.pybundle``

`Fabric`_
---------

.. r2b_note::

    Execution model:

    * A list of tasks is created. Currently this list is simply the arguments
      given to fab, preserving the order given.
    * For each task, a task-specific host list is generated from various
      sources (see How host lists are constructed below for details.)
    * The task list is walked through in order, and each task is run once per
      host in its host list.
    * Tasks with no hosts in their host list are considered local-only, and
      will always run once and only once.

    * run sudo put get local prompt confirm
    * append comment contains exists sed upload_template

* ``fab --list``
* ``fab --detail somecommand``
* ``fab somecommand othercommand``

`buildout`_
-----------

`Punt`__.

(Sorry.)

.. __: http://pypi.python.org/pypi/zc.buildout

`toppcloud`_
------------

::

    pip install -E topp -r \
        http://bitbucket.org/ianb/toppcloud\
            /raw/tip/requirements.txt

http://blog.ianbicking.org/2010/01/29/new-way-to-deploy-web-apps/


.. _`Distutils`: http://docs.python.org/library/distutils.html
.. _`setuptools`: http://pypi.python.org/pypi/setuptools
.. _`Distribute`: http://packages.python.org/distribute/
.. _`virtualenv`: http://virtualenv.openplans.org/
.. _`pip`: http://pip.openplans.org/
.. _`Fabric`: http://fabfile.org/
.. _`buildout`: http://buildout.org/
.. _`toppcloud`: http://toppcloud.colorstudy.com/
