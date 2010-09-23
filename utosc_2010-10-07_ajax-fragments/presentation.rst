================================
Utah Open Source Conference 2010
================================
Ajax Fragments, Django, jQuery, and You!
----------------------------------------

:Author: Seth House <seth@eseth.com>
:Date: 2010-10-07

.. include:: <s5defs.txt>
.. footer:: Ajax Fragments


Introduction
============

.. class:: handout

    We’re going to talk about methods of making reusable Ajax widgets that you
    can sprinkle all over your site. This talk was originally inspired by
    Facebook's presentation at the JSConf 2010 but we will talk about both the
    front-end and the back-end to acheive something similar.

    This talk is really three separate presentations crammed together and we do
    not have enough time to cover everything in detail.

    <get a head-count of front-end guys and back-end guys>

    My slides are crammed with explanations and links; please read through them
    for further learning.

    Here’s a quick overview of what we will be talking about:

    1.  You

        Reusable Ajax widgets require quite a lot of organization. This isn’t
        going to be easy to pull off if you’re writing new CSS for each new
        page that goes up on your site. This isn’t going to be easy if you’re
        working out of a single 1500-line JavaScript file or inlining your
        JavaScript in your HTML.

        We will talk about how to organize your CSS and JavaScript.

    2.  jQuery

        We'll talk about the Sammy jQuery plugin and how to do Ajax in jQuery.

    3.  Django

        We'll talk about the Piston app in Django and how to easily return
        Json.

    4.  Ajax Fragments

        Finally, we'll put it all together and look at a proof-of-concept
        Django project. The code is up on GitHub.

    ...........................................................................

    We’re building on some techniques outlined in Facebook employee, Makinde
    Adeagbo’s, slides from JSConf 2010 entitled `Primer`_ which explain how
    Facebook uses a technique called Ajax Fragments.

    We’ll talk about keeping history and bookmarkability with Ajax using
    `Sammy`_ or `jquery.hashlisten`_.

    We’ll talk about performance concerns using techniques detailed in
    O'Reilly’s `Even Faster Web Sites`_.

    We’ll talk about JavaScript code organization using pub/sub and inheritance
    techniques detailed in Rebecca Murphey’s `Building Large jQuery
    Applications`_ and `jQuery Fundamentals`_.

    We’ll talk about how to organize your CSS using `OOP CSS`_.

    We’ll talk about Django techniques for easily handling both Ajax and
    regular requests using largely the same code with `Piston`_ (or
    JsonResponse for existing codebases).

    Then we’ll talk progressive enhancement using ajax fragments since search
    bots don’t yet index ajax. Although Google is working on a proposal for
    doing so.

    I’ll show a proof-of-concept Django project that utilizes all these
    techniques and best-practices. The code is available on GitHub.

.. _`primer`: http://www.slideshare.net/makinde/javascript-primer
.. _`Sammy`: http://code.quirkey.com/sammy/
.. _`jquery.hashlisten`: http://github.com/sinefunc/jquery.hashlisten
.. _`Even Faster Web Sites`: http://oreilly.com/catalog/9780596522315
.. _`Building Large jQuery Applications`: http://www.slideshare.net/rmurphey/building-large-jquery-applications
.. _`jQuery Fundamentals`: http://jqfundamentals.com/book/book.html
.. _`OOP CSS`: http://www.slideshare.net/stubbornella/object-oriented-css
.. _`Piston`: http://bitbucket.org/jespern/django-piston/wiki/Home

.. ............................................................................

Ajax Fragments
==============

.. class:: handout

    xxx

        [T]he team exploited the observation that most controls work the same
        way:

        * User clicks
        * Sends ASync request
        * Insert/Replace some content

        So the team set up elements like this::

            <a href="/ring.php rel="dialog">...</a>

        …and then hijacked them with a standard listener routine, one that would
        work for most of the controls. (Most, not all; 80/20 principle is in effect
        here.) This way, they could have one small listener routine to handle most
        of the controls on the page.

        …

        And they are using a convention: ``ajaxify=1`` on an element indicates
        it's … Ajaxified.

        At this point, the team had now Ajaxified a bunch of features, but people
        were still skeptical about more complicated features. For example, would
        setting status be too hard with the same techniques. So after some
        research, Makinde came back with an epiphany: the humble form. Whereas the
        previous async requests were effectively information-less - just a simple
        directive and maybe an ID - the requests would now include content too. And
        of course, most of these things look nothing like forms due to styling. But
        underneath, they're still forms, e.g. the entire comments block is a single
        form.

        <form action="/submit/" method="post" ajaxify="1">
            …
        </form>

        .. figure:: ./facebook-ajaxify-form.png

        Nowadays, most of Facebook runs without complete page refreshes, by
        dynamically flipping the content and the fragment ID. (What Facebook calls
        page transitions.)

        — http://ajaxian.com/archives/facebook-javascript-jsconf

