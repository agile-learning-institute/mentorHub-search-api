# mentorhub-search-api
# DISCLAIMER
The Opensearch container is quite big, roughly 1.3 GB. This might present a problem for those on a metered connection looking to contribute.

## Overview

This is a simple Typescript API that provides search results from the search database. This API uses data from a [backing Opensearch Database](https://github.com/agile-learning-institute/mentorHub-search-opensearch).

[Here](https://github.com/orgs/agile-learning-institute/repositories?q=mentorhub-&type=all&sort=name) are all of the repositories in the [mentorHub](https://github.com/agile-learning-institute/mentorhub/tree/main) system
The OpenAPI specifications for the API can be found in the ``docs`` folder, and are served [here](https://agile-learning-institute.github.io/mentorHub-search-api/)
## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### Optionally
- [MentorHub Developer Edition](https://github.com/agile-learning-institute/mentorHub/tree/main/mentorHub-developer-edition) - to easily run the containers locally
- [NodeJS and NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) - to build and run the data ingestion script locally

### Customize configuration

See [Tsconfig Reference](https://www.typescriptlang.org/tsconfig)

## Contributing

The typescript files found in `./src/` are used to configure and start an API that will listen to requests on port 8081.  to install dependencies and run locally. You can run the backing service with 
```bash
mh up opensearchonly
```
or if you don't have MentorHub Developer Edition installed:
```bash
docker run -d -p 9200:9200 -e "discovery.type=single-node" -e "plugins.security.disabled=true" -e "OPENSEARCH_INITIAL_ADMIN_PASSWORD:Z3i**BEl6YTJsDKrK3AgVO" opensearchproject/opensearch:2.12.0
```
## Build and test the container

Use the following command to build and run the container locally. See [here for details](https://github.com/agile-learning-institute/mentorhub/blob/main/docker-compose/README.md) on how to stop/start the database.

```bash
../src/docker/docker-build.sh
```

After that command completes successfully you can verify it worked successfully by [running curl tests](#local-api-testing-with-curl) or [postman](#testing-the-api-with-postman) to confirm the build.

## Local API Testing with CURL

### Get search results
Note: You can change the `"query: jame"` header to another query. Just replace the text on the right-side of the colon. `"query: <your-query>"`
```bash
curl -X GET "http://localhost:8081/api/search/" -H  "accept: application/json" -H  "query: jame"
```

### Get API health

```bash
curl -X GET "http://localhost:8081/api/health/" -H  "accept: */*"
```
### Get config information

```bash
curl -X GET "http://localhost:8081/api/config/" -H  "accept: */* "
```

## Testing the API with Postman

1. Download and install Postman from [here](https://www.postman.com/downloads/).
2. Clone or download this repository to your local machine.
3. Open Postman.
4. Click on the "Import" button in the top left corner.
5. Select "Import From File" and choose the downloaded JSON file (`search-api.postman_collection.json`).
6. The collection will be imported into Postman. You can now explore and test the API endpoints.

