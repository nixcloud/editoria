'use strict';

module.exports = {
  "extends": [
    "airbnb",
    "standard",
    "standard-react"
  ],
  "rules": {
    "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
    "sort-keys": [1, "asc", { "caseSensitive": false }]
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
