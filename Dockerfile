FROM node:20-alpine AS base
WORKDIR /app
COPY package.json ./
COPY shared/package.json shared/package.json
COPY backend/package.json backend/package.json
COPY web-portal/package.json web-portal/package.json
RUN npm install --workspace backend --workspace web-portal --include=dev
COPY shared ./shared
COPY backend ./backend
COPY web-portal ./web-portal
RUN npm --workspace backend run build
RUN npm --workspace web-portal run build
EXPOSE 4000 5173
CMD ["sh","-c","node backend/dist/index.js & npx --workspace web-portal vite preview --port 5173 --host 0.0.0.0"]
