#   BUILD STAGE 1

FROM node:20.12.0 as node
WORKDIR /app

COPY . .

RUN npm install

RUN npm run build -- --configuration production

# STAGE 2
FROM nginx:alpine
COPY --from=node /app/dist/Bt.Algotrading.Web /usr/share/nginx/html