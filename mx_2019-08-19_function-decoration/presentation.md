class: center, middle, inverse

# Function Decoration
## Memoization and other useful tricks.

A brownbag workshop at

<img width="200px" src="./mx-logo.svg" alt="MX Technologies">

by Seth House

@whiteinge<br>
seth@eseth.com

---

class: center, middle

# Function Decoration

---

## Decorators.

```js
// var decoratedFunction = decorate(regularFunction);
function decorate(f) {
    // One-time initialization.
    // Called only when decorate() is called.
    var privateDataHere = 'private!';

    // Function that wraps our 'f' and does something extra.
    return function(...args) {
        // Logic here that decides
        // if/when/how/why to call 'f' with 'args'
        // (or even with a modified 'args'!).
        return f(...args)
    }
}
```

---

## Memoization.

```js
// A very basic memoization function:
// var myMemoedFunction = memo(myFunction)
function memo(f) {
    // One-time initialization. Called only when memo() is called.
    var savedArgs = {};

    return function(...args) {
        // Warning: stringify'ing objects is not stable!
        // If a problem must sort keys
        // or choose another caching strategy.
        var argVal = JSON.stringify(args)
        if (savedArgs[argVal] === undefined) {
            savedArgs[argVal] = f(...args)
        }
        return savedArgs[argVal];
    }
}
```

???

```js
// Dummy function. 
function myFunction(...args) {
    console.log('myFunction was called. Args:', args)
    return args
}
```

---

## Exchange memory for CPU.

```js
// Block the UI thread on purpose!
// var memoedSleep = memo(sleep);
// memoedSleep(3000);
// memoedSleep(3000);
function sleep(time) {
    var now = Date.now();
    while (Date.now() < (now + time)) {}
    return 'done'
}
```

---

## Once.

```js
// Only invoke myFunction one time
// (ever! ...for as long as it's in scope):
// var myGuardedFun = once(myFunction)
function once(f) {
    var wasCalled = false

    return function(...args) {
        if (wasCalled === false) {
            wasCalled = true
            return f(...args)
        }
        return
    }
}
```

---

## Throttle.

```js
// Don't invoke myFunction more often than once every three seconds:
// var myThrottledFunction = throttle(myFunction, 3000)
function throttle(f, time) {
    var lastCalled = 915148798;

    return function(...args) {
        var now = Date.now();

        if (now - lastCalled > time) {
            var ret = f(...args)
            lastCalled = now;
            return ret;
        }
    }
}
```

---

## Aspect-oriented programming.

```js
// var loggingFunction = (ret) =>
//   { console.log('Logging. Got return value', ret); return ret; }
// var myLoggingFunction = after(myFunction, loggingFunction);
function after(fn, afterFn) {
    return function(...args) {
        var ret = fn(...args)
        return afterFn(ret)
    }
}
```

---

## Cheap, simple ajax caching.

```js
// Memoize JSON responses to avoid duplicate HTTP calls:
// Note, this is storing promise objects in the memoize cache!
const cacheJSON = memo((...args) =>
    fetch(...args).then(x => x.json()))
cacheJSON('https://api.github.com/users').then(console.log)
```
