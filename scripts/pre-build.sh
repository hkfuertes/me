#!/bin/bash

# Pre-build validation script
set -e

echo "Validating configuration..."
echo ""

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

ERRORS=0

# CV YAML
echo -n "CV YAML... "
if [ -f "Miguel_Fuertes_CV.yaml" ]; then
    if command -v python3 &> /dev/null; then
        if python3 -c "import yaml; yaml.safe_load(open('Miguel_Fuertes_CV.yaml'))" 2>/dev/null; then
            echo -e "${GREEN}OK${NC}"
        else
            echo -e "${RED}INVALID${NC}"
            ERRORS=$((ERRORS + 1))
        fi
    else
        echo -e "${YELLOW}SKIP${NC}"
    fi
else
    echo -e "${RED}NOT FOUND${NC}"
    ERRORS=$((ERRORS + 1))
fi

# gists.yaml
echo -n "gists.yaml... "
if [ -f "blog/gists.yaml" ]; then
    if command -v python3 &> /dev/null; then
        if python3 -c "import yaml; yaml.safe_load(open('blog/gists.yaml'))" 2>/dev/null; then
            echo -e "${GREEN}OK${NC}"
        else
            echo -e "${RED}INVALID${NC}"
            ERRORS=$((ERRORS + 1))
        fi
    else
        echo -e "${YELLOW}SKIP${NC}"
    fi
else
    echo -e "${RED}NOT FOUND${NC}"
    ERRORS=$((ERRORS + 1))
fi

# GITHUB_TOKEN
echo -n "GITHUB_TOKEN... "
if [ -n "$GITHUB_TOKEN" ]; then
    echo -e "${GREEN}OK${NC}"
else
    echo -e "${YELLOW}NOT SET${NC}"
fi

# package.json
echo -n "package.json... "
if [ -f "portfolio/package.json" ]; then
    echo -e "${GREEN}OK${NC}"
else
    echo -e "${RED}NOT FOUND${NC}"
    ERRORS=$((ERRORS + 1))
fi

# node_modules
echo -n "node_modules... "
if [ -d "portfolio/node_modules" ]; then
    echo -e "${GREEN}OK${NC}"
else
    echo -e "${YELLOW}NOT FOUND${NC}"
fi

# astro.config.mjs
echo -n "astro.config.mjs... "
if [ -f "portfolio/astro.config.mjs" ]; then
    echo -e "${GREEN}OK${NC}"
else
    echo -e "${RED}NOT FOUND${NC}"
    ERRORS=$((ERRORS + 1))
fi

# content.config.ts
echo -n "content.config.ts... "
if [ -f "portfolio/src/content.config.ts" ]; then
    echo -e "${GREEN}OK${NC}"
else
    echo -e "${RED}NOT FOUND${NC}"
    ERRORS=$((ERRORS + 1))
fi

echo ""

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}All validations passed${NC}"
    exit 0
else
    echo -e "${RED}Found $ERRORS errors${NC}"
    exit 1
fi
