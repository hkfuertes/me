# Etapa de build
FROM node:20-bookworm AS builder

# Instalar Python 3.12 desde Debian testing
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    && echo "deb http://deb.debian.org/debian testing main" > /etc/apt/sources.list.d/testing.list \
    && apt-get update \
    && apt-get install -y -t testing \
    python3 \
    python3-pip \
    python3-venv \
    && rm -rf /var/lib/apt/lists/*

# Instalar rendercv desde wheel
RUN pip3 install --break-system-packages https://github.com/rendercv/rendercv/releases/download/v2.6/rendercv-2.6-py3-none-any.whl

WORKDIR /app

# Copiar archivos de dependencias e instalar
COPY portfolio/package*.json ./
RUN npm ci

# Copiar código fuente y construir
COPY ./portfolio .
# RUN npm run build

# Etapa de runtime
FROM node:20-bookworm-slim AS runtime

# Instalar Python 3.12 desde testing
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    && echo "deb http://deb.debian.org/debian testing main" > /etc/apt/sources.list.d/testing.list \
    && apt-get update \
    && apt-get install -y -t testing \
    python3 \
    python3-pip \
    && rm -rf /var/lib/apt/lists/*

# Instalar rendercv desde wheel
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
RUN node --version && python3 --version && rendercv --version
