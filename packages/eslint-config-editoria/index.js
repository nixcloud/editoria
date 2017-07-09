'use strict';

module.exports = {
  "extends": [
    "airbnb",
    "standard",
    "standard-react"
  ],
  "parser": "babel-eslint",
  "react/sort-comp": [1, {
    "order": [
      "constructor",
      "lifecycle",
      "everything-else",
      "render"
    ]
  }],
  "env": {
    "es6": true,
    "browser": true
  }
};

