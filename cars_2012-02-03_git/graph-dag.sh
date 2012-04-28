#!/bin/sh

set -e

echo "digraph lattice {"

git rev-list --pretty=format:"%H %h %d" "$@" | awk '
!/^commit/ {
    refs = ""
    for (i=3; i<=NF; i++) refs = refs " " $i
    print "n" $1, "[shape=Mrecord, style=filled, label=\"{" $2 refs "}\"]"
}
'

git rev-list --parents "$@" |
        while read commit parents
        do
                for p in $parents
                do
                        echo "n$commit -> n$p"
                done
        done

echo "}"
