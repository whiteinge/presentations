var body = document.querySelector('body');
body.innerHTML = '';

Rx.Observable.just(null)
    .let(getXhrResult('http://localhost:8080/fixtures/grains.json'))
    .do(x => console.log('Type is', x.inspect()))
    .map(theStore)
    .subscribe(theView);

// ---------------------------------------------------------------------------

function theStore(res) {
    // This is a XhrResult object. Don't pick at it.
    return res.map(function(x) {
        // Do normal store stuff inside here.
        // Feel free to ASSUME GLORIUS SUCCESS.
        return _.chain(x.ret)
            .values()
            .map('grains.os_family')
            .countBy()
            .value();
    });
}

function theView(resp) {
    // Synchronous.
    var ret = resp.fold(
            err => renderError(err),
            ret => renderOk(ret),
            () => "<p>Loading...</p>",
            () => "<p>No content.</p>");

    // Pretend I'm vdom.
    var content = "<h1>Don't say the 'M' word!</h1>";
    body.innerHTML = content + ret;
}

function renderError(value) {
    return `Server returned a ${value.status}.`;
}

function renderOk(value) {
    return _.map(value, (val, key) => `* ${val} ${key}`).join('<br>\n');
}