# Makefile
.PHONY: new render watch clean help list

NAME ?= Miguel Fuertes
# Convertir "Miguel Fuertes" a "Miguel_Fuertes_CV.yaml"
FILE = $(shell echo "$(NAME)" | tr ' ' '_')_CV.yaml

help:
	@echo "Usage:"
	@echo "  make new NAME=\"Your Name\"    - Create new CV (fails if exists)"
	@echo "  make render                    - Render existing CV to PDF"
	@echo "  make watch                     - Watch and auto-render on changes"
	@echo "  make clean                     - Remove generated files"
	@echo "  make list                      - List available CVs"
	@echo ""
	@echo "Current file: $(FILE)"

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

watch:
	@if [ ! -f "$(FILE)" ]; then \
		echo "Error: $(FILE) not found!"; \
		exit 1; \
	fi
	@echo "Watching $(FILE) for changes..."
	docker compose run --rm rendercv render --watch "$(FILE)"

clean:
	rm -rf rendercv_output *.yaml
	@echo "Cleaned generated files"

list:
	@echo "Available CVs:"
	@ls -1 *_CV.yaml 2>/dev/null || echo "  (none)"
