===
AWK
===

:Organization: Ogden Area Linux User Group
:Author: Seth House <seth@eseth.com>
:Date: 2013-03-26

awk
===

.. raw:: latex

    {
    \usebackgroundtemplate{
        \vbox to \paperheight{\vfil\hbox to \paperwidth{\hfil
        \includegraphics[height=\paperheight]{sed_awk.jpg}
        \hfil}\vfil}
    }
    \begin{frame}[plain]
    \end{frame}
    }

awk, nawk, gawk
---------------

.. container:: r2b-note

    AWK is a programming language created at Bell Labs for data extraction and
    reporting.

        When written in all lowercase letters, as awk, it refers to the Unix or
        Plan 9 program that runs scripts written in the AWK programming
        language.

        — http://en.wikipedia.org/wiki/Awk

    * “New awk” (nawk) replaced awk but the name was not changed.
    * GNU awk implments nawk and adds additional enhancements.

    Larry Wall's Perl was intended to deprecate awk and sed.

* AWK (language)
* awk 1977 (oawk)
* nawk 1984 (POSIX)
* gawk

AWK
===

AWK

Structure
---------

.. container:: r2b-note

    If the condition is empty the action is run against all records. If the
    action is empty the record is printed.

::

    ''condition'' { ''action'' }

Fields
------

* ``echo "one two three" | awk '{ print $1, $3 }'``
* ``echo "one two three" | awk '{ print $0 }'``

Records
-------

.. code-block:: bash

    echo -e "one two three\nfour five six" | \
        awk '{ print $1, $3 }'

Types of blocks
---------------

.. container:: r2b-note

    ::

        echo -e "one two three\nfour five six" | \
            awk '
                BEGIN { print "Before" }
                { print $1, $3 }
                END { print "After" }
            '

* ``BEGIN``
* ``END``
* condition

Conditions
==========

Conditions

Multiple blocks
---------------

.. code-block:: bash

    echo -e "one two three\nfour five six" | \
        awk '
            { print $1, $3 }
            { print $2 }
        '

Fields
------

.. code-block:: bash

    echo -e "one\ntwo\nthree" | \
        awk '$1 == "two" { print $1 }'

Equality
    ``$2 == "Sam"``
Comparison
    ``$2 > 1``
Combine conditions
    ``$2 > 1 && $2 < 5``
    ``$2 == "Sam" || $2 == "George"``
Multiple conditions
    ``$2 == "Sam", $3 < 5``

Regex
-----

.. code-block:: bash

    echo -e "alpha\n1\nbeta\n2" | \
        awk '/[a-z]/ { print $0 }'

Negation
--------

.. code-block:: bash

    echo -e "alpha\n1\nbeta\n2" | \
        awk '! /[a-z]/ { print $0 }'

Matching
--------

.. code-block:: bash

    echo -e "foo\nbar\nbaz\n" | \
        awk '$1 ~ /^ba/ { print $1 }'

Printing output
===============

Printing output

``print``
---------

.. code-block:: bash

    echo "one two three" | \
        awk '{
            print "Records"
            print "First: " $1, "Second: " $2,
                "Third: " $3
        }'

Field separator
---------------

Default: whitespace

.. code-block:: bash

    echo "one,two,three" | \
        awk 'BEGIN { FS="," } { print $1, $3 }'

.. code-block:: bash

    echo "one,two,three" | \
        awk -F, '{ print $1, $3 }'

Record separator
----------------

Default: newline

.. code-block:: bash

    echo -e "one\ntwo\n\nthree\nfour" | \
        awk 'BEGIN {
                RS=""   # blank line
                FS="\n" # newline
            }
            { print $1 }
        '

Output field separator
----------------------

Default: space

.. code-block:: bash

    echo "one two three" | \
        awk 'BEGIN { OFS="," }
            { print $1, $2, $3 }'

Output record separator
-----------------------

Default: newline

.. code-block:: bash

    echo -e "one two three\nfour five six" | \
        awk 'BEGIN { OFS=","; ORS=";" }
            { print $1, $2, $3 }'

``printf``
----------

``printf``

Output format
-------------

Default: "%.6g"

OFMT: Stores the format for numeric output.

Variables
=========

Variables

Number of input fields
-----------------------

.. code-block:: bash

    echo "one two three" | \
        awk '{ print NF }'

Number of input records
-----------------------

.. code-block:: bash

    echo -e "one\ntwo\nthree" | \
        awk '{ print NR }'

Input filename
--------------

.. code-block:: bash

    echo "one" > one
    echo "three" > three
    echo "two" | awk '{ print FILENAME }' one - three

Environment variables
---------------------

.. code-block:: bash

    WTF="bbq" awk '{ print ENVIRON["WTF"] }'

Number of args
--------------

.. code-block:: bash

    awk 'END { print ARGC }' file1 file2

Array of args
-------------

.. code-block:: bash

    awk 'END { for (i in ARGV) print i }' file1 file2

Assignment, variable types, counters
------------------------------------

* No need to initialize variables

Type casting
------------

* Strings to numbers (arithmetic / counters)
* Numbers to strings (``print``)

Associative arrays
------------------

.. code-block:: bash

    times_seen[$1] += 1

Builtin functions
-----------------

Custom functions
----------------

::

    function add_three (number) {
        return number + 3
    }

    print add_three(36)

Usage & mechanics
=================

Usage & mechanics

Calling awk
-----------

Stdin
    ``somecmd | awk '{ … }'``
Input file(s)
    ``awk '{ … }' input-file1 input-file2``
Stdin and input files
    ``somecmd | awk '{ … }' input-file1 - input-file2``

Writing AWK
-----------

Inline
    ``awk '{ … }'``
External script
    ``awk -f myscript.awk``
Shell script (``chmod +x``)
    ``#!/usr/bin/awk -f``

Readable awk inside another script
----------------------------------

.. code-block:: bash

    #!/bin/sh
    somecmd | awk '
    BEGIN {
        …
    }
    /match/ {
        …
    }
    END {
        …
    }'

Arguments
---------

.. code-block:: bash

    echo "blah" | awk somearg=someval '{ print somearg }'

Real world awk
==============

Real world awk

Committers by number of commits
-------------------------------

::

    git log --format='%aN <%aE>' | \
        awk '{arr[$0]++}
            END {
                for (i in arr){ print arr[i], i; }
            }' | sort -rn

Merged pull requests by date
----------------------------

::

    git log --date=relative \
        --pretty="format:%h %ci" \
        --grep "Merge pull request" | \
        awk '{ dc[$2]+=1 }
        END { for (d in dc) print d, dc[d] }' | sort

IRC channel stats
-----------------

::

    awk '$2 ~ /\<\w+\>/ {
        file[FILENAME]+=1;
        people[$2]+=1;
        count+=1
    }
    END {
        print "Avg per day:", count / (ARGC - 1);
        for (i in people) n+=1;
        print "By", n, "people";
        max=0;
        for (i in file) { if (file[i] > max) max=i; };
        print "Busiest day was", max, "with", \
            file[max], "things said";
    }' \#utahjs*
