# Use Node.js for the build stage
FROM node:18 AS builder

ARG GOOGLE_API_KEY
ARG ALGOLIA_INDEX_PREFIX
ARG ALGOLIA_APPLICATION_ID
ARG ALGOLIA_READ_ONLY_API_KEY
ARG AUTH0_AUDIENCE
ARG AUTH0_CLIENT_ID
ARG AUTH0_DOMAIN
ARG AUTH0_REDIRECT_URI
ARG STRAPI_API_TOKEN
ARG STRAPI_API_URL
ARG API_URL
ARG API_PROXY_SECURE
ARG API_PROXY_CHANGE_ORIGIN
ARG API_PROXY_REWRITE
ARG NGINX_API_GO_URL
ARG NGINX_API_URL
ARG NGINX_PROXY_HOST_HEADER
ARG NGINX_SERVER_NAME

WORKDIR /app

# Copy package files first (to optimize caching)
COPY package*.json ./

# Install dependencies
RUN npm install --frozen-lockfile

# Copy source files
COPY . .

# Build the app
RUN npm run build

# Use nginx for the final runtime container
FROM nginx:stable

WORKDIR /app/askdarcel

# Copy build files
COPY ./build /app/askdarcel

# Install envsubst for runtime variable substitution
RUN apt-get update && apt-get install -y gettext-base

# Create config directory
RUN mkdir -p /app/config

# Create a template config file
RUN echo 'GOOGLE_API_KEY: "${GOOGLE_API_KEY}"\n\
ALGOLIA_INDEX_PREFIX: "${ALGOLIA_INDEX_PREFIX}"\n\
ALGOLIA_APPLICATION_ID: "${ALGOLIA_APPLICATION_ID}"\n\
ALGOLIA_READ_ONLY_API_KEY: "${ALGOLIA_READ_ONLY_API_KEY}"\n\
AUTH0_AUDIENCE: "${AUTH0_AUDIENCE}"\n\
AUTH0_CLIENT_ID: "${AUTH0_CLIENT_ID}"\n\
AUTH0_DOMAIN: "${AUTH0_DOMAIN}"\n\
AUTH0_REDIRECT_URI: "${AUTH0_REDIRECT_URI}"\n\
STRAPI_API_TOKEN: "${STRAPI_API_TOKEN}"\n\
STRAPI_API_URL: "${STRAPI_API_URL}"\n\
API_URL: "${API_URL}"\n\
API_PROXY_SECURE: "${API_PROXY_SECURE}"\n\
API_PROXY_CHANGE_ORIGIN: "${API_PROXY_CHANGE_ORIGIN}"\n\
API_PROXY_REWRITE: "${API_PROXY_REWRITE}"' > /app/config.yml.template

# Copy nginx config
RUN rm /etc/nginx/conf.d/*

COPY ./docker/templates/default.conf.template /etc/nginx/templates/default.conf.template

# Create entrypoint script to generate config.yml dynamically
RUN echo '#!/bin/sh\n\
envsubst < /app/config.yml.template > /app/config.yml\n\
exec "$@"' > /entrypoint.sh

# Make entrypoint script executable
RUN chmod +x /entrypoint.sh

# Set entrypoint script to ensure config.yml is generated at runtime
ENTRYPOINT ["/entrypoint.sh"]

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
