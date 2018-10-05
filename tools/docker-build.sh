COMMIT=${TRAVIS_COMMIT::8}
SANITIZED_BRANCH=$(echo $TRAVIS_BRANCH|sed 's|/|-|g')
REPO=sheltertechsf/askdarcel-web

docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD

if [[ -n "$TRAVIS_TAG" ]]; then
    TAG="dev-$TRAVIS_TAG"
else
    if [ "$TRAVIS_PULL_REQUEST" != "false" ]; then
        TAG="pull-request-$TRAVIS_PULL_REQUEST"
    else
        if [ "$SANITIZED_BRANCH" == "master" ]; then
            TAG="latest"
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
