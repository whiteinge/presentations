=======================
Lunch and Learn: Django
=======================

:Organization: Skullcandy
:Author: Seth House <seth@eseth.com>
:Date: 2011-11-18

Django overview
===============

Django overview

project vs. app
---------------

* A project is a collection of apps
* http://djangopackages.com/

``myproject/myapp/models.py``
-----------------------------

.. code-block:: python

    from django.db import models

    class TodoItem(models.Model):
        user = models.ForeignKey('auth.User')
        todo = models.CharField(max_length=150)
        timestamp = models.DateTimeField(
                auto_now_add=True)

``myproject/myapp/views.py``
----------------------------

.. code-block:: python

    from django.views.generic.base import \
            TemplateView
    from myproject.myapp.models import TodoItem

    class MyTodos(TemplateView):
        template_name = 'my_todos.html'

        def get(self, request, **kwargs):
            context = {
                'todos': TodoItem.objects.all()}
            return self.render_to_response(context)

.. FIXME**

``templates/base.html``
-----------------------

.. code-block:: django

    <!doctype html>
    <html lang="en">
        <head><title>Hello, Django</title></head>
        <body>
            {% block main %}{% endblock %}
        </body>
    </html>

``templates/myapp/todos.html``
------------------------------

.. code-block:: django

    {% extends "base.html" %}

    {% block body %}
        <ul>
        {% for t in todos %}
            <li>{{ t.todo }}</li>
        {% endfor %}
        </ul>
    {% endblock %}

``myproject/myapp/urls.py``
---------------------------

.. code-block:: python

    from django.conf.urls.defaults import \
            include, patterns, url
    from myproject.myapp.views import MyTodos

    urlpatterns = patterns('',
        url(r'^$', MyTodos.as_view(), name='todos'),
    )

``myproject/urls.py``
---------------------

.. code-block:: python

    from django.conf.urls.defaults import \
            include, patterns, url

    urlpatterns = patterns('',
        (r'^todos/', include('myproject.myapp.urls',
                namespace='todos')),
    )

``myproject/myapp/admin.py``
----------------------------

.. code-block:: python

    from django.contrib import admin
    from myproject.myapp.models import TodoItem

    class TodoItemAdmin(admin.ModelAdmin):
        list_display = ('pk', 'user', 'todo')
        list_filter = ('timestamp',)
        list_editable = ('todo',)

    admin.site.register(TodoItem, TodoItemAdmin)

``myproject/myapp/forms.py``
----------------------------

.. code-block:: python

    from django import forms
    from myproject.myapp.models import TodoItem

    class TodoItemForm(forms.ModelForm):
        class Meta:
            model = TodoItem

i18n
====

i18n

gettext
-------

* Python code
* templates
* JavaScript

Mark Python for translation
---------------------------

.. code-block:: python

    from django.utils.translation import ugettext as _

    # Translators: here is extra information
    _('This string to be translated.')

Mark templates for translation
------------------------------

.. code-block:: django

    {% load i18n %}

    {% comment %}Translators: extra infos{% endcomment %}
    {% trans "Another string to be translated." %}

``LocaleMiddleware``
--------------------

session -> cookie -> ``Accept-Language`` -> default config

django-rosetta
--------------

Testing
=======

Testing

unittest2
---------

Test Client
-----------

virtualenv
==========

virtualenv

Why virtualenv?
---------------

Self-contained Python environment::

    myvenv
    |-- bin/
    |   |-- activate
    |   |-- pip*
    |   `-- python*
    |-- lib/
    |   `-- python2.7/
    |       `-- site-packages/

Accessing
---------

* Shell: ``source /path/to/bin/activate``
* Scripts: ``/path/to/bin/python``

Automating
----------

::

    /path/to/bin/pip install -r REQS.txt

::

    django==1.3.1
    South==0.7.3

South
=====

South

Why South?
----------

* Only Django-aware contender for managing migrations
* Team-friendly / VCS-friendly
* Can add real database-level constraints to the schema (Django cannot)

Getting SQL
-----------

* Must actually run the migration with ``-v 2`` and capture the output

Best practices
==============

Django best practices

.. include:: ../upyug_2011-06-09_program-layout/presentation.rst
    :start-line: 156
    :end-line: 341
