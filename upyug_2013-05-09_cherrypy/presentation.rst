========
CherryPy
========

:Organization: Utah Python
:Author: Seth House <seth@eseth.com>
:Date: 2013-05-09

.. include:: /home/shouse/src/presentations/beamerdefs.txt

.. container:: r2b-note

    Outline

    * History
    * 2 v 3 v 3.2
    * Basics
    * Good
      * Docs
    * Bad
      * Docs
      * Community size

A minimalist Python web framework
=================================

|frame|

.. image:: cherrypy.png

|end_frame|

History
-------

.. container:: r2b-note

    French dude.

    http://www.amazon.com/dp/1904811841

* Remi Delon |pause|
* 2002: CherryPy

  * CherryPy class processed to be self-contained module (app & server) |pause|

* 2004: CherryPy 2

  * Object publishing
  * Filters |pause|

* 2005: CherryPy 2.1

  * Shipped with Turbogears
  * Scrutiny; performance; WSGI support |pause|

* 2006: CherryPy 3

  * Book
  * Turbogears 2.x chose Pylons |pause|

* 2011: CherryPy 3.2

Why CherryPy
------------

.. figure:: commit-history.pdf
    :width: 70 %

    https://www.ohloh.net/p/cherrypy

Goals
-----

* Simplicity
* No deps
* Lightly opinionated
* Community driven

Features
--------

* Small (~600k)
* Featureful
* Plain functions or objects
* Extremely extendible

CherryPy basics
===============

|frame|

.. image:: cherrypy.png

|end_frame|

Basics
------

* Application framework
* Webserver

Framework
---------

* Configuration via dictionaries
* Seven hook functions

  * Called during request/response cycle

* Caching
* Encoding
* Sessions & cookies
* Authorization
* Uploads
* Static content |pause|
* No ORM / no templating / no forms

Server
------

* Pure Python (Python 2.3+)
* HTTP/1.1 compliant
* Thread pooled
* Fast (1-2 ms per request)
* SSL (!)
* Cheroot: Stand-alone version

Hello world
-----------

Application and server:

|example<| hello.py |>|

.. code-block:: python

    import cherrypy

    class HelloWorld:
        def index(self):
            return "Hello world!"
        index.exposed = True

    cherrypy.quickstart(HelloWorld())

|end_example|

``import cherrypy``
-------------------

.. code-block:: python

    help(cherrypy)

Building an app
===============

|frame|

.. image:: cherrypy.png

|end_frame|

Dispatchers
-----------

* Determine handler (via app config and URI)
* Set ``cherrypy.request.handler``
* Wraps handler
* Collect config in ``cherrypy.request.config``
* Extremely open-ended
* Use a custom by setting ``request.dispatch``
* http://docs.cherrypy.org/stable/refman/_cpdispatch.html

Default dispatcher
------------------

For example:

* http://localhost/ -> ``root.index``
* http://localhost/onepage -> ``root.onepage``
* http://localhost/some/page -> ``root.some.page``

Or possibly:

* http://localhost/blog/2005/01/17 -> ``root.blog(self, year, month, day)``

Handlers
--------

.. container:: r2b-note

    Resources:

        When you wish to serve a resource on the Web, you never actually serve
        the resource, because “resources” are concepts. What you serve are
        representations of a resource, and page handlers are what you use in
        CherryPy to do that. Page handlers are functions that you write;
        CherryPy calls one for each request and uses its response (a string of
        HTML, for example) as the representation.
        […]
        CherryPy takes the output of the appropriate page handler function,
        binds it to cherrypy.response.body, and sends it as the HTTP response
        entity body. Your page handler function (and almost any other part of
        CherryPy) can directly set cherrypy.response.status and
        cherrypy.response.headers as desired.

        — http://docs.cherrypy.org/stable/concepts/dispatching.html

* Any callable
* Current handler is ``cherrypy.request.handler``
* Replace on the fly
* Must have ``exposed=True`` attribute |pause|
* ``.index`` attribute will take precedence
* ``default`` callable as fallback |pause|
* ``POST`` data available as kwargs:

  .. code-block:: python

      class MyHandler(object):
          def search(self, q, lang, page):
              # do something with ``q``

Config
------

* Dictionaries (!)

  * Python code (run-time)
  * ConfigParser ini files
  * Python code (execution-time) |pause|

* Configure

  * Dispatcher (per URL)
  * ``request`` / ``response`` object attributes
  * Hooks
  * Tools
  * Logging
  * Server options |pause|

* Global config
* Application config
* Handler config:

  .. code-block:: python

      class MyHandler(object):
          _cp_config = {}

Tools
-----

* Behavior outside handlers
* Many builtin
* Register / enable in the config::

      [/images]
      tools.staticdir.on: True

  |pause|

* Some usable as handler
* Directly callable |pause|
* Usable as decorators:

  .. code-block::

      @tools.staticdir(dir='static')
      def images():
          …

Writing tools
-------------

.. code-block:: python

    def mytool():
        # something!

    cherrypy.tools.mytool = Tool('on_some_hook', mytool)

Hooks
-----

.. container:: r2b-note

    on_start_resource
        The earliest hook; the Request-Line and request headers have been
        processed and a dispatcher has set request.handler and request.config.
    before_request_body
        Tools that are hooked up here run right before the request body would
        be processed.
    before_handler
        Right before the request.handler (the “exposed” callable that was found
        by the dispatcher) is called.
    before_finalize
        This hook is called right after the page handler has been processed and
        before CherryPy formats the final response object. It helps you for
        example to check for what could have been returned by your page handler
        and change some headers if needed.
    on_end_resource
        Processing is complete - the response is ready to be returned. This
        doesn’t always mean that the request.handler (the exposed page handler)
        has executed! It may be a generator. If your tool absolutely needs to
        run after the page handler has produced the response body, you need to
        either use on_end_request instead, or wrap the response.body in a
        generator which applies your tool as the response body is being
        generated (what a mouthful–see caching tee.output for an example).
    before_error_response
        Called right before an error response (status code, body) is set.
    after_error_response
        Called right after the error response (status code, body) is set and
        just before the error response is finalized.
    on_end_request
        The request/response conversation is over, all data has been written to
        the client, nothing more to see here, move along.

* ``on_start_resource``
* ``before_request_body``
* ``before_handler``
* ``before_finalize``
* ``on_end_resource``
* ``before_error_response``
* ``after_error_response``
* ``on_end_request``

Conclusion
==========

|frame|

.. image:: cherrypy.png

|end_frame|

Good
----

* Crazy flexible
* Lots of documentation
* Small
* Fast
* No deps

Bad
---

* Documentation is scattered / some holes
* CherryPy 2 vs. 3 vs. 3.2
* Small community
* Flexibility style can be tough to organize

Walkthrough of a real app
-------------------------

* Demo of REST interface to Salt

  * Request
  * Response
  * Reading headers
  * Writing headers
  * Redirects
  * Exceptions

* WSGI Server
* Writing tests
