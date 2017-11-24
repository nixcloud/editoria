## Editoria  

This is the Editoria monorepo.  

It consists of the main Editoria application, as well as the different [Pubsweet](https://gitlab.coko.foundation/pubsweet) components and helper libraries that the app is made of.  

### Get up and running  

Get your copy of the repository.  
```sh
git clone https://gitlab.coko.foundation/editoria/editoria.git
cd editoria
```

Install all dependencies.  
```sh
npm i
npm run bootstrap
```

Go to the app and create a database for it.  
```sh
cd packages/editoria-app
npm run setupdb -- --dev
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
