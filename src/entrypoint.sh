#!/bin/sh
echo "##############################################"
VERSION=$(cat VERSION.txt)
echo "VERSION: $VERSION"
echo "##############################################"
echo "PROTOCOL: $PROTOCOL"
echo "HOST: $HOST"
echo "AUTH: $AUTH"
echo "PORT: $PORT"
echo "OPENSEARCH_INDEX: $OPENSEARCH_INDEX"
node bundle.js
