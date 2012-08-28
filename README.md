Welcome to AppJS port of Brackets!
-------------------

This is the firts iteration over porting Brackets to AppJS
so it is not yet fully operational but a work in progress.

This port only works with __AppJS v0.0.19__ and above.

How to run Brackets
-------------------

* Install nodejs.
* Use `npm install` to install the dependencies.
* Use `node --harmony app.js` in the Brackets root to launch
the application.

__ATTENTION__ If you use Mac OSX:

* Create a link to node 32bit in Brackets root directory
`ln -s $(which node) node`
* Download [Contents.zip](https://github.com/milani/brackets/downloads/) and extract it to Brackets root directory
* Run Brackets using `./node --harmony app.js`
