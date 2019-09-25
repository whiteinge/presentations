# Web workers

## Content

* View the slides in the PDF (or the Markdown source).
* Read `./src/index.js` and `./src/worker.js`.

## Demo app

To run the web workers POC:

1.  `cd ./src/`
2.  `npm install`
3.  `npm start`
4.  Open http://localhost:8080 in your browser and play around in the console.

    Try typing this:

    ```js
    myWorker.postMessage({
        tag: 'myWorker/didyougetthis',
        data: 'hello?',
    });
    ```

    and this:

    ```js
    myWorker.postMessage({
        tag: 'myWorker/slow-task/start',
    });
    ```
