#!/bin/bash

# Read from environment variables and replace their values inside the JS bundle.
# This assumes that each variable before substitution has a value with the
# suffix _REPLACE_ME, e.g. GOOGLE_API_KEY: "GOOGLE_API_KEY_REPLACE_ME"

set -euo pipefail

js_bundle=$(find . -maxdepth 1 -type f -name "/app/askdarcel/bundle*.js" -print -quit)
shift

env_vars='AUTH0_AUDIENCE AUTH0_CLIENT_ID AUTH0_DOMAIN AUTH0_REDIRECT_URI GOOGLE_API_KEY ALGOLIA_INDEX_PREFIX ALGOLIA_APPLICATION_ID ALGOLIA_READ_ONLY_API_KEY MOHCD_SUBDOMAIN MOHCD_DOMAIN SFFAMILIES_DOMAIN LINKSF_DOMAIN'

for env_var in $env_vars; do
  env_var_value=$(eval echo \$$env_var)
  sed -i.bak "s/${env_var}_REPLACE_ME/${env_var_value}/g" $js_bundle
done

# Run remaining arguments as a normal command
exec "$@"
