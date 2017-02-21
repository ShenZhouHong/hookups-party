# Hookups💋 @ CSC
![Screenshot of index page](http://i.imgur.com/SWkBK3J.jpg)

A simple hookup app designed for anonymous romantic liaisons. Built using
express, socket.io, and the latest HTML5 technologies.

## TODO list
- [X] Write documentation for changes
- [ ] Get Giuseppe to look at the weird socket bugs in chat. Might be caused by some weird minify edge case?
- [ ] Implement progressive font rendering to prevent FOIC
- [ ] Implement 'bubble-styled' chat UI and replace placeholder well

## Installation
### Prerequisites
In order to begin installing and developing the newest version of **Hookups💋**,
a proper NodeJS environment is needed. Make sure to have `node` and `npm`
installed and available on your system.

* [NodeJS](https://nodejs.org/)
* [npm](https://www.npmjs.com/)

### Installing dependencies via npm
Next, download all of the dependencies related to this project with npm.

```
npm install
```

To build the minified javascript and CSS files required for running the site,
additional devDependencies such as `grunt` are also required.

```
npm install --devDependencies
```

### Building javascript and CSS files with grunt
Hookups💋 now uses `Grunt` as an automated toolchain for combining, stripping,
and minifying source javascript and HTML files. These files have to be built in
order to run Hookups💋.

```
grunt
```

**Please note:** compiled and minified javascript and CSS files are **NOT**
including as a part of the project repository! Therefore, in order to run the
project, these files must be built with `grunt`!

At this point, if there are no errors, the installation process is complete.
You may now start developing Hookups💋 @ CSC!

## Project structure documentation
As of the commit `fd3ab`, Hookups💋 has been refactored to use `grunt` as a
toolchain component. This means the directory structure has changed. Previously,
`.css` and `.js` files are not minified, and are stored under `public/`. These
files were edited directly.

Now, all source files are stored under `resources/sources`, and are not publicly
accessible. These are read by `grunt`, combined with other relevant files, and
then minified:

### Simplified example diagram
All files inside `resources/sources/css` are combined to form one minified css
file (`index.min.css`) and a corresponding map file (`index.min.css.map`). The
same process is repeated for the javascript files.

```
.
├── app.js
├── public
│   ├── css
│   │   ├── index.min.css
│   │   ├── index.min.css.map
│   └── js
│       ├── index.min.js
│       ├── index.min.js.map
└── resources
    └── sources
        ├── css
        │   ├── common.css
        │   ├── fonts.css
        │   └── index.css
        └── js
            ├── chat.js
            └── index.js
```

This process is extremely aggressive at optimizing javascript and CSS for file
size, in order to speed up content delivery. Unused attributes and functions are
stripped, and the finalized output is written to `public/`.

**Under no circumstances is it necessary to edit the output files in
`public/`!** In fact, these files are added to the `.gitignore` and should not
be committed.

## Running the project
By default, npm should run this app in development mode. Therefore, certain
settings such as gzip content encoding and HTML minifying are turned off. In
order to compare benchmarks, Hookups💋 has to be run in production.

This is generally done by exporting an environment variable to node.

```
export NODE_ENV=production
```
