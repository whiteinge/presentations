#!/bin/sh
# Requires: pip install docutils rst2html5

BASE=$(dirname $0)
rst2html5 --syntax-highlight=none --template="${BASE}/html5.tmpl" "$@"
