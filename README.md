# Jsonapi-model-formatter.js [![npm version](https://img.shields.io/npm/v/jsonapi-model-formatter.svg)](https://www.npmjs.com/package/jsonapi-model-formatter) [![license type](https://img.shields.io/npm/l/jsonapi-model-formatter.svg)](https://github.com/FreeAllMedia/jsonapi-model-formatter.git/blob/master/LICENSE) [![npm downloads](https://img.shields.io/npm/dm/jsonapi-model-formatter.svg)](https://www.npmjs.com/package/jsonapi-model-formatter) ![ECMAScript 6 & 5](https://img.shields.io/badge/ECMAScript-6%20/%205-red.svg)

JSON API formatter for dovima models.

```javascript
import JsonApiModelFormatter from "jsonapi-model-formatter";
import Model from "dovima";
Model.jsonFormatter = JsonApiModelFormatter; //so now, when you do toJSON on dovima models, you got a jsonapi-compliant model
```

# Quality and Compatibility

[![Build Status](https://travis-ci.org/FreeAllMedia/jsonapi-model-formatter.png?branch=master)](https://travis-ci.org/FreeAllMedia/jsonapi-model-formatter) [![Coverage Status](https://coveralls.io/repos/FreeAllMedia/jsonapi-model-formatter/badge.svg)](https://coveralls.io/r/FreeAllMedia/jsonapi-model-formatter) [![Code Climate](https://codeclimate.com/github/FreeAllMedia/jsonapi-model-formatter/badges/gpa.svg)](https://codeclimate.com/github/FreeAllMedia/jsonapi-model-formatter) [![Dependency Status](https://david-dm.org/FreeAllMedia/jsonapi-model-formatter.png?theme=shields.io)](https://david-dm.org/FreeAllMedia/jsonapi-model-formatter?theme=shields.io) [![Dev Dependency Status](https://david-dm.org/FreeAllMedia/jsonapi-model-formatter/dev-status.svg)](https://david-dm.org/FreeAllMedia/jsonapi-model-formatter?theme=shields.io#info=devDependencies)

*Every build and release is automatically tested on the following platforms:*

![node 0.12.x](https://img.shields.io/badge/node-0.12.x-brightgreen.svg) ![node 0.11.x](https://img.shields.io/badge/node-0.11.x-brightgreen.svg) ![node 0.10.x](https://img.shields.io/badge/node-0.10.x-brightgreen.svg)
![iojs 2.x.x](https://img.shields.io/badge/iojs-2.x.x-brightgreen.svg) ![iojs 1.x.x](https://img.shields.io/badge/iojs-1.x.x-brightgreen.svg)


[![Sauce Test Status](https://saucelabs.com/browser-matrix/jsonapi-model-formatter.svg)](https://saucelabs.com/u/jsonapi-model-formatter)


*If your platform is not listed above, you can test your local environment for compatibility by copying and pasting the following commands into your terminal:*

```
npm install jsonapi-model-formatter
cd node_modules/jsonapi-model-formatter
gulp test-local
```

# Installation

Copy and paste the following command into your terminal to install Jsonapi-model-formatter:

```
npm install jsonapi-model-formatter --save
```

## Import / Require

```
// ES6
import jsonApiModelFormatter from "jsonapi-model-formatter";
```

```
// ES5
var jsonApiModelFormatter = require("jsonapi-model-formatter");
```

```
// Require.js
define(["require"] , function (require) {
    var jsonApiModelFormatter = require("jsonapi-model-formatter");
});
```

# Getting Started
The usage on the top of this file is pretty much all you need to do right now, it works like a formatter middleware for [dovima](https://github.com/FreeAllMedia/dovima) models.

# How to Contribute

See something that could use improvement? Have a great feature idea? We listen!

You can submit your ideas through our [issues system](https://github.com/FreeAllMedia/jsonapi-model-formatter/issues), or make the modifications yourself and submit them to us in the form of a [GitHub pull request](https://help.github.com/articles/using-pull-requests/).

We always aim to be friendly and helpful.

## Running Tests

It's easy to run the test suite locally, and *highly recommended* if you're using Jsonapi-model-formatter.js on a platform we aren't automatically testing for.

```
npm test
```
