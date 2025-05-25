# Build stage
FROM node:18 AS builder

WORKDIR /app

COPY frontend/ /app/

RUN npm install && npm run build

# Serve stage
FROM nginx:alpine

COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80
