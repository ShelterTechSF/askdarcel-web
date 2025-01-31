# Use Node.js for building the app
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

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install --frozen-lockfile

# Copy the entire app source code
COPY . .

# Build the app
RUN npm run build


# Use nginx for serving the built files
FROM nginx:stable

WORKDIR /app/askdarcel

# Copy built files from the previous build stage
COPY --from=builder /app/build /app/askdarcel

# Remove default nginx config
RUN rm /etc/nginx/conf.d/*

# Copy custom nginx config
COPY ./docker/templates/default.conf.template /etc/nginx/templates/default.conf.template

CMD ["nginx", "-g", "daemon off;"]
