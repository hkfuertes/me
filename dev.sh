#!/bin/bash

# Script de desarrollo rápido para el portfolio

case "$1" in
  dev)
    echo "🚀 Iniciando servidor de desarrollo..."
    docker compose up app
    ;;
  
  build)
    echo "🔨 Construyendo sitio estático..."
    docker compose run --rm build
    ;;
  
  down)
    echo "🛑 Deteniendo servicios..."
    docker compose down
    ;;
  
  logs)
    echo "📋 Mostrando logs..."
    docker logs me-app-1 --tail 100 -f
    ;;
  
  clean)
    echo "🧹 Limpiando contenedores y volúmenes..."
    docker compose down -v
    ;;
  
  *)
    echo "Portfolio - Script de desarrollo"
    echo ""
    echo "Uso: ./dev.sh [comando]"
    echo ""
    echo "Comandos disponibles:"
    echo "  dev     - Inicia servidor de desarrollo"
    echo "  build   - Construye el sitio estático"
    echo "  down    - Detiene servicios"
    echo "  logs    - Muestra logs del contenedor"
    echo "  clean   - Limpia contenedores y volúmenes"
    ;;
esac
