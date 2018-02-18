# ShelterTech Web App [![Travis CI Status](https://travis-ci.org/ShelterTechSF/askdarcel-web.svg?branch=master)](https://travis-ci.org/ShelterTechSF/askdarcel-web)

[![Sauce Test Status](https://saucelabs.com/browser-matrix/askdarcel-web-master.svg)](https://saucelabs.com/u/askdarcel-web-master)

## Docker-based Development Set-up Instructions (Recommended)

### Requirements

Docker Community Edition (CE) >= 17.06
Docker Compose >= 1.18

Follow the [Docker installation instructions](https://www.docker.com/products/overview) for your OS.

### Set up the project

This is not a full guide to Docker and Docker Compose, so please consult other
guides to learn more about those tools.

The docker-compose.yml is configured to mount the git repo on your host
filesystem into the Docker container so that any changes you make on your host
machine will be synced into the container and vice versa.

```sh
# Install node dependencies
# docker-compose run --rm web npm install

# Build static assets bundle
# docker-compose run --rm web npm build

# Run dev server
# docker-compose up
```

You should be able to view the web app in your browser at http://localhost:8080.

By default, this assumes that you have also set up askdarcel-api project using
the Docker setup instructions and that the API server is running. If you want to
target a different instance of askdarcel-api, you can modify the `API_URL`
environment variable in docker-compose.yml.

## Non-Docker Set-up Instructions

### Installing Node.js and npm
We recommend using [nvm](https://github.com/creationix/nvm) (Node Version
Manager) or Docker to ensure that the versions of Node.js and npm are the same
across development, Travis CI, staging, and production environments.

After installing nvm, to install both Node.js and npm run from the top of the
git repo:

```sh
$ nvm install  # Reads from .nvmrc
$ npm install -g npm@5.2.0  # Make sure this matches .travis.yml
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

## End to end testing
#### Quick summary of what TestCafe is and how it works

It's a framework for running end-to-end tests (read: real browser tests) that injects your tests onto an existing web page. Architecturally, they spin up a lightweight proxy server that wraps your web page, and when you connect a browser to the proxy server, it serves the requested page with the test driver injected into it.

It's essentially an alternative to writing Selenium tests, and I've found it nice to use because it mimics many of the common HTML5 DOM APIs and because they've added a lot of reasonable default behavior that Selenium lacks, such as properly waiting for events to finish running and for elements to appear before running your assertions.

#### How to run

If you are not using Docker and all the services are bound to localhost, then you should just be able to run:
```
$ npm run testcafe -- --skip-js-errors chrome testcafe/*.js
```

Note: Make sure you have the dev server running (`npm run dev`) before you try running the above

If you are using Docker, then you'll need to run it somewhat like this:

```
$ docker run --rm -v $PWD:/usr/src/app -p 1337:1337 -e BASE_URL=>URL_TO_ASKDARCEL_WEB> -w /usr/src/app node npm run testcafe -- --skip-js-errors remote --skip-js-errors --hostname localhost --ports 1337,1338
```
This will spin up a web server at http://localhost:1337/ and print out a URL to use. You should manually enter it into your browser to start the tests.