.. ............................................................................

Does the Googlebot Index Ajax?
==============================

…

.. ............................................................................

Performance
===========

.. class:: handout

    Interface latency; what is “fast enough”?

        [I]f your JavaScript code takes longer than 0.1 seconds to execute,
        your page won't have that slick, snappy feel; if it takes longer than 1
        second, the application feels sluggish; longer than 10 seconds, and the
        user will be extremele frustrated.

        — Even Faster Web Sites, O’Reilly

    Splitting your JavaScript into what is required for the first page and
    everything else. Avoiding “undefined” symbols and race conditions can be
    difficult.

        In the condition where the delayed code is associated with a UI
        element, the problem can be avoided by changing the element's
        appearance. In this case, the menu could contain a “Loading…” spinner.

        …

        Another option is to attach handlers to UI elements in the lazy-loaded
        code. In this example, the menu would be rendered initially as static
        text. Clicking it would not execute any JavaScript. The lazy-loaded
        code would both contain the menu functionality and would attach that
        behavior to the menu using ``attachEvent`` in [IE] and
        ``addEventListener`` in all other browsers.

        …

        In situations where the delayed code is not associated with a UI
        element, the solution to this problem is to used stub functions.

        — Even Faster Web Sites, O’Reilly

    xxx

        The first initiative was to include the Javascript at the bottom of the
        page. Great, it's faster, but at what cost? A big one: Users try to
        click on controls, and nothing happens. Back to the drawing board, and
        the team refined the setup so that the actionable stuff was initialised
        on the top of the page. But how to minimise all this code at the top of
        the page?

        — http://ajaxian.com/archives/facebook-javascript-jsconf

    Quickling

        Most important performance metric: TTI (Time to interact) latency From
        the time user clicks on a link to he/she is able to interact with the
        page. Front end latency accounts for more than 70% of total TTI
        latency:

        Front end latency: > 70%
        Include network latency and browser render time (CSS, JavaScript,
        images)

        Back end latency: < 30%
        Include page generation time (PHP, DB, Memcache, etc)

        …

        Two software abstractions at Facebook Dramatically improve Facebook’s
        TTI latency:

        Quickling: transparentlyajaxifiesthe whole web site
        PageCache: caches user-visited pages in browser

        …

        How Quickling works?
        1. User clicks a link or back/forward button
        2. Quickling sends an ajax to server
        3. Response arrives
        4. Quickling blanks the content area
        5. Download javascript/CSS
        6. Show new content

        …

        Architecture components:
        Link Controller
        HistoryManager
        Bootloader
        Busy Indicator

        …

        LinkController:
        Intercept user clicks on links After DOM content is ready, dynamically
        attach a handler to all link clicks (could also use event delegation)::

        $('a').click(function() {
            // 'payload' is a JSON encoded response from the server
            $.get(this.href, function(payload) {

                // Dynamically load 'js', 'css' resources for this page.
                bootload(payload.bootload, function() {

                    // Swap in the new page's content
                    $('#content').html(payload.html)

                    // Execute the onloadRegister'edjs code 
                    execute(payload.onload)
                });
            }
        });

        …

        Bootloader:
        Load static resources via ‘script’, ‘link’ tag injection Before entering a
        new page: Dynamically download CSS/Javascript for the next page

        Javascript::

            varscript = document.createElement(&apos;script&apos;);
            script.src = source;
            script.type = &apos;text/javascript&apos;;
            document.getElementsByTagName(&apos;head&apos;)[0].appendChild(script);

        CSS::

            varlink = document.createElement(&apos;link&apos;);
            link.rel = &quot;stylesheet&quot;;
            link.type = &quot;text/css&quot;;
            link.media = &quot;all&quot; ; 
            link.href = source;
            document.getElementsByTagName(&apos;head&apos;)[0].appendChild(link);

        Bootloader (cont.)

        Load static resources via ‘script’, ‘link’ tag injection Reliable callbacks
        to ensure page content shown after depended resources arrive:

        JavaScript resources::

            ‘bootloader.done(resource_name)’ injected at the end of all JS packages.

        CSS resources::

            ‘#bootloader_${resource_name} {height: 42px}’ injected in all CSS packages.

        Bootloader polls the corresponding invisible div height to determine if the
        CSS package arrives.

        …

        Problems:

        CSS rules accumulated over time
        Render time is roughly proportional to the # of CSS rules
        Automatically unload CSS rules before leaving a page

        Memory consumption
        Browser memory consumption increase overtime
        Periodically force full page load to allow browsers to reclaim memory

        — http://www.slideshare.net/ajaxexperience2009/chanhao-jiang-and-david-wei-presentation-quickling-pagecache

::

    /**
     * Adding a single line to this ﬁle requires great internal reﬂection
     * and thought. You must ask yourself if your one line addition is so
     * important, so critical to the success of the company, that it warrants
     * a slowdown for every user on every page load. Adding a single letter
     * here could cost thousands of man hours around the world.
     *
     * That is all.
     */

.. look into labJS or requireJS for async-loading?

**2.5 seconds**

Put JavaScript at the bottom of the page. **(Sometimes!)**

Load only necessary JS up-front and lazy-load the rest. This is a challenege.

* Use “stub” functions to avoid undefined errors for not-yet-downloaded
  dependencies.
* Put both the code to be executed as well as the event-handler attachments in
  the same lazy-loaded code so that clicking (or other interactions) simply
  cannot cause undefined errors.

.. ............................................................................

jQuery Code Organization
========================

* Use classes to organize your code
* Write methods that do exactly one thing
* Use ``$.proxy()`` to define ``this``

.. ............................................................................

Encapsulating Behavior with pub/sub
===================================

.. class:: handout

    “[I]magine a standard three-pane email client. … When you click on a
    message you just received, several things happen:

    The mailbox unread count gets decremented
    The message’s unread indicator goes away
    The message row text goes from bold to plain
    The message content appears in the viewer pane”

    …

    “In general, it's a good idea to have a "view" layer which simply deals
    with displaying the data and sending events about user actions on that data
    (ie. clicks, etc.) to a "controller" layer, which then decides what to do.”

…

.. ............................................................................

CSS Code Organization
=====================

.. class:: handout

    `OOCSS`_ employs heavy reuse of CSS making your .css files smaller. In some
    cases it can also help the browser to repaint less often.

    Two main principles:

    1.  Separate structure and skin
    2.  Separate container and content

    Standard module format; originally from `YUI`_.

        A module, or “object”, consists of four things:

        1.  HTML, which can be one or more nodes of the DOM,
        2.  CSS declarations about the style of those nodes all of which begin
            with the class name of the wrapper node
        3.  Components like background images and sprites required for display,
            and
        4.  JavaScript behaviors, listeners, or methods associated with the
            object.

        — http://wiki.github.com/stubbornella/oocss/faq

    Guidelines:

    * Module must contain 1 or more body regions.
    * Module may contain 1 header region and may contain 1 footer region.
      They can be extended via skin classes.
    * Keep the inside transparent.
    * Don't use ``id``.

      * Do put ``id`` in the code to use for link targets and in JavaScript
        calls — just don’t reference ``id`` in your CSS (unless you’re creating
        a singleton on purpose).

    * Extend existing objects by adding additional classes to the modules::

        <div class="leftCol myColumn"> ... </div>

      Don’t override the existing module classes::

        .leftCol{… custom css here …}

`OOCSS`_ standard module format::

    <div class="mod">
        <div class="inner">
            <div class="hd">…</div>
            <div class="bd">…</div>
            <div class="ft">…</div>
        </div>
    </div>

.. _`OOCSS`: http://oocss.org/
.. _`YUI`: http://developer.yahoo.com/yui/

.. ............................................................................

Proof of Concept
================

Widgets

    * Ajax "Please wait" throbber.
    * Modal
    * Tabs
    * Image carousel (dynamically load next/prev)
    * Comment form
    * Endless scrolling

http://eseth.org/2010/ajax-fragments-django-jquery/

.. ............................................................................

Conclusion
==========

.. class:: handout

    “Ongoing, Makinde says performance optimisation requires ongoing vigilance.
    Every engineer has their special case, but in the scheme of things, it's
    better to say no to new features unless they can be strongly justified. For
    example, we can live with user submitting a form that hasn't yet been
    hijacked; a complete page refresh is fine on occasion. We don't like it,
    but we don't want to make it a special case just for the sake of it.”

    — http://ajaxian.com/archives/facebook-javascript-jsconf
