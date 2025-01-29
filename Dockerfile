# Use Node.js for building the app
FROM node:18 AS builder

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
