FROM node:12.4-alpine AS builder

# NPM Install for building
WORKDIR /usr/src/app
ADD package.json /usr/src/app
ADD package-lock.json /usr/src/app
RUN npm install

# Copy source files:
WORKDIR /usr/src/app
ADD src /usr/src/app/src
ADD public /usr/src/app/public

# Define build arguments
ARG REACT_APP_FOO=${REACT_APP_FOO}
ARG REACT_APP_HASURA_URL=${REACT_APP_HASURA_URL}

# Build:
WORKDIR /usr/src/app
RUN npm run build

FROM nginx:1.19.2 AS runner
COPY --from=builder /usr/src/app/build /usr/share/nginx/html
ADD nginx.conf /etc/nginx/nginx.conf