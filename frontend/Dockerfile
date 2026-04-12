FROM node:18 as build
WORKDIR /app

# Copy root and workspace package files
COPY package*.json ./
COPY shared/package*.json ./shared/
COPY frontend/package*.json ./frontend/

# Install all workspace dependencies
RUN npm ci

# Copy source
COPY shared/ ./shared/
COPY frontend/ ./frontend/

# Build: shared first, then frontend
ARG SERVER_DOMAIN
ENV REACT_APP_ROOT_DOMAIN=${SERVER_DOMAIN}
ARG API_DOMAIN
ENV REACT_APP_API_DOMAIN=${API_DOMAIN}
ARG MEDIA_HOSTING_URL
ENV REACT_APP_MEDIA_HOSTING_URL=${MEDIA_HOSTING_URL}
ARG VAPID_PUBLIC_KEY
ENV REACT_APP_VAPID_PUBLIC_KEY=${VAPID_PUBLIC_KEY}
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
ENV DISABLE_ESLINT_PLUGIN=true
RUN npm run -w shared build \
 && npm run -w frontend build \
 && cp -r frontend/build /build

WORKDIR /build
RUN rm -rf /app

FROM node:18
COPY --from=build /build /build
CMD rm -rf /frontend/* && cp -r /build/. /frontend/ && ls /frontend
