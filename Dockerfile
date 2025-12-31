# Etapa de build
FROM node:20-bookworm AS builder

# Instalar Python 3.12+ y dependencias para rendercv
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    && rm -rf /var/lib/apt/lists/*

# Instalar rendercv
RUN pip3 install --break-system-packages "rendercv[full]"

WORKDIR /app

# Copiar archivos de dependencias e instalar
COPY portfolio/package*.json ./
RUN npm ci

# Copiar código fuente y construir
COPY ./portfolio .
RUN npm run build

# Etapa de runtime
FROM node:20-bookworm-slim AS runtime

# Instalar Python y rendercv en runtime
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    && rm -rf /var/lib/apt/lists/*

RUN pip3 install --break-system-packages "rendercv[full]"

WORKDIR /app

# Copiar build de Astro
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Instalar solo dependencias de producción
RUN npm ci --omit=dev

# Configurar para SSR
ENV HOST=0.0.0.0
ENV PORT=4321
EXPOSE 4321

# Verificar instalaciones
RUN node --version && rendercv --version
