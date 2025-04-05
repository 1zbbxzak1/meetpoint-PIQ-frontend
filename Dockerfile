FROM node:22.14.0 as build

WORKDIR /app/src
COPY package*.json ./

RUN npm install -g @angular/cli
RUN npm install --legacy-peer-deps

COPY . ./

RUN npm run build

FROM node:22.14.0

WORKDIR /usr/app
COPY --from=build /app/src/dist/meetpoint-piq-frontend/ ./

CMD node server/server.mjs
EXPOSE 4200
