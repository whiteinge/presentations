#!/bin/sh
# Requires: pip install docutils rst2html5

rst2html5 --syntax-highlight=none --template=./html5.tmpl "$@"
