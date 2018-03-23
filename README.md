# Editoria  

This is the Editoria monorepo.  

It consists of the main Editoria application, as well as the different [Pubsweet](https://gitlab.coko.foundation/pubsweet) components and helper libraries that the app is made of.  

This application is being developed by the [Coko Foundation](https://coko.foundation/), for the [University of California Press](http://www.ucpress.edu/).  
For more information, visit the project's [website](https://editoria.pub/) or our [chat channel](https://mattermost.coko.foundation/coko/channels/editoria).  
For the editor that Editoria uses, see its related project [Wax](https://gitlab.coko.foundation/wax/wax).  

## Roadmap

The current features on our list are the following:

|Module       |Description                              |In progress  |Issue|
|:--:         |--                                       |:--:         |:--:|
|System       |Implement roles & authorization          |             |#57|
|System       |Integrate with Manifold                  |             |#2|
|Editor       |Improve editor performane                |&#x2714;     ||
|Editor       |Image captions                           |             |#84|
|Editor       |Keyboard shortcuts to add diacritics     |             ||
|Editor       |Turn spell-check on and off              |             ||
|Editor       |Small caps style                         |             ||
|Editor       |Track spaces                             |             ||
|Editor       |Track inline formatting (eg. italics)    |             ||
|Editor       |Track block formatting (eg. headings)    |             ||
|Editor       |Expand set of special characters         |             ||
|Editor       |Text highlighter                         |             ||
|Editor       |Arrow navigation between notes           |             ||
|Editor       |Update note icon in toolbar              |             ||
|Editor       |Increase font size for text              |             ||
|Book builder |Redesign component state tool            |             |#55|

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

You're good to go. Run the app with:  
```sh
npm start
```

If for some reason you want to delete all dependencies from all the packages:  
```sh
npm run clean
```
