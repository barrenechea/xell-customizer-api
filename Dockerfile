# Build stage - compile to single binary
FROM oven/bun:1-alpine AS builder

WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .

RUN bun run build

# Production stage - minimal Alpine image
FROM alpine:3.22 AS runtime

# Install only required runtime dependencies
RUN apk add --no-cache libgcc libstdc++ && \
    addgroup -g 1001 -S bun && \
    adduser -S bun -u 1001

WORKDIR /app

# Copy only the compiled binary
COPY --from=builder --chown=bun:bun /app/xell-api ./

# Switch to non-root user
USER bun

# Use environment variable for port configuration
ENV PORT=3000
EXPOSE ${PORT}

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT}/health || exit 1

CMD ["./xell-api"]
