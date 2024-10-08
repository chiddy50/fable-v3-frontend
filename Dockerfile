ARG NODE_VERSION=18


FROM node:${NODE_VERSION}-slim as base




WORKDIR /app

# # Build
# FROM base as build

COPY package*.json $WORKDIR/
RUN npm install --force

COPY . .

RUN npm run build

# # Run
# FROM base

RUN chmod +x docker/entrypoint.sh

EXPOSE 3000


CMD ["bash", "docker/entrypoint.sh"]
