if !([[ -d "./src/docker" ]] && [[ -d "./src/middleware" ]]); then 
    echo "This script must be run from the repository root folder"
    exit 1
fi

mh down
mh up opensearchonly
#  sleep for 15 seconds; this is to ensure that the opensearch container is up and running before the script is executed, adjust as needed
sleep 15

rm -r node_modules
npm i
# build
npm run build
 
export PROTOCOL=http
export HOST=localhost
export AUTH=admin:admin
export PORT=8081
export OPENSEARCH_PORT=9200
export INDEX_NAME=search-index
export CONNECTION_TIMEOUT=10
cp ./src/entrypoint.sh ./dist/
cd ./dist/
./entrypoint.sh
