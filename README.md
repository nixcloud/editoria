# Editoria  

This is the Editoria monorepo.  

It consists of the main Editoria application, as well as the different [Pubsweet](https://gitlab.coko.foundation/pubsweet) components and helper libraries that the app is made of.  

This application is being developed by the [Coko Foundation](https://coko.foundation/), for the [University of California Press](http://www.ucpress.edu/).  
For more information, visit the project's [website](https://editoria.pub/) or our [chat channel](https://mattermost.coko.foundation/coko/channels/editoria).  
For the editor that Editoria uses, see its related project [Wax](https://gitlab.coko.foundation/wax/wax).  

## Roadmap

The current features on our list are the following:
* Unnumbered components in the body division (#50)
* Redesign the component state tool in the book builder (#55)
* Implement authorization (#57)
* Integrate with [Manifold](https://github.com/ManifoldScholar/manifold) (#2)
* Move smaller components to [pubsweet-ui](https://gitlab.coko.foundation/pubsweet/pubsweet/tree/master/packages/ui)

A lot of the features that end up in Editoria have to do with its editor, [Wax](https://gitlab.coko.foundation/wax/wax).  
So be sure to take a look at its roadmap to see what's coming next. 

You can also follow the tasklist of the testing process with UCP [here](#60)

## Get up and running  

Get your copy of the repository.  
```sh
git clone https://gitlab.coko.foundation/editoria/editoria.git
cd editoria
```

Make sure you use you use `node >= 8`. We provide `.envrc` and `.nvmrc` files for convenience.  

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
  "password": "< your-ink-password >"
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
