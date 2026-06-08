# Stage 1: Build Angular Frontend
FROM node:22 AS frontend-build
WORKDIR /app/frontend
COPY frontend/Spotifake/package*.json ./
RUN npm install
COPY frontend/Spotifake/ ./
RUN npm run build -- --output-path=dist

# Stage 2: Node.js Backend
FROM node:22
WORKDIR /app/backend
COPY backend/spotifake/package*.json ./
RUN npm install
COPY backend/spotifake/ ./

# Copy Angular build from Stage 1 to Backend public folder
# With --output-path=dist, Angular 17+ puts browser assets in 'dist/browser'
COPY --from=frontend-build /app/frontend/dist/browser ./public

# Musik-Upload-Ordner sicherstellen
RUN mkdir -p uploads

EXPOSE 3000
CMD ["node", "server.js"]
