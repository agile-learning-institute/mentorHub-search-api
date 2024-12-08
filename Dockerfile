FROM node:21 AS build

#Install git (for branch/patch info)
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Set Version BUILT_AT time
RUN echo $(date "+%Y-%m-%d:%H:%M:%S") > ./dist/BUILT_AT

# Final Stage
FROM node:16 AS run

# Default Environment Variable values in src/config/Config.ts

# Copy built assets from build stage 
RUN mkdir -p /opt/app && chown node:node /opt/app
WORKDIR /opt/app

COPY --from=build /app/dist /opt/app
COPY --from=build /app/node_modules /opt/app/node_modules

# Use non-root user
USER node

# Run the processor
CMD ["node", "server.js"]
