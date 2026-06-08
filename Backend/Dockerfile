FROM node:22-alpine AS base

WORKDIR /app

RUN apk add --no-cache openssl

FROM base AS development

ENV NODE_ENV=development

COPY package*.json ./
COPY prisma ./prisma

RUN npm ci

COPY . .

RUN npx prisma generate

CMD ["npm", "run", "start:dev"]

FROM development AS builder

RUN npm run build
RUN npm prune --omit=dev

FROM base AS production

ENV NODE_ENV=production

COPY package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

CMD ["node", "dist/main"]
