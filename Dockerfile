# Development stage
FROM node:20 as development

WORKDIR /usr/src/app
COPY . .
RUN git submodule update --init
RUN npm install
CMD [ "npm", "run", "start" ]

# Builder stage
FROM development as builder
WORKDIR /usr/src/app

# Production stage
FROM alpine:latest as production
RUN apk --no-cache add nodejs ca-certificates
WORKDIR /root/
COPY --from=builder /usr/src/app ./
CMD node deploy-commands.js && node index.js