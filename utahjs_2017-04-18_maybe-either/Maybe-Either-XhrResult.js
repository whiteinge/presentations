var Error = x => ({
    map: f => Error(x),
    chain: f => Error(x),
    fold: (f, g) => f(x),
    inspect: () => `Error(${_.truncate(JSON.stringify(x))})`,
    getOrElse: (_default) => _default,
});

var Ok = x => ({
    map: f => Ok(f(x)),
    chain: f => f(x),
    fold: (f, g) => g(x),
    inspect: () => `Ok(${_.truncate(JSON.stringify(x))})`,
    getOrElse: (_default) => x,
    do: f => {f(x); return Ok(x)},
});

var Maybe = {Nothing: Error, Just: Ok, of: x => Ok(x)};
var Either = {Left: Error, Right: Ok, of: x => Ok(x)};

// ---------------------------------------------------------------------------

var fromNullable = x => x != null ? Ok(x) : Error(null);

var tryCatcher = f => {
    try {
        return Ok(f());
    } catch (e) {
        return Error(e);
    }
};

// ---------------------------------------------------------------------------

var Initial = x => ({
    map: f => Initial(x),
    chain: f => Initial(x),
    fold: (f, g, h, i) => i(x),
    inspect: () => `Initial()`,
});

var Loading = x => ({
    map: f => Loading(x),
    chain: f => Loading(x),
    fold: (f, g, h, i) => h(x),
    inspect: () => `Loading()`,
});

var XhrResult = {Initial, Loading, Error, Ok, of: x => Ok(x)};

// ---------------------------------------------------------------------------

function getXhrResult(uri) {
    return o => o.flatMap(() => Rx.Observable
        .just(XhrResult.Loading())
        .concat(Rx.DOM.get(uri)
            .delay(3000) // fake slow xhr response
            .catch(x => Rx.Observable.just(x))
            .map(r => r.status !== 200
                ? XhrResult.Error(r)
                : tryCatcher(() => JSON.parse(r.response)))
        )
        .delaySubscription(3000)) // wait a sec to show initial
        .startWith(XhrResult.Initial()); // optional
}
