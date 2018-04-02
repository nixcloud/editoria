# Editoria  

This is the Editoria monorepo.  

It consists of the main Editoria application, as well as the different [Pubsweet](https://gitlab.coko.foundation/pubsweet) components and helper libraries that the app is made of.  

This application is being developed by the [Coko Foundation](https://coko.foundation/), for the [University of California Press](http://www.ucpress.edu/).  
For more information, visit the project's [website](https://editoria.pub/) or our [chat channel](https://mattermost.coko.foundation/coko/channels/editoria).  
For the editor that Editoria uses, see its related project [Wax](https://gitlab.coko.foundation/wax/wax).  

## Roadmap
The current features on our list are the following:

|Module             |Description                                    |In progress    |Done     |Issue|
|:---:              |---                                            |:---:          |:---:    |:---:|
|System             |Switch to Postgres                             |               |&#x2714; |#80|
|System             |Use docker containers for deployments          |               |         |#89|
|System             |Implement roles & authorization                |&#x2714;       |         |#57|
|System             |Integrate with Manifold                        |               |         |#2|
|Book builder       |Redesign component state tool                  |               |         |#55|
|Book builder       |Introduce unnumbered chapters                  |               |         |#50|
|Editor             |Improve editor performane                      |               |&#x2714; |wax/wax#120|
|Editor             |Image captions                                 |&#x2714;       |         |wax/wax#127|
|Editor             |Keyboard shortcuts to add diacritics           |&#x2714;       |         |wax/wax#129|
|Editor             |Turn spell-check on and off                    |&#x2714;       |         |wax/wax#124|
|Editor             |Small caps style                               |&#x2714;       |         |wax/wax#125|
|Editor             |Track spaces                                   |               |         |wax/wax#119|
|Editor             |Track inline formatting (eg. italics)          |               |         |wax/wax#40|
|Editor             |Track block formatting (eg. headings)          |               |         |wax/wax#40|
|Editor             |Expand set of special characters               |               |         |wax/wax#128|
|Editor             |Text highlighter                               |               |         |wax/wax#18|
|Editor             |Arrow navigation between notes                 |&#x2714;       |         |wax/wax#133|
|Editor             |Update note icon in toolbar                    |&#x2714;       |         |wax/wax#126|
|Editor             |Increase font size for text                    |               |         |
|Document ingestion |Convert hyphens between numerals en dashes     |               |&#x2714; |[xsweet/editoria_typescript#21]|(https://gitlab.coko.foundation/xsweet/editoria_typescript#21)|
|Document ingestion |En and em dashes normalized                    |               |&#x2714; |[xsweet/editoria_typescript#21]|(https://gitlab.coko.foundation/xsweet/editoria_typescript#21)|
|Document ingestion |Clean up spaces around punctuation             |               |&#x2714; |[xsweet/editoria_typescript#21]|(https://gitlab.coko.foundation/xsweet/editoria_typescript#21)|
|Document ingestion |Convert series of periods to ellipses          |               |&#x2714; |[xsweet/editoria_typescript#21]|(https://gitlab.coko.foundation/xsweet/editoria_typescript#21)|
|Document ingestion |Normalize directional quotes and apostrophes   |               |&#x2714; |[xsweet/editoria_typescript#21]|(https://gitlab.coko.foundation/xsweet/editoria_typescript#21)|
|Document ingestion |Convert underlining and bolding to italics     |               |&#x2714; |[XSweet/editoria_typescript/issues/29](https://gitlab.coko.foundation/XSweet/editoria_typescript/issues/29), [xsweet/editoria_typescript#21]|(https://gitlab.coko.foundation/XSweet/HTMLevator/issues/2)|

<br/>
You can also find more detailed (and more technical) lists of the current tasks at hand on these pages:
* https://gitlab.coko.foundation/editoria/editoria/milestones/4
* https://gitlab.coko.foundation/wax/wax/milestones/4

## Get up and running  

Get your copy of the repository.  
```sh
git clone https://gitlab.coko.foundation/editoria/editoria.git
cd editoria
```

Make sure you use you use `node >= 8.3`. We provide `.envrc` and `.nvmrc` files for convenience.  

Install all dependencies.  
```sh
npm i
npm run bootstrap
```

Go to the app and create a database for it.  
```sh
cd packages/editoria-app
npm run setupdb
```

You should now have a `config/local-development.json` file.  
Edit that to connect to [INK](https://gitlab.coko.foundation/INK/ink-api).  
In this file, add the following:  
```json
"pubsweet-component-ink-backend": {
  "inkEndpoint": "< your-ink-api-endpoint >",
  "email": "< your-ink-email >",
  "password": "< your-ink-password >",
  "recipes": {
    "editoria-typescript": "< editoria-typescript-recipe-id >"
  }
}
```
Ensure that:
* the `<your-ink-api-endpoint>` in `local-development.json` ends with a trailing slash
* if INK is running as a service on a port, it is on port `3000`

You're good to go. Run the app with:  
```sh
npm start
```

If for some reason you want to delete all dependencies from all the packages:  
```sh
npm run clean
```
