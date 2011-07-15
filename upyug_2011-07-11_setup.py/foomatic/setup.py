from distutils.core import setup
setup(name='foomatic',
    version='1.0',
    packages=['foomatic'],
    description='Automating foo',
    long_description="""\
        A multi-line string in reStructuredText
        format. PyPI converts this to HTML.""",
    classifiers=[
        'Development Status :: 4 - Beta',
        'Programming Language :: Python'],
    scripts=[
        'scripts/runfoo'])
