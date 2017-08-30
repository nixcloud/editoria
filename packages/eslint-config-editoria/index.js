'use strict';

module.exports = {
  "extends": [
    "airbnb",
    "standard",
    "standard-react"
  ],
  "react/sort-comp": [1, {
    "order": [
      "constructor",
      "lifecycle",
      "everything-else",
      "/^on.+$/",
      "rendering"
    ],
    "groups": {
      "rendering": [
        '/^render.+$/',
        'render'
      ]
    }
  }]
};
