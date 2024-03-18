FROM node:21 AS build

#Install git (for branch/patch info)
RUN apt-get update && apt-get install -y git
WORKDIR /app
COPY package*.json .
RUN npm install
RUN mkdir dist
COPY . .

RUN npm run build

# Get branch and patch level, then create VERSION.txt file
RUN BRANCH=$(git rev-parse --abbrev-ref HEAD) && \
    PATCH=$(git rev-parse HEAD) && \
    DATE=$(date) && \
    echo $DATE.$BRANCH.$PATCH > ./dist/VERSION.txt


# Stage 2: Run the app in a lightweight image
FROM node:21-alpine as deploy

ENV PROTOCOL=http
ENV HOST=localhost
ENV AUTH=admin:admin
ENV PORT=8081
ENV OPENSEARCH_PORT=9200
ENV INDEX_NAME=search-index
ENV CONNECTION_TIMEOUT=10
ENV CONNECTION_STRING=http://admin:admin@mentorhub-searchdb:9200

WORKDIR /app

COPY --from=build /app/dist .
ENTRYPOINT ["/bin/sh", "-c", "/app/entrypoint.sh"]
