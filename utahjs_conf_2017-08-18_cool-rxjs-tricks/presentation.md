name: section
layout: true
class: center, middle, inverse

---

template: section

# Cool RxJS Tricks

## UtahJS Conf 2017

by Seth House
@whiteinge

http://talks.eseth.com/#rxjs-tricks

???

Outline

RxJS has been catching on in the JavaScript world in a big way and has a lot of
people very excited. The learning curve has a reputation as steep and it's not
always clear what all the excitement is about. This talk will demonstrate
real-world examples of things RxJS can make almost trivial that are very
difficult to do with promises and even async/await. We will skip an
introduction and focus on live demos, but tips and resources for how to get
started will be provided at the end. Some of the topics we will demonstrate are
below and will range from difficult operations plucked from real, production
code to games and jokes.

* Juggle complex coordination of many XHR requests.
* Granularly track XHR progress.
* Caching then freeing resources.
* A drop-in poller with incremental back-off.
* Facebook's Flux architecture.
* Routing.
* Easy state management.
* Controlling side-effects.
* Effortless drag and drop.
* The Konami code as an easter egg.
* A different way to think about async.

Come to be amazed and ready to be excited to dive into RxJS on your own.

Thoughts

Borrow show image of a goat on click from React Rally talk? Demo encapulating state?

---

class: center, middle
layout: false

# Reactive Extensions

![](assets/rx.png)

???

There are many flavors of reactive programming and many implementations of
observables. Reactive Extensions by Microsoft is a mature and full featured
library that has been implemented across at least twenty languages and
environments.

http://reactivex.io/languages.html

We will be using RxJS version 4 in this talk. RxJS version 5 recently came out
of beta which is a ground-up rewrite that has some performance and debuging
improvements. However RxJS 4 is a rock-solid and battle-tested version that
will be maintained for the forseable future and I plan to wait for a few
versions before switching. All the concepts in this talk are applicable to
both.

---

## Who is this Talk For?

* This is not an introduction!
--

* We're going to go fast. http://talks.eseth.com/#rxjs-tricks
--

* Crucial to have self-motivation when diving into this topic.

--

Presenter's $0.02:

* Mature, stable, six-year-old codebase.
--

* Ideas and techniques spanning many languages and implementations.
--

* Rx knowledge will make you unafraid of async.
--

* Rx knowledge will show you a new way to compose behavior and programs.

???

* Too much to Rx to provide an introduction in a talk.
* There is a learning curve.
* Feeling compelled to learn the next, big "new thing" will lead to resentment.
  Avoid JS fatigue by sticking with tried and true tech. Learn new things to
  solve real problems or as desired, not because you feel like you have to.

---

## A Note on RxJS Versions

### RxJS 4

* Maintenance-only.
* Rock solid.
* Great performance.
* Maintained for the foreseeable future.

### RxJS 5

* Better performance.
* Better stack traces.
* Test with marble diagrams!
* See the "Migrating From" doc.

---

class: center, middle
layout: false

# Ajax

---

## `Rx.DOM.ajax()`

Like a Promise but *lazy* and *cancelable*.

```js
var users = Rx.DOM.ajax('https://api.github.com/users');
var sub = users.subscribe(
    x => console.log('users', x),
    err => console.log('error', err),
    () => console.log('completed'));
```

---

## A Shorthand: `logOb()`

```js
// logOb :: String -> Observer
function logOb(name) {
    return {
        onNext: x => console.log(`${name} next:`, x),
        onError: err => console.log(`${name} error:`, err),
        onCompleted: () => console.log(`${name} completed`),
    };
}
```

---

## Lazy

```js
var users = Rx.DOM.ajax({
    url: 'https://api.github.com/users',
    responseType: 'json',
});
```
--

```js
// Observable({response: Array(30), status: 200, xhr: XMLHttpRequest, ...})
```
--

```js
var userCount = users.pluck('response', 'length');
```
--

```js
var sub = userCount.subscribe(logOb('count'));
```

---

## A Shorthand: `xhr()`

```js
// xhr :: String -> Object -> Observable
function xhr(url, ...params) {
    return Rx.DOM.ajax({
        url,
        responseType: 'json',
        ...params,
    })
    .pluck('response');
}
```

