#!/bin/bash

case "$1" in
  dev)
    docker compose up app
    ;;
  
  build)
    docker compose run --rm build
    ;;
  
  cv)
    make cv
    ;;
  
  test)
    ./scripts/pre-build.sh && docker compose run --rm build
    ;;
  
  all)
    make all
    ;;
  
  down)
    docker compose down
    ;;
  
  logs)
    docker logs me-app-1 --tail 100 -f
    ;;
  
  clean)
    docker compose down -v
    ;;
  
  *)
    echo "Usage: ./dev.sh [command]"
    echo ""
    echo "Commands:"
    echo "  dev    - Dev server"
    echo "  build  - Build site"
    echo "  cv     - Generate CV PDF"
    echo "  test   - Validate and build"
    echo "  all    - Build CV + Portfolio"
    echo "  down   - Stop services"
    echo "  logs   - Show logs"
    echo "  clean  - Clean containers"
    ;;
esac
