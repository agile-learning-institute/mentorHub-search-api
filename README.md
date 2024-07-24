# mentorhub-search-api
# DISCLAIMER
The Opensearch container is quite big, roughly 1.3 GB. This might present a problem for those on a metered connection looking to contribute.

## Overview

This is a simple Typescript API that provides search results from the search database. This API uses data from a [backing Opensearch Database](https://github.com/agile-learning-institute/mentorHub-search-opensearch).

The OpenAPI specifications for the API can be found in the ``docs`` folder, and are served [here](https://agile-learning-institute.github.io/mentorHub-search-api/)

## Prerequisites

- [MentorHub Developer Edition](https://github.com/agile-learning-institute/mentorHub/tree/main/mentorHub-developer-edition) - to easily run the containers locally
- [NodeJS and NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) - to build and run the API
- [StepCI](https://stepci.com) to run black box testing

## Contributing

The typescript files found in `./src/` are used to configure and start an API that will listen to requests on port 8081.  

### Install dependencies
```bash
npm install
```

### Run Jest Unit Tests
```bash
npm run test
```

### Run the API locally
```bash
npm run start
```

### Build and run the container
```bash
npm run container
```

### Run black box testing
```bash
npm run stepci
```
NOTE: This assumes that the API is running at localhost:8081. You can acomplish this with ``npm run start`` or ``npm run container``

## Local API Testing with CURL
In addition to the stepci API testing above, you can use regular curl commands to test the API. 

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
