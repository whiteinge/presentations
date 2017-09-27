# Cool RxJS Tricks

Presentation files for a talk given at UtahJS Conf 2017.

Video of the talk: https://youtu.be/hkVq7u94Vzw

Slides:

* [presentation.md](https://github.com/whiteinge/presentations/blob/master/utahjs_conf_2017-08-18_cool-rxjs-tricks/presentation.md) for the slides source and speaker notes.
* [presentation.pdf](https://github.com/whiteinge/presentations/blob/master/utahjs_conf_2017-08-18_cool-rxjs-tricks/presentation.pdf) for the rendered slides.

## Instructions

This makes use of json-server to mimic the GitHub API...because we'll be making
hundreds of requests (for fun).

1. Grab the package.json file:
2. Install the deps:

    ```sh
    npm install
    ```

3. Start the local server:

    ```sh
    npm start
    ```

4. Visit http://localhost:3000 in your browser.
5. Open the development console in your browser.

Note, the main server above randomly fails and times out 2% of incoming
requests. Run `npm run srv:db` if you'd prefer to test with reliable server
responses.
