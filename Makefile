# Makefile
.PHONY: new render dev build cv all test up down help

NAME ?= Miguel Fuertes
FILE = $(shell echo "$(NAME)" | tr ' ' '_')_CV.yaml

# CV
new:
	@[ ! -f "$(FILE)" ] || (echo "Error: $(FILE) exists" && exit 1)
	docker compose run --rm rendercv new "$(NAME)"

render:
	@[ -f "$(FILE)" ] || (echo "Error: $(FILE) not found" && exit 1)
	docker compose run --rm rendercv render "$(FILE)"

cv: render
	@mkdir -p portfolio/public
	@cp rendercv_output/$(FILE:.yaml=.pdf) portfolio/public/cv.pdf

# Portfolio
dev:
	@./dev.sh dev

build:
	@./dev.sh build

# Combined
all: cv build

test: all

# Docker
up:
	docker compose up app

down:
	docker compose down

# Help
help:
	@echo "CV:"
	@echo "  make new NAME=\"Name\"  - Create CV"
	@echo "  make render            - Generate PDF"
	@echo "  make cv                - Generate and copy to public/"
	@echo ""
	@echo "Portfolio:"
	@echo "  make dev               - Dev server"
	@echo "  make build             - Build site"
	@echo ""
	@echo "Combined:"
	@echo "  make all               - CV + Portfolio"
	@echo "  make test              - Build everything"
	@echo ""
	@echo "Docker:"
	@echo "  make up                - Start app"
	@echo "  make down              - Stop app"