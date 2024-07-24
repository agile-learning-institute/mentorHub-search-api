FROM node:21 AS build

#Install git (for branch/patch info)
WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
RUN npm run build

# Set Version BUILT_AT time
RUN echo $(date "+%Y-%m-%d:%H:%M:%S") > ./dist/BUILT_AT

# Final Stage
FROM node:16 AS run

# Default Environment Variable values
# ENV CONNECTION_STRING={"node":"https://@mentorhub-searchdb:9200","auth":{"username":"elastic","password":"o0=eLmmQbsrdEW89a-Id"},"tls":{"ca":"","rejectUnauthorized":false}}
#       see https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/client-connecting.html
# ENV API_PORT=8081

# Copy built assets from build stage 
RUN mkdir -p /opt/app && chown node:node /opt/app
WORKDIR /opt/app

COPY --from=build /app/dist /opt/app
COPY --from=build /app/node_modules /opt/app/node_modules

# Use non-root user
USER node

# Run the processor
CMD ["node", "server.js"]
