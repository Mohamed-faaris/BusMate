# syntax=docker/dockerfile:1

ARG NODE_VERSION=22.14.0
ARG PNPM_VERSION=10.9.0

FROM node:${NODE_VERSION}-alpine

ENV NODE_ENV production

# Install pnpm
RUN --mount=type=cache,target=/root/.npm \
    npm install -g pnpm@${PNPM_VERSION}

WORKDIR /app

# Copy only the package files first
COPY package.json pnpm-lock.yaml ./

# Install dependencies (including devDeps for build)
RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

# Copy the rest of the app
COPY . .

# Build Next.js app
RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm build

# Use non-root user for security
USER node

# Expose Next.js default port
EXPOSE 3000

# Start the app
CMD ["pnpm", "start"]
