FROM node:18 as builder

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build


FROM node:slim

WORKDIR /usr/src/app

COPY package*.json ./

ENV NODE_ENV production

RUN npm ci --production

COPY --from=builder /usr/src/app/dist ./dist

CMD [ "node", "./dist/server.js" ]