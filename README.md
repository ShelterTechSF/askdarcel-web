# ShelterTech Web App [![Travis CI Status](https://travis-ci.org/ShelterTechSF/askdarcel-web.svg?branch=master)](https://travis-ci.org/ShelterTechSF/askdarcel-web)

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
$ npm install
```

To build the bundled script with webpack run

```sh
$ npm run build
```

And to run the dev server, run

```sh
$ npm run dev
```

## Branches and Deployments

There are two protected branches - development and main. Main is the default branch which will be the latest, stable codebase. Development will be where updates get deployed to a staging instance where QA can be performed. Any PR's created against these branches run a series of checks - like building the app, running unit tests, and linting the files.

There are two live instances - a [staging instance](https://our415-staging-a91cdc6d7b2b.herokuapp.com/) and a [production instance](https://our415-abb7eecb7449.herokuapp.com/). Merges onto the development branch deploys the development branch to the staging isntance. Merges onto the main branch deploys the main branch to the production instance. See the [github workflows](https://github.com/Exygy/askdarcel-web/tree/main/.github/workflows) for the details. Environment variables used in the deployments are set in github environments - 'prod' supplies the production instance and 'dev' supplies the staging instance..

## Testing

We use [Jest](https://jestjs.io/) as a test runner and [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) for component testing. Developers should become familiar with these tools.

Tests files should be co-located next to the source file in the file system and use the name of their source file with the suffix `*.test.tsx`.

```
app
└── components
    ├── MyComponent.tsx
    └── MyComponent.test.tsx
```

To run tests:

```sh
$ npm run test # Run all tests and exit
$ npm run test:watch # Watch files for changes and rerun tests related to changed files
$ npm run test:watch:all # Watch files for changes and rerun all tests when something changes
```

### Acceptance testing

We do not currently support high-level acceptance testing that simulates
workflows that cannot be tested through React Testing Library.

## Troubleshooting

### Error: spawn heroku ENOENT

If the `build_and_deploy_app` github action fails with this message during the
release step, you can manually release the docker container to heroku with the
following command:

```
$ heroku container:release web --app our415
```
