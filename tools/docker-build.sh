COMMIT=${TRAVIS_COMMIT::8}
SANITIZED_BRANCH=$(echo $TRAVIS_BRANCH|sed 's|/|-|g')
REPO=sheltertechsf/askdarcel-web

docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD

if [[ -n "$TRAVIS_TAG" ]]; then
    TAG="$TRAVIS_TAG"
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

docker build -f Dockerfile -t $REPO:$COMMIT .
echo "Pushing tags for '$COMMIT', '$TAG', and 'travis-$TRAVIS_BUILD_NUMBER'"
docker tag $REPO:$COMMIT $REPO:$TAG
docker tag $REPO:$COMMIT $REPO:travis-$TRAVIS_BUILD_NUMBER
docker push $REPO
