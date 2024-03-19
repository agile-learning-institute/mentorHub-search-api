FROM node:21 AS build

#Install git (for branch/patch info)
RUN apt-get update && apt-get install -y git
WORKDIR /app
COPY package*.json .
RUN npm install
RUN mkdir dist
COPY . .
RUN mv /app/src/entrypoint.sh /app/dist

RUN npm run build

# Get branch and patch level, then create VERSION.txt file
RUN BRANCH=$(git rev-parse --abbrev-ref HEAD) && \
    DATE=$(date "+%Y-%m-%d:%H:%M:%S") && \
    echo $DATE.$BRANCH > ./dist/VERSION.txt

# Stage 2: Run the app in a lightweight image
FROM node:21-alpine as deploy

ENV OPENSEARCH_PROTOCOL=http
ENV OPENSEARCH_HOST=localhost
ENV OPENSEARCH_AUTH=admin:admin
ENV API_PORT=8081
ENV OPENSEARCH_PORT=9200
ENV INDEX_NAME=search-index
ENV CONNECTION_TIMEOUT=10
ENV CONNECTION_STRING=http://admin:admin@mentorhub-searchdb:9200

WORKDIR /app

COPY --from=build /app/dist .
ENTRYPOINT ["node", "bundle.js"]
