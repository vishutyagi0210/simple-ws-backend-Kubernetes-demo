FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build   

################################# second stage #######################

FROM node:18-alpine AS prod

WORKDIR /app

COPY package*.json ./

RUN npm ci --production

COPY --FROM=builder /app/dist ./dist

RUN addgroup -g 1001 -S nodejs && \
    adduser -S -u 1001 -G nodejs ws

RUN chown -R ws:nodejs /app

CMD ["nodejs" , "dist/index.js"]