set -e
CUR_VERSION=`node build/get-ddder-version.js -c`
NEXT_VERSION=`node build/get-ddder-version.js`

echo "Current: $CUR_VERSION"
read -p "Enter new version ($NEXT_VERSION): " -n 1 -r
if ! [[ -z $REPLY ]]; then
  NEXT_VERSION=$REPLY
fi

read -p "Releasing ddder-vue-framework@$NEXT_VERSION - are you sure? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo "Releasing ddder-vue-framework@$NEXT_VERSION ..."
#  npm run lint
#  npm run flow
#  npm run test:ddder

  # build
  DDDER_VERSION=$NEXT_VERSION npm run build:ddder

  # update package
  cd packages/ddder-vue-framework
  npm version $NEXT_VERSION
#  npm publish
  cd -

  # commit
#  git add src/platforms/ddder*
#  git add packages/ddder*
#  git commit -m "[release] ddder-vue-framework@$NEXT_VERSION"
fi
