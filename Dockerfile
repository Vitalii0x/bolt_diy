ARG BASE=node:20.18.0
FROM ${BASE} AS base

WORKDIR /app

# Install dependencies (this step is cached as long as the dependencies don't change)
COPY package.json pnpm-lock.yaml ./

#RUN npm install -g corepack@latest

#RUN corepack enable pnpm && pnpm install
RUN npm install -g pnpm && pnpm install

# Copy the rest of your app's source code
COPY . .

# Expose the port the app runs on
EXPOSE 5173

# Production image
FROM base AS bolt-ai-production

# Define environment variables with default values or let them be overridden
ARG KIMI_API_KEY
ARG VITE_LOG_LEVEL=debug
ARG DEFAULT_NUM_CTX
ARG VITE_GITHUB_ACCESS_TOKEN
ARG VITE_GITHUB_TOKEN_TYPE=classic

ENV WRANGLER_SEND_METRICS=false \
    KIMI_API_KEY=${KIMI_API_KEY} \
    VITE_LOG_LEVEL=${VITE_LOG_LEVEL} \
    DEFAULT_NUM_CTX=${DEFAULT_NUM_CTX} \
    VITE_GITHUB_ACCESS_TOKEN=${VITE_GITHUB_ACCESS_TOKEN} \
    VITE_GITHUB_TOKEN_TYPE=${VITE_GITHUB_TOKEN_TYPE} \
    RUNNING_IN_DOCKER=true

# Pre-configure wrangler to disable metrics
RUN mkdir -p /root/.config/.wrangler && \
    echo '{"enabled":false}' > /root/.config/.wrangler/metrics.json

RUN pnpm run build

CMD [ "pnpm", "run", "dockerstart"]

# Development image
FROM base AS bolt-ai-development

# Define the same environment variables for development
ARG KIMI_API_KEY
ARG VITE_LOG_LEVEL=debug
ARG DEFAULT_NUM_CTX
ARG VITE_GITHUB_ACCESS_TOKEN
ARG VITE_GITHUB_TOKEN_TYPE=classic

ENV KIMI_API_KEY=${KIMI_API_KEY} \
    VITE_LOG_LEVEL=${VITE_LOG_LEVEL} \
    DEFAULT_NUM_CTX=${DEFAULT_NUM_CTX} \
    VITE_GITHUB_ACCESS_TOKEN=${VITE_GITHUB_ACCESS_TOKEN} \
    VITE_GITHUB_TOKEN_TYPE=${VITE_GITHUB_TOKEN_TYPE} \
    RUNNING_IN_DOCKER=true

RUN mkdir -p ${WORKDIR}/run
CMD ["pnpm", "run", "dev", "--host"]
