## Overview

Editoria is a book production platform, built with [Pubsweet](https://gitlab.coko.foundation/pubsweet/) and [Substance](http://substance.io/).  
This application is being developed by the [Coko Foundation](https://coko.foundation/), for the [University of California Press](http://www.ucpress.edu/).  

## Requirements

Node >= 7.6  
npm >= 3  

## Installation

First you need to clone this repository on your machine.  
```git clone git@gitlab.coko.foundation:editoria/editoria.git```  
or the ```https``` equivalent:  
```git clone https://gitlab.coko.foundation/editoria/editoria.git```  

Once you have, navigate to the project's root directory.  
```cd editoria```  

This application requires node 7.6 or greater.  
If you use nvm for managing different node versions, the project includes an ```.nvmrc``` file that you can take advantage of.  
The application has been tested with node 7.9 .  

Install the project's dependencies.  
```npm install```  

Create a database.  
```npm run setupdb```  

Follow the instructions, create the administrator user and name your first book.  

Editoria uses [INK](https://gitlab.coko.foundation/INK/ink-api) in order to convert word files into our custom variant of HTML, [Editoria Typescript](https://gitlab.coko.foundation/XSweet/editoria_typescript).  

For this to work, you need a valid username and password for a running INK instance on a server.  
To use these credentials in Editoria, you need to pass the app three enviroment variables, namely `INK_ENDPOINT`, `INK_USERNAME` and `INK_PASSWORD`.  
You can pass those in the `.env.production` file that you'll find in the project's root directory.  
Please note that this file will be generated automatically the first time you run the `setupdb` command.  
You'll find a sample configuration in the [.env.sample](https://gitlab.coko.foundation/editoria/editoria/blob/master/.env.sample) file in the root directory.  

<!--- We provide default valid credentials already for demo purposes on our own INK instance.   --->
<!--- If you simply want to try this out, you can uncomment the `INK_USERNAME`, `INK_PASSWORD` and `INK_ENDPOINT` environment variables in the `.env.production` file.   --->

Once that is done, you can run the app like so:  
```npm start```  

## Set up

Log in as an administrator, and click on the "Teams" link in the navigation bar.  

You can now assign different users to different roles.  
If a user is a production editor, the user can then also edit user roles for all other users.  

You're good to go!  