---

## Sequential Requests

```js
// Get all users:
var allUsers = xhr('https://api.github.com/users');
```
--

```js
// Grab the first user:
var firstUser = allUsers
    .flatMap(userList => xhr(userList[0].url));
```
--

```js
// Grab that user's repos:
var userRepos = firstUser
    .flatMap(userDetails => xhr(userDetails.repos_url));
```
--

```js
// Grab the first repo for that user:
var firstUserRepo = userRepos
    .flatMap(userReposList => xhr(userReposList[0].url));
```
--

```js
// Grab the details for that repo:
var sub = firstUserRepo
    .subscribe(logOb('User's first repo details'));
```

---

## Sequential Requests (together)

Get details for the first user's first repo:
```js
xhr('/users')
    .flatMap(userList => xhr(userList[0].url)
        .flatMap(userDetails => xhr(userDetails.repos_url)
            .flatMap(userReposList => xhr(userReposList[0].url))))
    .subscribe(logOb('First user repo details'));
```

???

Here we can plainly see that `flatMap` processes each step after the next
passing the result from the previous to the next. Nothing too exciting yet.
Analogous to a promise chain where each `then` method returns another promise.
(Except lazy!)

---

## Coordinate Many Requests

But what if we wanted all repos from all users?
--

```js
xhr('/users')
    .flatMap(userList => Rx.Observable.from(userList))
    .flatMap(user => xhr(user.url)
        .flatMap(userDetails => xhr(userDetails.repos_url)
            .flatMap(userReposList => Rx.Observable.from(userReposList))
            .flatMap(repo => xhr(repo.url))));
```
--

```diff
 xhr('/users')
-    .flatMap(userList => xhr(userList[0].url)
+    .flatMap(userList => Rx.Observable.from(userList))
+    .flatMap(user => xhr(user.url)
         .flatMap(userDetails => xhr(userDetails.repos_url)
-            .flatMap(userReposList => xhr(userReposList[0].url))))
+            .flatMap(userReposList => Rx.Observable.from(userReposList))
+            .flatMap(repo => xhr(repo.url))));
```

???

With this simple change we have a first glimpse of something promises can't do
-- emit multiple values. Instead of emit a single array of users, we emit once
for every user which allows us to perform additional actions for each user such
as get all the users repos and then emit those individually too.

---

## Limit Concurrent Requests

```diff
 xhr('/users')
     .flatMap(userList => Rx.Observable.from(userList))
-    .flatMap(user => xhr(user.url)
+    .flatMapWithMaxConcurrent(5, user => xhr(user.url)
         .flatMap(userDetails => xhr(userDetails.repos_url)
             .flatMap(userReposList => Rx.Observable.from(userReposList))
-            .flatMap(repo => xhr(repo.url))));
+            .flatMapWithMaxConcurrent(5, repo => xhr(repo.url))));
```

---

## Rate-limit Outgoing Requests

```diff
 xhr('/users')
     .flatMap(userList => Rx.Observable.from(userList))
+    .map(x => Rx.Observable.of(x).delay(1000))
+    .concatAll()
     .flatMapWithMaxConcurrent(5, user => xhr(user.url)
         .flatMap(userDetails => xhr(userDetails.repos_url)
             .flatMap(userReposList => Rx.Observable.from(userReposList))
+            .map(x => Rx.Observable.of(x).delay(1000))
+            .concatAll()
             .flatMapWithMaxConcurrent(5, repo => xhr(repo.url))));
```

---

## A Shorthand: "lettable" Functions

```js
function listToRateLimitedStream(delayBy = 1000) {
    return o => o
        .flatMap(xs => Rx.Observable.from(xs))
        .map(x => Rx.Observable.of(x).delay(delayBy))
        .concatAll();
}
```
--

