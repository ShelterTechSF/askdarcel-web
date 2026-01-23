# tiller is not compatible with Ruby 3.2.0, so we have to stay on the latest
# Debian Bookworm release of nginx until we can migrate off tiller.
FROM nginx:1.28.0-bookworm

RUN apt-get update && apt-get -y install ruby && gem install tiller

COPY build /app/askdarcel
COPY version.json /app/askdarcel/_version.json
COPY tools/replace-environment-config.sh /app/askdarcel

RUN rm /etc/nginx/conf.d/*

ADD docker/tiller /etc/tiller

CMD ["tiller", "-v"]
ENTRYPOINT ["/app/askdarcel/replace-environment-config.sh", "/app/askdarcel/bundle.js"]
