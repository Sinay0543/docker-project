# Lightweight official Node.js image
FROM node:20-alpine

WORKDIR /app

# Copy dependency manifests first to benefit from Docker layer caching
COPY package*.json ./

# Install production dependencies only
RUN npm ci --omit=dev && npm cache clean --force

# Copy the application source
COPY src/ ./src/

ENV NODE_ENV=production
ENV PORT=3000

# Run as the unprivileged "node" user shipped with the image
USER node

EXPOSE 3000

# Mark the container unhealthy if /health stops answering
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/health || exit 1

# Start node directly (not through npm) so it receives SIGTERM on "docker stop"
CMD ["node", "src/app.js"]
