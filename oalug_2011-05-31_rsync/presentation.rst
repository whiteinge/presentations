=====
rsync
=====

:Organization: Ogden Area Linux User Group
:Author: Seth House <seth@eseth.com>
:Date: 2011-05-31

rsync
=====

A replacement for rcp/scp
-------------------------

::

    rsync [OPTION] … SRC [SRC] … [USER@]HOST:DEST
    rsync [OPTION] … [USER@]HOST:SRC [DEST]

Basic usage
-----------

::

    rsync -avhz --progress SRC DEST

Syntax caveat
-------------

::

    rsync -av /src/foo /dest
    rsync -av /src/foo/ /dest/foo

Source or destination may be local or remote
--------------------------------------------

.. container:: r2b-note

    * A remote-shell program is used as the transport when a single colon is in
      the name.
    * Contacting an rsync daemon requires either two colons (``::``) or the
      ``rsync://`` protocol address prefix.

::

    rsync -avhz user@myhost:/src/foo /dest

Mirror the SRC exactly
----------------------

::

    rsync -av --delete SRC DEST

Partial transfers
-----------------

::

    rsync -avhz --append-verify SRC DEST

Test your command first
-----------------------

::

    rsync -avz --delete --dry-run SRC DEST

Other useful flags
------------------

* Excludes, includes, read list of files from a file
* Set permissions; set ownership.
* Don't traverse devices or file systems.
* Remove all empty directories.
* Hard-link unchanged files.
