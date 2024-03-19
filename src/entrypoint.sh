#!/bin/sh
echo "##############################################"
VERSION=$(cat VERSION.txt)
echo "VERSION: $VERSION"
echo "##############################################"
echo "OPENSEARCH PROTOCOL: $OPENSEARCH_PROTOCOL"
echo "OPENSEARCH HOST: $OPENSEARCH_HOST"
echo "OPENSEARCH AUTH: $OPENSEARCH_AUTH"
echo "OPENSEARCH PORT: $OPENSEARCH_PORT"
echo "API PORT: $API_PORT"
echo "OPENSEARCH_INDEX: $INDEX_NAME"
node bundle.js
