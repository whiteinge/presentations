self.postMessage({tag: 'myWorker/loading'});

importScripts('./lib/lodash.min.js');
importScripts('./lib/rx.all.min.js');

self.postMessage({tag: 'myWorker/ready',
    data: _.toUpper('ready from lodash')});

self.addEventListener('message', function processMessages(ev) {
    console.log('Worker recieved', ev.data)

    var result;
    try {
        switch (ev.data.tag) {
            case 'myWorker/slow-task/start':
                console.log('starting long task');
                result = {
                    tag: 'myWorker/slow-task/result',
                    data: sleep(5000),
                };
                break;
            default:
                result = {tag: 'myWorker/error/unknown-task'};
                break;
        }
    } catch (err) {
        result = {tag: 'myWorker/error/uncaught'};
    }

    self.postMessage(result);
});

/**
A function that performs a blocking task
**/
function sleep(time) {
    var now = Date.now();
    while (Date.now() < (now + time)) {}
    return 'done'
}
