# Editoria  

This is the Editoria monorepo.  

It consists of the main Editoria application, as well as the different [Pubsweet](https://gitlab.coko.foundation/pubsweet) components and helper libraries that the app is made of.  

This application is being developed by the [Coko Foundation](https://coko.foundation/), for the [University of California Press](http://www.ucpress.edu/).  
For more information, visit the project's [website](https://editoria.pub/) or our [chat channel](https://mattermost.coko.foundation/coko/channels/editoria).  
For the editor that Editoria uses, see its related project [Wax](https://gitlab.coko.foundation/wax/wax).  

## Roadmap
The current features on our list are the following:

|Module             |Description                                    |In progress    |Done     |Issue|
|:----              |---                                            |:---:          |:---:    |:---:|
|**Current**|
|System| Edit Lock ||&#x2714;| #117|
|System             |Use docker containers for deployments          |               |         |#89|
|System             |Logger          |    &#x2714;           |         |#106|
|System             |Env variables          |    &#x2714;           |         |#104|
|Book builder       |Redesign component state tool                  |               |         |#55|
|Book builder       |Export EPUB                  |               |         |#79|
|Book builder       |Filenames for single uploads                  |               |         |#112|
|Editor| Code Block ||&#x2714;| wax/wax#174|
|Editor| Add ornament style |&#x2714;|| wax/wax#178|
|Export|Fix links ||| #100|
|Export|Fix image captions ||| #113|
|Export|Notes at the end of the book ||| #78|
||
|**Previous**|
|System             |Switch to Postgres                             |               |&#x2714; |#80|
|System             |Implement roles & authorization                |               |&#x2714; |#57|
|System             |Integrate with Manifold                        |               |         |#2|
|Book builder       |Introduce unnumbered chapters                  |               |&#x2714; |#50|
|Editor             |Improve editor performance                     |               |&#x2714; |wax/wax#120|
|Editor             |Image captions                                 |               |&#x2714; |wax/wax#127|
|Editor             |Keyboard shortcuts to add diacritics           |               |&#x2714; |wax/wax#129|
|Editor             |Turn spell-check on and off                    |               |&#x2714; |wax/wax#124|
|Editor             |Small caps style                               |               |&#x2714; |wax/wax#125|
|Editor             |Note callout deletion with track changes       |               |&#x2714; |wax/wax#36|
|Editor             |Cutting and pasting with track changes         |               |&#x2714; |wax/wax#15|
|Editor             |Track spaces                                   |               |&#x2714; |wax/wax#119|
|Editor             |Full Screen Mode                               |               |&#x2714; |wax/wax#150|
|Editor             |Track inline formatting (eg. italics)          |               |&#x2714;|wax/wax#160|
|Editor             |Track block formatting (eg. headings)          |               |         |wax/wax#40|
|Editor             |Expand set of special characters               |               |         |wax/wax#128|
|Editor             |Text highlighter                               |               |&#x2714; |wax/wax#18|
|Editor             |Arrow navigation between notes                 |               |&#x2714; |wax/wax#133|
|Editor             |Update note icon in toolbar                    |               |&#x2714; |wax/wax#126|
|Editor             |Increase font size for text                    |               |         |
|Document ingestion |Normalize en and em dashes, convert hyphens between numerals to en dashes|               |&#x2714; |XSweet/editoria_typescript#21
|Document ingestion |Clean up white space (around punctuation, multiple spaces)|               |&#x2714; |XSweet/editoria_typescript#21|
|Document ingestion |Convert series of periods to ellipses          |               |&#x2714; |XSweet/editoria_typescript#21
|Document ingestion |Normalize directional quotes and apostrophes   |               |&#x2714; |XSweet/editoria_typescript#21
|Document ingestion |Convert underlining and bolding to italics     |               |&#x2714; |XSweet/editoria_typescript#29, XSweet/editoria_typescript#21
|Document ingestion |Force punctuation to match formatting of preceding word|       |&#x2714; |XSweet/HTMLevator#3|
|Document ingestion |Improve header promotion                       |&#x2714;       |         |XSweet/XSweet#123|


## Get up and running  

Get your copy of the repository.  
```sh
git clone https://gitlab.coko.foundation/editoria/editoria.git
cd editoria
```

Make sure you use you use `node >= 8.3`.

### nvm
To determine which version of Node you are running type `node -v`. 
If the version is not 8.3 or greater you will need to use nvm to prescribe a specific node version. Installation of nvm is covered here https://github.com/creationix/nvm#installation

Once nvm is installed use the command `nvm install 8.3`

For further information on how to use nvm see https://www.sitepoint.com/quick-tip-multiple-versions-node-nvm/

### Install yarn
```sh
npm install -g yarn
```

### Install Dependencies
Install all dependencies and navigate to the editoria app folder.  
```sh
yarn
cd packages/editoria-app
```

Create a `config/local-development.json` file.  
Edit that to enter your database secret, as well as to connect to [INK](https://gitlab.coko.foundation/INK/ink-api).  
In this file, add the following:  
```json
{
    "pubsweet-server": {
        "secret": "<your-secret-here>"
    },
    "pubsweet-component-ink-backend": {
        "inkEndpoint": "< your-ink-api-endpoint >",
        "email": "< your-ink-email >",
        "password": "< your-ink-password >",
        "recipes": {
            "editoria-typescript": "< editoria-typescript-recipe-id >"
        }
    }
}
```
Ensure that:
* the `<your-ink-api-endpoint>` in `local-development.json` ends with a trailing slash
* if INK is running as a service on a port, it is on port `3000`

Create a database and enter credentials for an admin user account:
```sh
yarn resetdb
```

Follow the prompts to enter user credentials and complete the database setup.

_**Note**: If you want to use a non-default database, see [Pubsweet development setup](https://gitlab.coko.foundation/pubsweet/pubsweet/wikis/Development:%20setup#setup-2)._

Get the database docker container up and running:  
```sh
yarn start:services
```

You're good to go. Open a separate terminal in the same folder and run the app with:  
```sh
yarn server
```

## Developer info

see also the [Pubsweet wiki](https://gitlab.coko.foundation/pubsweet/pubsweet/wikis/home) for developer notes.
