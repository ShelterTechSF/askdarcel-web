FROM nginx:stable

WORKDIR /app/askdarcel

# Copy build files
COPY ./build /app/askdarcel

RUN rm /etc/nginx/conf.d/*

COPY ./docker/templates/default.conf.template /etc/nginx/templates/default.conf.template

CMD ["nginx", "-g", "daemon off;"]
