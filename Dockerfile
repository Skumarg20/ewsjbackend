# Base image for both stages
FROM node:20-alpine AS base

# Install build dependencies for bcrypt
RUN apk add --no-cache python3 make g++ linux-headers

WORKDIR /app
COPY package*.json ./
# Install dependencies (bcrypt will be rebuilt for Alpine)
RUN npm install
COPY . .

# Development stage
FROM base AS development
EXPOSE ${PORT}
CMD ["npm", "run", "start:dev"]

# Production stage
FROM base AS production
RUN npm run build
EXPOSE ${PORT}
CMD ["node", "dist/src/main"]