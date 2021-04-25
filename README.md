# ShelterTech Web App [![Travis CI Status](https://travis-ci.org/ShelterTechSF/askdarcel-web.svg?branch=master)](https://travis-ci.org/ShelterTechSF/askdarcel-web)

## Sauce Labs Browser Test Status
[![Sauce Test Status](https://saucelabs.com/browser-matrix/askdarcel-web-master.svg)](https://saucelabs.com/u/askdarcel-web-master)


## Onboarding Instructions

[Dev Role Description](https://www.notion.so/sheltertech/Developer-Engineer-Role-Description-ShelterTech-AskDarcel-SFServiceGuide-Tech-Team-7fd992a20f864698a43e3882a66338bb)

[Technical Onboarding & Team Guidelines](https://www.notion.so/sheltertech/Technical-Onboarding-and-Team-Guidelines-a06d5543495248bfb6f17e233330249e)


## Docker-based Development Environment (Recommended)

### Requirements

Docker Community Edition (CE) >= 17.06
Docker Compose >= 1.18

Follow the [Docker installation instructions](https://www.docker.com/community-edition#/download) for your OS.


### Set up the project

This is not a full guide to Docker and Docker Compose, so please consult other
guides to learn more about those tools.

The docker-compose.yml is configured to mount the git repo on your host
filesystem into the Docker container so that any changes you make on your host
machine will be synced into the container and vice versa.

#### Creating the `config.yml` file

All config should be added in a file called `config.yml`. A sample `config.example.yml` is provided, you need to copy it and edit any parts that ask you to enter in your own information.

```sh
$ cp config.example.yml config.yml

# Open it in your preferred text editor
```


##### Algolia
[Algolia](https://www.algolia.com/doc/guides/getting-started/what-is-algolia/) is used as our search engine and in order for it to operate properly for everyone, we each need our own [index](https://www.algolia.com/doc/guides/indexing/indexing-overview/).

- in `config.yml` set _your_ github username as the value for `ALGOLIA_INDEX_PREFIX`. This will point to the search index matching your local environment.


#### Building and running the application

```sh
# Install node dependencies
$ docker-compose run --rm web npm install

# Build static assets bundle
$ docker-compose run --rm web npm run build

# Run dev server
$ docker-compose up
```

You should be able to view the web app in your browser at http://localhost:8080.

By default, this assumes that you have also set up askdarcel-api project using
the Docker setup instructions and that the API server is running. If you want to
target a different instance of askdarcel-api, you can modify the `API_URL`
environment variable in docker-compose.yml.


#### Fully tearing down environment

In case you ever need to fully tear down your local development environment,
such as to do a fresh setup from a clean slate, you will need to run extra
commands to remove state that is stored in Docker. Removing the git repository
and re-cloning is _insufficient_ because some of the state is stored in Docker.

In particular, for performance reasons, we save NPM modules in a `node_modules/`
directory that is mounted from a Docker volume rather than bind mounting the
`node_modules/` directory from the host operating system (e.g. macOS). To delete
all the installed NPM modules, you will have to remove the Docker volume.

The following command will stop all running Docker containers, delete them, and
remove their volumes:

```sh
$ docker-compose down --remove-orphans --volumes
```

Note: When you run that command, you may get an error message about removing
networks:

```
ERROR: error while removing network: network askdarcel id
4c4713d7f42173843437de3b0051a9d7e7bc81eb18123993975c3cd5a9e0a38e has active
endpoints
```

If this happens, then you need to run `docker-compose stop` in the askdarcel-api
application first before running the `docker-compose down` command above.

## Non-Docker Development Environment

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
$ docker-compose run --rm -p 1337:1337 -e BASE_URL=http://web:8080 web npm run testcafe -- --skip-js-errors remote --skip-js-errors --hostname localhost --ports 1337,1338 ./testcafe/
```
This will spin up a web server at http://localhost:1337/ and print out a URL to use. You should manually enter it into your browser to start the tests.


## Big Thanks

Cross-browser Testing Platform and Open Source <3 Provided by [Sauce Labs](https://saucelabs.com)

[<img src="powered-by-sauce-labs-badges-red.svg" alt="Powered By Sauce Labs" width="200" />](https://saucelabs.com/)

