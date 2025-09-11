COMMIT=${TRAVIS_COMMIT::8}
SANITIZED_BRANCH=$(echo $TRAVIS_BRANCH|sed 's|/|-|g')
REPO=us-west2-docker.pkg.dev/askdarcel-184805/sheltertech/askdarcel-web

# Configure Docker to use gcloud as a credential helper for Artifact Registry
gcloud auth configure-docker us-west2-docker.pkg.dev

if [[ -n "$TRAVIS_TAG" ]]; then
    TAG="$TRAVIS_TAG"
    ALGOLIA_INDEX_PREFIX="production"
else
    if [ "$TRAVIS_PULL_REQUEST" != "false" ]; then
        TAG="pull-request-$TRAVIS_PULL_REQUEST"
    else
        if [ "$SANITIZED_BRANCH" == "master" ]; then
            TAG="latest"
            ALGOLIA_INDEX_PREFIX="staging"
        else
            TAG="branch-$SANITIZED_BRANCH"
        fi
    fi
fi

echo "{
  \"commit\": \"$COMMIT\",
  \"image\": \"$TAG\",
  \"build\": \"$TRAVIS_BUILD_NUMBER\"
}" > version.json

CONFIG_YAML=config.docker.yml npm run build

docker build -f Dockerfile -t $REPO:$TAG .
echo "Pushing tags for '$TAG'"
docker push $REPO
