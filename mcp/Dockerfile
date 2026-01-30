FROM node:20-slim
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY tsconfig.json ./
COPY src/ ./src/
COPY data.yaml ./
RUN npm run build
EXPOSE 8000
CMD ["node", "dist/index.js"]
