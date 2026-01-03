# Makefile
.PHONY: new render watch clean help list

NAME ?= Miguel Fuertes
FILE = $(shell echo "$(NAME)" | tr ' ' '_')_CV.yaml

new:
	@if [ -f "$(FILE)" ]; then \
		echo "Error: $(FILE) already exists!"; \
		echo "Delete it first or use a different name."; \
		exit 1; \
	fi
	@echo "Creating $(FILE)..."
	docker compose run --rm rendercv new "$(NAME)"
	@echo "Created $(FILE)"

render:
	@if [ ! -f "$(FILE)" ]; then \
		echo "Error: $(FILE) not found!"; \
		echo "Create it first with: make new NAME=\"Your Name\""; \
		exit 1; \
	fi
	@echo "Rendering $(FILE)..."
	docker compose run --rm rendercv render "$(FILE)"
	@echo "PDF generated in rendercv_output/"

bootstrap:
	docker run -it --rm -v ${PWD}:/app -w /app node:lts bash

up:
	docker compose up app

down:
	docker compose down

build:
	docker compose run --rm build