name: section
layout: true
class: center, middle, inverse

---

template: section

# Dispatching Types with Flux

## UtahJS / PolyJS

by Seth House

@whiteinge<br>
seth@eseth.com

---

class: center, middle
layout: false

# reduce

---

## Background

```js
// Flux! (Seriously.)
var Dispatcher = new Rx.Subject();
var send = (tag, data) => Dispatcher.onNext({tag, data});
```
--

```js
var ThingStore = Dispatcher
    .filter(({tag}) => tag === 'THING_ADDED' || tag === 'THING_REMOVED')
    .scan(function(acc, {tag, data}) {
        switch (tag) {
            case 'THING_ADDED':
                acc[data.id] = data;
                return acc;
            case 'THING_REMOVED':
                delete acc[data.id];
                return acc;
            default:
                return acc;
        }
    }, {})
    .shareReplay(1);
```

---

count: false

## Example

```js
var sub1 = ThingStore.subscribe(x => console.log('Current value of ThingStore', x));

send('THING_ADDED', {id: 'foo'})
```

---

## Generalize?

```js
    [...]
    .filter(({tag}) => tag === 'THING_ADDED' || tag === 'THING_REMOVED')
    .scan(function(acc, {tag, data}) {
        switch (tag) {
            case 'THING_ADDED':
                acc[data.id] = data;
                return acc;
            case 'THING_REMOVED':
                delete acc[data.id];
                return acc;
            default:
                return acc;
        }
    }, {})
    [...]
```

---

class: center, middle
layout: false

# Types

---

## Semigroup

* Types with a `concat` method.
--

* All about _combining_ values.
--

* Prepend, append, add, multiply, merging, etc.
--

* [Formal specification or "laws" not pictured here.]

---

## You Already Know Semigroups

```js
'foo'.concat('bar')
```
--

```js
['foo'].concat(['bar'])
```

---

## Monoid

* Is a semigroup.
--

* All about _combining_ values.
--

* Types with an `empty` method.
--

* Allows you to start combining things from nothing. I.e., a "seed" value.

---

## Augment the Builtin Types  (o_O)

```js
String.empty = () => '';
Array.empty = () => [];
```

---

## Generalize

```js
var fold = M => xs => xs.reduce(
    (acc, x) => acc.concat(x),
    M.empty());
```

---

## Combine via Reduction

```js
fold(String)(['foo', 'bar'])
```
--

```js
fold(Array)(['foo', 'bar'])
```

---

## Make your own Types

```js
var Collection = daggy.taggedSum('Collection', {
    Add: ['val'],
    Del: ['val'],
});
```

---

## Make your Type a Monoid

```js
Collection.prototype.concat = function(newVal) {
    function addRemove(oldVal) {
        if (Collection.Add.is(newVal)) {
            return Collection.Add(Object.assign({}, oldVal, newVal.val));
        }
        if (Collection.Del.is(newVal)) {
            Object.keys(newVal.val).forEach(function(key) {
                var val = newVal.val[key];
                if (oldVal[key]) {
                    delete oldVal[key];
                }
            });
            return Collection.Add(oldVal);
        }
        return oldVal;
    };

    return this.cata({
        Add: addRemove,
        Del: addRemove,
    });
};
```

---

## Generalize in Rx too

```js
Rx.Observable.prototype.foldp = foldp;
function foldp(M, seed = M.empty()) {
    return this.scan((acc, x) => acc.concat(x), seed)
        .startWith(seed);
}
```

---

## Tie it all Together

```diff
 var ThingStore = Dispatcher
     .filter(({tag}) => tag === 'THING_ADDED' || tag === 'THING_REMOVED')
     .pluck('data')
-    .scan(function(acc, {tag, data}) {
-        switch (tag) {
-            case 'THING_ADDED':
-                acc[data.id] = data;
-                return acc;
-            case 'THING_REMOVED':
-                delete acc[data.id];
-                return acc;
-            default:
-                return acc;
-        }
-    }, {})
+    .foldp(Collection)
     .shareReplay(1);
```

---

## Blindly Dispatch those Types

The correct reduction logic is now implicit in the type.

```js
send('THING_ADDED', Collection.Add({foo: 'Foo'}));
send('THING_ADDED', Collection.Add({bar: 'Bar'}));
send('THING_REMOVED', Collection.Del({bar: 'Bar'}));
```

---

class: center, middle
layout: false

# Additional Reading

---

## JavaScript Resources

Tom Harding's Fantas, Eel, and Specification

http://www.tomharding.me/

Professor Frisby's Mostly Adequate Guide to Functional Programming

https://drboolean.gitbooks.io/mostly-adequate-guide/content/
