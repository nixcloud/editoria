'use strict';

module.exports = {
  "extends": [
    "airbnb",
    "standard",
    "standard-react"
  ],
  "rules": {
    "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }]
  },
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
