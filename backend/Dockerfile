FROM node:18 as build
WORKDIR /app

# Copy root and workspace package files
COPY package*.json ./
COPY shared/package*.json ./shared/
COPY backend/package*.json ./backend/

# Install all workspace dependencies
RUN npm ci

# Copy source
COPY shared/ ./shared/
COPY backend/ ./backend/

# Build: shared first, then backend
ENV DISABLE_ESLINT_PLUGIN=true
RUN npm run -w shared build \
 && npm run -w backend build \
 && rm -rf shared/src backend/src

FROM node:18
COPY --from=build /app /app
WORKDIR /app/backend
EXPOSE 5001
CMD npm run migration:production wait-and-up && npm run start:production
