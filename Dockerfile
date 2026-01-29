# Imagen base para desarrollo
FROM node:20-bookworm

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

# Instalar rendercv
RUN pip3 install --break-system-packages "rendercv[full]"

WORKDIR /app

# Configurar para desarrollo
ENV HOST=0.0.0.0
ENV PORT=4321
EXPOSE 4321

# Verificar instalaciones
RUN node --version && python3 --version && rendercv --version
