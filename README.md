# ShelterTech Web App


## Installation

### Installing Node.js and npm
We recommend using [nvm](https://github.com/creationix/nvm) (Node Version
Manager) or Docker to ensure that the versions of Node.js and npm are the same
across development, Travis CI, staging, and production environments.

After installing nvm, to install both Node.js and npm run from the top of the
git repo:

```sh
$ nvm install  # Reads from .nvmrc
```

### Installing npm dependencies
To install the dependencies, from the top directory run
```sh
npm install
``` 
To build the bundled script with webpack run 
```sh
npm run build
``` 
And to run the dev server, run 
```sh
npm run dev
``` 
