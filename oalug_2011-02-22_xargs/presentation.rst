=====
xargs
=====

:Organization: Ogden Area Linux User Group
:Author: Seth House <seth@eseth.com>
:Date: 2011-02-22

xargs
=====

srs? A whole presentation just on xargs?
----------------------------------------

.. container:: r2b-note

    “build and execute command lines from standard input”

    — xargs(1)

    “The traditional Unix operating system kernel has a fixed limit of memory
    available for program environment and argument list combined.”

    — http://www.gnu.org/software/coreutils/faq/coreutils-faq.html#Argument-list-too-long

    The getconf command may be used to print the currently implemented limit::

        % getconf ARG_MAX
        2097152
        % touch {1..314759}

    “The Linux kernel has removed the classic ARG_MAX limitation. See the
    changeset on git.kernel.org for the change. This was released with the
    linux-2.6.23 kernel. It will eventually propagate into the release software
    distributions which include it. Note that glibc's getconf ARG_MAX hasn't
    caught up yet and still reports a fixed value.”

    — http://www.gnu.org/software/coreutils/faq/coreutils-faq.html#Argument-list-too-long

That’s right.

Getting started
===============

Baby steps
----------

.. container:: r2b-note

    ...

If not given a command, ``xargs`` assumes ``echo``::

    ls *.foo | xargs

Output the command to be run::

    ls *.foo | xargs -t

Prompt before running the command::

    ls *.foo | xargs -p

Why is that useful?
-------------------

Get a list of process IDs::

    pgrep ssh

Get info on a list of process IDs::

    pgrep ssh | xargs ps

Handle arguments in groups
--------------------------

All at once::

    echo 1 2 3 4 | xargs

One at a time::

    echo 1 2 3 4 | xargs -n1

In groups of two::

    echo 1 2 3 4 | xargs -n2

Call programs that take multiple arguments
------------------------------------------

.. container:: r2b-note

    ``-I``
        replace-string

::

    ls *.foo | xargs -n1 -I@ cp @ ~/mybackups

Advanced
========

On-the-fly shell scripts (that take arguments!)
-----------------------------------------------

Use ``xargs`` to invoke ``sh -c`` and have access to positional parameters::

    ls *.foo | xargs -n1 sh -c 'echo $1' -

``-``
    Pass stdin as an argument to the script. This gives access to
    shell-script positional parameters like ``$@`` and ``$*``.
``-n1``
    Handle input one-at-a-time.

Parallel execution
==================

Get the load for several machines
---------------------------------

::

    for ip in 192.168.0.{1..5}; \
        do ssh $ip uptime; done

Get the load for several machines in parallel
---------------------------------------------

Get the load for several machines::

    echo -n 192.168.0.{1..5} \
        | xargs -P5 -n1 -d" " -I"HOST" \
        sh -c 'ssh -T HOST uptime'

``-P``
    Specify the number of processes to start.
    Usage ``nproc`` (in coreutil) to get the number of processors.
``-d``
    Specify the delimeter to look for in the input.

Processing a large number of files
----------------------------------

Sequentially::

    for file in songs*.wav ; do lame -f $file $file.mp3

In parallel::

    find . -name "songs*.wav" \
        | xargs -I@ -P 5 lame -f @ @.mp3

Parallelize grep
----------------

If you need to grep though a large directory structure it can be parallelized!
Create one process per CPU, looking at 10 files each process::

    find /some/path -type f \
        | xargs -P$(nproc) -n 10 \
        grep -H 'string-to-search'

Convert several files to pdf simultaneously
-------------------------------------------

Sequentially::

    find ./ -name "*.pdf" \
        | xargs -Istr pdf2ps str

In parallel::

    find ./ -name "*.pdf" \
        | xargs -n 8 -Istr pdf2ps str

Problems with xargs
===================

Output from multiple processes is not buffered
----------------------------------------------

Post-process with ``sed``::

        echo -n 192.168.0.{1..5} \
            | xargs -P5 -n1 -d" " -I"HOST" \
            sh -c 'ssh -T HOST uptime \
                | sed -e "s/^/HOST: /"'

Or::

    echo 1 2 3 \
        | xargs -P3 -n1 sh -c '$PWD/count.sh $* \
        | sed "s/^/$$:/"' – | sort

annotate
--------

``annotate`` from the ``devscripts`` package::

    #!/bin/sh
    OUT=`mktemp /tmp/atomic.XXXXXX` || exit 1
    ERR=`mktemp /tmp/atomic.XXXXXX` || exit 1
    "$@" >> $OUT 2>> $ERR ; EXIT=$?
    cat $ERR
    cat $OUT
    rm -f $OUT $ERR
    exit $EXIT

xargs is not line-oriented
--------------------------

.. container:: r2b-note

    “xargs reads items from the standard input, delimited by blanks (which can
    be protected  with  double  or single quotes or a backslash) or newlines
    […] Because Unix filenames can contain blanks and newlines, this default
    behaviour is often problematic”

    — xargs(1)

    “Some of the UNIX utilities can use NULL as record separator [perl, locate,
    find, grep, sort]. […] Many UNIX utilities are line oriented. These may
    work with xargs as long as the lines do not contain ', " or space. […]
    [M]any UNIX utilities cannot use NULL as separator (e.g. head, tail, ls,
    echo, sed, tar -v, wc, which).”

    — http://en.wikipedia.org/wiki/Xargs#The_separator_problem

    FIXME: doesn't --delimiter="\n" solve this?

    the first tr is here to terminate lines by null bytes for xargs --null
    option so that quotes redirection etc are not expansed wrongly::

        tr '\012' '\000' <mycommands.sh | xargs --null --max-procs=$X bash -c

    — http://stackoverflow.com/questions/832253/minimal-task-queue-with-stock-linux-tools-to-leverage-multicore-cpu

    Handle file names with spaces, quotes, or backslashes with the ``-O`` switch.

::

    touch important_file
    touch 'not important_file'
    ls not* | xargs rm
    mkdir -p '12" records'
    ls | xargs rmdir

GNU parallel
============

Run jobs in parallel
--------------------

::

    cat somelist \
        | parallel do_something \
        | process_output

* http://www.gnu.org/software/parallel/
* https://build.opensuse.org/project/repositories?project=home:tange
* ``man parallel``

Lightweight job queue
---------------------

::

    echo > jobqueue; tail -f jobqueue | parallel
    echo my_command my_args >> jobqueue

Run tasks remotely via ssh
--------------------------

::

    seq 10 | parallel \
        --sshlogin server1,server2 echo

Distribute across many machines
-------------------------------

::

    parallel --trc {.}.ogg -j+0 \
        -S server1,server2,: \
        'mpg321 -w - {} \
            | oggenc -q0 - -o {.}.ogg' ::: *.mp3
