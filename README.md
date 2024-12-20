# mentorhub-search-api

## Overview

This is a simple Typescript API that provides search results from the elasticsearch database. This API uses data from the mentorhub [backing Elasticsearch Database](https://github.com/agile-learning-institute/mentorHub-elasticsearch).

The OpenAPI specifications for the API can be found in the ``docs`` folder, and are served [here](https://agile-learning-institute.github.io/mentorHub-search-api/)

## Prerequisites

- [MentorHub Developer Edition](https://github.com/agile-learning-institute/mentorHub/tree/main/mentorHub-developer-edition) - to easily run the containers locally
- [NodeJS and NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) - to build and run the API
- [StepCI](https://stepci.com) to run black box testing

## Contributing

The typescript files found in `./src/` are used to configure and start an API that will listen to requests on port 8081. 

You can use [Kibana Console](http://localhost:5601/app/dev_tools#/console) to query the backing elasticsearch database. 

### Install dependencies
```bash
npm install
```

### Compile Typescript code
```bash
npm run build
```

### Run Jest Unit Tests
```bash
npm run test
```

### Start the API locally
NOTE: This will down/up backing services
```bash
npm run start
```

### Run the API locally
NOTE: This assumes backing services are running
```bash
npm run local
```

### Build and run the container
NOTE: This will down/up backing services
```bash
npm run container
```

### Just build the container
```bash
npm run precontainer
```

### Run black box testing
NOTE: This assumes backing services and the API are running, either locally or in a container
```bash
npm run stepci
```

### Run performance/load testing
NOTE: This assumes backing services and the API are running, either locally or in a container
```bash
npm run load
```

## Local API Testing with CURL
In addition to the stepci API testing above, you can use regular curl commands to test the API. 

### Simple one word search
```bash
curl 'localhost:8081/api/search?search=curriculum'
```

### Simple two word search
```bash
curl 'localhost:8081/api/search?search=inactive%20people'
```

### Elasticsearch Query
NOTE: The query is a json object, so it has to be http url encoded. The query below uses this query object. 
{ "match": { "lastName": "Smith" } }
```bash
curl 'localhost:8081/api/search?query=%7B%22match%22%3A%7B%22lastName%22%3A%22Smith%22%7D%7D'
```

### Get API health
```bash
curl "http://localhost:8081/api/health/"
```

### Get config information
```bash
curl "http://localhost:8081/api/config/"
```
