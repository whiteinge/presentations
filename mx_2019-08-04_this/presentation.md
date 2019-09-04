class: center, middle, inverse

<h1>
    <span style="font: smaller;">JavaScript's</span>
    <br><br>
    <code>this</code>
</h1>

A brownbag workshop at

<img width="200px" src="./mx-logo.svg" alt="MX Technologies">

by Seth House

@whiteinge<br>
seth@eseth.com

---

class: center, middle

# How `this` works in a single sentence

> The `this` parameter is very important in object oriented programing, and its
> value is determined by the _invocation pattern_.
>
> – Douglas Crockford, JavaScript the Good Parts (2008)

---

## Invocation patterns

> There are four patterns of invocation in JavaScript: the method invocation
> pattern, the function invocation pattern, the constructor invocation pattern,
> and the apply invocation pattern.

* `myObj.foo()`
* `foo()`
* `new Foo()`
* `foo.apply()` (and `call` and `bind`)

---

## Method invocation

```js
var myObj = {
    myMeth: function() { console.log(this) },
};
myObj.myMeth();
```

```js
var myObj = {
    mySubObj: {
        myMeth: function() { console.log(this) },
    },
};
myObj.mySubObj.myMeth();
```

---

## Function invocation

What will this log and why?

```
var myMeth = myObj.mySubObj.myMeth;
myMeth();
```

---

## `call` & `apply` invocation

```js
// Map over list items:
Array.prototype.map.call(
    document.querySelectorAll('ul > li'),
    x => x.innerHTML)

// Reduce over form fields:
// <form onsubmit="processForm(ev, {})">...</form>
function getFormData(ev, seed) {
    return Array.prototype.reduce.call(ev.target, (acc, el) => {
        if (el.name && el.value !== '') {
            if (Array.isArray(acc[el.name])) {
                acc[el.name].push(el.value);
            } else {
                acc[el.name] = el.value;
            }
        }
        return acc;
    }, seed);
}
```

---

## `bind`

(Modern browsers pre-bind `console.log()`.)

```js
var log = console.log.bind(console);
```

--

Capture `this` via closure (is there a difference?):

```js
function foo() {
    var that = this;
    return function() {
        console.log(that);
    };
}
```

---

## An aside: Partial application

```js
var ajax = (method, path, body) => { }
var get = ajax.bind(undefined, 'GET')
var getFoos = ajax.bind(undefined, 'GET', '/foo')
```

---

## Functional mixins

(by Angus Croll)

Generic utility mixin functions where `this` is _expected_ to change!

```js
function asAjax() {
    this.baseURL = 'https://api.github.com'
    this.fetch = function() {
        return fetch(this.baseURL + this.path).then(r => r.json())
    };
}
```

---

## Functional mixins (usage)

```js
function Users() {
    this.path = '/users';

    this.methodFoo = function() { }
    this.methodBar = function() { }
}

function Organizations() {
    this.path = '/organizations';

    this.methodBaz = function() { }
}

asAjax.call(Users.prototype)
asAjax.call(Organizations.prototype)

var users = new Users()
users.fetch().then(x => console.log('users', x));

var organizations = new Organizations()
organizations.fetch().then(x => console.log('organizations', x));
```

---

## Arrow functions

Arrow functions don't use `this` at all!  
They only capture lexical scope like with any other variable.

```js
var myObj = {
    myMeth: () => { console.log(this) },
};

myObj.myMeth();
myObj.myMeth().call({foo: 'Foo'})
```