```diff
 xhr('/users')
-    .flatMap(userList => Rx.Observable.from(userList))
-    .map(x => Rx.Observable.of(x).delay(1000))
-    .concatAll()
+    .let(listToRateLimitedStream(1000))
     .flatMapWithMaxConcurrent(5, user => xhr(user.url)
         .flatMap(userDetails => xhr(userDetails.repos_url)
-            .flatMap(userReposList => Rx.Observable.from(userReposList))
-            .map(x => Rx.Observable.of(x).delay(1000))
-            .concatAll()
+            .let(listToRateLimitedStream(1000))
             .flatMapWithMaxConcurrent(5, repo => xhr(repo.url))));
```

---

## Send Different Data Through Different Streams

```js
var obs = xhr('/users')
    // ...snip...
    .share();

var [superStars, regularStars] = obs
    .partition(repoDetails => repoDetails.stars > 1500);

obs.count()
    .subscribe(logOb('Total repos'));
regularStars.count()
    .subscribe(logOb('Regular repos'));
superStars.reduce(countTimesSeenUser, {})
    .subscribe(logOb('Super stars'));


function countTimesSeenUser(acc, repo) {
    acc[repo.userId] = (acc[repo.userId] || 0) + 1;
    return acc;
}
```

---

class: center, middle
layout: false

# Ajax Failures

---

## Catch & Replace Errors

```diff
 xhr('/users')
     .let(listToRateLimitedStream(1000))
     .flatMapWithMaxConcurrent(5, user => xhr(user.url)
+        .catch(() => Rx.Observable.empty())
         .flatMap(userDetails => xhr(userDetails.repos_url)
+            .catch(() => Rx.Observable.empty())
             .let(listToRateLimitedStream(1000))
-            .flatMapWithMaxConcurrent(5, repo => xhr(repo.url))));
+            .flatMapWithMaxConcurrent(5, repo => xhr(repo.url)
+                .catch(() => Rx.Observable.empty()))));
```

---

## Timeout Long Requests

```diff
 xhr('/users')
     .let(listToRateLimitedStream(1000))
     .flatMapWithMaxConcurrent(5, user => xhr(user.url)
+        .timeout(15000)
         .catch(() => Rx.Observable.empty())
         .flatMap(userDetails => xhr(userDetails.repos_url)
+            .timeout(15000)
             .catch(() => Rx.Observable.empty())
             .let(listToRateLimitedStream(1000))
             .flatMapWithMaxConcurrent(5, repo => xhr(repo.url)
+                .timeout(15000)
                 .catch(() => Rx.Observable.empty()))));
```

---

## Retrying Failures

```diff
     .let(listToRateLimitedStream(1000))
     .flatMapWithMaxConcurrent(5, user => xhr(user.url)
         .timeout(15000)
+        .retryWhen(no => no.flatMap(() => Rx.Observable.timer(1000)))
         .catch(() => Rx.Observable.empty())
         .flatMap(userDetails => xhr(userDetails.repos_url)
             .timeout(15000)
+            .retryWhen(no => no.flatMap(() => Rx.Observable.timer(1000)))
             .catch(() => Rx.Observable.empty())
             .let(listToRateLimitedStream(1000))
             .flatMapWithMaxConcurrent(5, repo => xhr(repo.url)
                 .timeout(15000)
+                .retryWhen(no => no.flatMap(() => Rx.Observable.timer(1000)))
                 .catch(() => Rx.Observable.empty()))));
```

???

`no` is short for "notifier".

---

## A Shorthand: Retry

```js
function retry({
        timeout = 15000,
        retry = 10000,
    }) {
    return o => o
        .timeout(timeout)
        .retryWhen(no => no.flatMap(() => Rx.Observable.timer(retry)))
        .catch(() => Rx.Observable.empty());
}
```

---

## Retry -- Forever...

```diff
 xhr('/users')
     .let(listToRateLimitedStream(1000))
     .flatMapWithMaxConcurrent(5, user => xhr(user.url)
-        .timeout(15000)
-        .retryWhen(no => no.flatMap(() => Rx.Observable.timer(1000)))
-        .catch(() => Rx.Observable.empty())
+        .let(retry({retry: 1000}))
         .flatMap(userDetails => xhr(userDetails.repos_url)
-            .timeout(15000)
-            .retryWhen(no => no.flatMap(() => Rx.Observable.timer(1000)))
-            .catch(() => Rx.Observable.empty())
+            .let(retry({retry: 1000}))
             .let(listToRateLimitedStream(1000))
             .flatMapWithMaxConcurrent(5, repo => xhr(repo.url)
-                .timeout(15000)
-                .retryWhen(no => no.flatMap(() => Rx.Observable.timer(1000)))
-                .catch(() => Rx.Observable.empty()))));
+                .let(retry({retry: 1000})))));
```

