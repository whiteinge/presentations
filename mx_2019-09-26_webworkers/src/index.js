var myWorker = new Worker('./worker.js');

myWorker.addEventListener('message', function(ev) {
    console.log('Worker sent', ev.data)

    switch (ev.data.tag) {
        case 'myWorker/slow-task/result':
            handleResult(ev.data.data);
            break;
    }
});

function handleResult(result) {
    console.log('the result is', result);
}

/**
A function that performs a blocking task
**/
function sleep(time) {
    var now = Date.now();
    while (Date.now() < (now + time)) {}
    return 'done'
}
