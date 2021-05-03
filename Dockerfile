# --------------> The build image
FROM node:14 AS build
WORKDIR /usr/src/app
COPY package*.json ./
# Install all dependencies required for building app
RUN npm ci
# Copy build configuration files
COPY tsconfig*.json nest-cli.json ./
# Copy app code and build
COPY src src
RUN npm run build

# --------------> The production image
FROM node:14-alpine
RUN apk add dumb-init
ENV NODE_ENV production
# Set user and apply folder permissions
WORKDIR /usr/src/app
RUN chown node:node ./
USER node
# Install production node modules
COPY --chown=node:node package*.json ./
RUN npm ci --only=production
# Install app built code
COPY --chown=node:node --from=build /usr/src/app/dist /usr/src/app/dist
EXPOSE 3000
ENTRYPOINT ["dumb-init", "node", "dist/main"]