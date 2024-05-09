if !([[ -d "./src/docker" ]] && [[ -d "./src/middleware" ]]); then 
    echo "This script must be run from the repository root folder"
    exit 1
fi

mh down
mh up search-db
#  sleep for 15 seconds; this is to ensure that the elasticsearch container is up and running before the script is executed, adjust as needed
sleep 15

rm -r node_modules
npm i
# build
npm run build
 
export ELASTICSEARCH_PROTOCOL=https
export ELASTICSEARCH_HOST=localhost
export API_PORT=8081
export ELASTICSEARCH_PORT=9200
export INDEX_NAME=search-index
export CONNECTION_TIMEOUT=10
npm run build && node ./dist/bundle.js