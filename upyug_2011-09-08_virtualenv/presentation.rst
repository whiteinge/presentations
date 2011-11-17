========================
Roll your own virtualenv
========================

:Organization: Utah Python User Group
:Author: Seth House <seth@eseth.com>
:Date: 2011-09-08

Python prefix
=============

The following examples are stolen, wholesale, from the excellent PyCon 2011
talk by Carl Meyer titled “Reverse-engineering Ian Bicking's brain: inside pip
and virtualenv”. Video/slides:

http://blip.tv/episode/4899496
https://github.com/carljm/pipvirtualenv-preso

Copy the Python binary
----------------------

.. code-block:: bash

    $ mkdir scratch; cd scratch
    $ mkdir bin
    $ cp /usr/bin/python bin/
    $ tree
    .
    `-- bin
        `-- python

    $ ./bin/python -c "import sys; print(sys.prefix)"
    /usr

Create the landmark
-------------------

.. code-block:: bash

    $ mkdir -p lib/python2.6
    $ touch lib/python2.6/os.py
    $ tree
    .
    |-- bin
    |   `-- python
    `-- lib
        `-- python2.6
                `-- os.py

    $ ./bin/python -c "import sys; print(sys.prefix)"
    'import site' failed; use -v for traceback
    /home/carljm/scratch

    $ ./bin/python -c "import sys; print(sys.path)"
    'import site' failed; use -v for traceback
    ['',
    '/home/carljm/scratch/lib/python2.6/',
    '/home/carljm/scratch/lib/python2.6/plat-linux2',
    '/home/carljm/scratch/lib/python2.6/lib-tk',
    '/home/carljm/scratch/lib/python2.6/lib-old',
    '/usr/lib/python2.6/lib-dynload']

Fixing sys.exec_prefix
----------------------

.. code-block:: bash

    $ mkdir lib/python2.6/lib-dynload

    $ ./bin/python -c "import sys; print(sys.exec_prefix)"
    'import site' failed; use -v for traceback
    /home/carljm/scratch

    $ ./bin/python -c "import sys; print(sys.path)"
    'import site' failed; use -v for traceback
    ['',
    '/home/carljm/scratch/lib/python2.6/',
    '/home/carljm/scratch/lib/python2.6/plat-linux2',
    '/home/carljm/scratch/lib/python2.6/lib-tk',
    '/home/carljm/scratch/lib/python2.6/lib-old',
    '/home/carljm/scratch/lib/python2.6/lib-dynload']

We have an isolated virtualenv!
-------------------------------

* It's broken.
* No standard library.
* No site.py, thus no site-packages at all.
