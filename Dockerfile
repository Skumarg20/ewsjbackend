# Stage 1: Build Stage
FROM node:22 AS builder
WORKDIR /usr/src/app

# Copy package.json and package-lock.json for efficient caching
COPY package*.json ./

# Install dependencies (only production dependencies for efficiency)
RUN npm install --legacy-peer-deps

# Copy the application files
COPY . .

# Build the NestJS application
RUN npm run build

# Stage 2: Production Stage
FROM node:22 AS runner
WORKDIR /usr/src/app

# Set environment variable
ENV NODE_ENV=production

# Copy built files and required dependencies from builder stage
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package*.json ./

# Expose the application port
EXPOSE 5000

# Run the application in production mode
CMD ["npm", "run", "start:prod"]