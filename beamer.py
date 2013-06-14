#!/usr/bin/env python
# encoding: utf-8
"""A small wrapper around rst2latex in order to add a few Beamer customizations

"""
import os
import sys

from docutils.writers.latex2e import LaTeXTranslator
from docutils.core import publish_cmdline, default_description
from docutils.writers.latex2e import Writer as Latex2eWriter

FILE = os.path.abspath(os.path.dirname(__file__))

class BeamerTranslator(LaTeXTranslator):
    """Wrap the Latex translator to output Beamer constructs"""
    def visit_container(self, node):
        if 'frame' in node.get('classes', []):
            self.out.append('\n\\begin{frame}{Title}\n') # placeholder title

        if 'note' in node.get('classes', []):
            self.out.append('\n\\note{%\n')

    def depart_container(self, node):
        if 'frame' in node.get('classes', []):
            self.out.append('\n\\end{frame}\n')

        if 'note' in node.get('classes', []):
            self.out.append('}%\n')

class BeamerWriter (Latex2eWriter):
    def __init__(self):
        Latex2eWriter.__init__(self)
        self.translator_class = BeamerTranslator
        self.default_template_path = os.path.abspath(os.path.dirname(__file__))

def main ():
    """Generates Beamer-flavoured LaTeX for PDF-based presentations."""
    sys.argv.extend([
        '--documentclass=beamer',
        '--documentoptions=t',
        '--output-encoding=UTF-8',
        '--output-encoding-error-handler=backslashreplace',
        '--template=beamer-tmpl.tex',
        '--no-section-numbering',
        '--use-latex-docinfo',
    ])

    description = (main.__doc__ + default_description)
    publish_cmdline(writer=BeamerWriter(), description=description)

if __name__ == '__main__':
    main()