???

```js
xhr('/users')
    .let(listToRateLimitedStream(1000))
    .flatMapWithMaxConcurrent(5, user => xhr(user.url)
        .let(retry({retry: 1000}))
        .flatMap(userDetails => xhr(userDetails.repos_url)
            .let(retry({retry: 1000}))
            .let(listToRateLimitedStream(1000))
            .flatMapWithMaxConcurrent(5, repo => xhr(repo.url)
                .let(retry({retry: 1000})))));
```

---

## Retry with Backoff

```diff
 function retry({
         timeout = 15000,
         retry = 10000,
+        backoffMax = 5,
     }) {
     return o => o
         .timeout(timeout)
-        .retryWhen(no => no.flatMap(() => Rx.Observable.timer(retry)))
+        .retryWhen(no => no
+            .scan(count => count + 1, 0)
+            .flatMap(function(i) {
+                var backoff = i < backoffMax
+                    ? i * retry
+                    : backoffMax * retry;
+                return i >= backoffMax
+                    ? Rx.Observable.throw('Giving up')
+                    : Rx.Observable.timer(backoff);
+            }))
         .catch(() => Rx.Observable.empty());
 }
```

???

```js
function retry({
        timeout = 15000,
        retry = 10000,
        backoffMax = 5,
    }) {
    return o => o
        .timeout(timeout)
        .retryWhen(no => no
            .scan(count => count + 1, 0)
            .flatMap(function(i) {
                var backoff = i < backoffMax
                    ? i * retry
                    : backoffMax * retry;
                return i >= backoffMax
                    ? Rx.Observable.throw('Giving up')
                    : Rx.Observable.timer(backoff);
            }))
        .catch(() => Rx.Observable.empty());
}
```

---

class: center, middle
layout: false

# Ajax Progress Events

---

## Track all Ajax Requests

```diff
+var XhrProgress = new Rx.Subject();
+
 function xhr(url, ...params) {
+    var rqid = Symbol(url);
+    var sendProg = type => ev => XhrProgress.onNext({
+        url,
+        params,
+        xhr: ev ? ev.target : null,
+        ev,
+        rqid,
+        type,
+    });
+
     return Rx.DOM.ajax({
         url,
         responseType: 'json',
+        progressObserver: {
+            onNext: sendProg('next'),
+            onError: sendProg('error'),
+            onCompleted: sendProg('completed'),
+        },
         ...params,
     })
     .pluck('response');
```

???

```js
var XhrProgress = new Rx.Subject();

function xhr(url, ...params) {
    var rqid = Symbol(url);
    var sendProg = type => ev => XhrProgress.onNext({
        url,
        params,
        xhr: ev ? ev.target : null,
        ev,
        rqid,
        type,
    });

    return Rx.DOM.ajax({
        url,
        responseType: 'json',
        progressObserver: {
            onNext: sendProg('next'),
            onError: sendProg('error'),
            onCompleted: sendProg('completed'),
        },
        ...params,
    })
    .pluck('response');
}
```

---

## Watch for Server Errors

```js
var serverErrors = XhrProgress
    .pluck('xhr', 'status')
    .filter(status => status === 500);

serverErrors.subscribe(logOb('Seen error'));
```

---

## Track All In-Flight Requests

```js
var inFlight = XhrProgress.scan(function(active, x) {
    if (x.type === 'next') active.set(x.rqid, x);
    else active.delete(x.rqid);
    return active;
}, new Map());
```

---

## Poll Until Condition

```js
xhr('/some/path')
    .repeatWhen(no => no.delay(10000))
    .takeUntil(XhrProgress
        .filter(x => x.path === '/some/path')
        .pluck('xhr', 'response')
        .filter(resp => resp != null && resp !== ''));
```

---

## Cache Responses

```js
xhr('/some/path').shareReplay(1);
```
