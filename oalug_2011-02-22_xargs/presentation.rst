===========================
Ogden Area Linux User Group
===========================
xargs
=====

:Author:    Seth House <seth@eseth.com>
:Date:      2011-02-22


srs? A whole presentation just on xargs?
========================================

That’s right.

Baby steps
==========

.. class:: handout

    ``-t``
        Synonym for --verbose. Output the command about to be executed.

If not given a command, ``xargs`` assumes ``echo``::

    ls *.foo | xargs
    ls *.foo | xargs -t

Prompt before running the command::

    ls *.foo | xargs -p

Why is that useful?
===================

Get a list of process IDs::

    pgrep ssh

Get info on a list of process IDs::

    pgrep ssh | xargs ps

Handle arguments in groups
==========================

All at once::

    echo 1 2 3 4 | xargs

One at a time::

    echo 1 2 3 4 | xargs -n1

In groups of two::

    echo 1 2 3 4 | xargs -n2

Call programs that take multiple arguments
==========================================

.. class:: handout

    ``-I``
        replace-string

::

    ls *.foo | xargs -n1 -I@ cp @ ~/mybackups

On-the-fly shell scripts (that take arguments!)
===============================================

.. class:: handout

    ``-n1``
        Handle input one-at-a-time.
    ``-``
        Pass stdin as an argument to the script. This gives access to
        shell-script positional parameters like ``$@`` and ``$*``.

Use ``xargs`` to invoke ``sh -c`` and have access to positional parameters::

    ls *.foo | xargs -n1 sh -c 'echo $1' -

Parallel execution
==================

.. class:: handout

    ``-P``
        Specify the number of processes to start.
    ``-d``
        Specify the delimeter to look for in the input.

    I used to just use a for-loop::

        for ip in 192.168.0.{1..5}; do ssh $ip 'cd /some/path; git rev-list HEAD -n 1'; done

    But executing in parallel is much faster for large numbers of machines::

        echo -n 192.168.0.{1..50} | xargs -P10 ...

Get the load for several machines::

    echo -n 192.168.0.{1..5} | xargs -P5 -n1 -d" " -I"HOST" sh -c 'ssh -T HOST uptime'
    echo -n 192.168.0.{1..5} | xargs -P5 -n1 -d" " -I"HOST" sh -c 'ssh -T HOST uptime | sed -e "s/^/HOST: /"'


Parallelize grep
================

.. class:: handout

    http://blog.labrat.info/20100429/using-xargs-to-do-parallel-processing/

    Ideally you would calculate the number of cores for the -P argument::

        cat /proc/cpuinfo | grep processor | wc -l

If you need to grep though a large directory structure it can be parallelized!
Create 4 processes each one looking at 10 files::

    find /some/path -type f | xargs -P 4 -n 10 grep -H 'string-to-search'

Convert several files to pdf simultaneously
===========================================

Regular::

    find ./ -name "*.pdf" | xargs -Istr pdf2ps str

Fast::

    find ./ -name "*.pdf" | xargs -n 8 -Istr pdf2ps str
