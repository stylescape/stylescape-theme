# =============================================================================
# stylescape-theme — Makefile
# =============================================================================
# Thin verbs over the npm scripts, so this repository answers to the same
# words as its siblings. package.json stays the source: every target here
# is one `npm run` away, and nothing is done here that npm cannot do.
#
#   make install check build
# =============================================================================

.DEFAULT_GOAL := help

VERSION := $(shell tr -d '[:space:]' < VERSION 2>/dev/null || echo 0.0.0)

CYAN  := \033[0;36m
GREEN := \033[0;32m
RESET := \033[0m

.PHONY: help version install check ci test coverage lint typecheck fmt \
        fmt-check format build dev clean distclean

help: ## Show this help
	@printf "$(CYAN)stylescape-theme$(RESET)  v$(VERSION)\n\n"
	@awk 'BEGIN {FS = ":.*##"} /^[a-zA-Z0-9_.-]+:.*##/ \
		{ printf "  $(GREEN)%-16s$(RESET) %s\n", $$1, $$2 }' $(MAKEFILE_LIST)
	@printf "\n"

version: ## Print the package version
	@echo $(VERSION)

install: ## Install dependencies exactly as the lockfile pins them
	npm ci

check: ## The gate: typecheck, ESLint, Prettier check, tests
	npm run check

ci: check coverage build ## Everything CI runs, locally

test: ## Run the node:test suite
	npm test

coverage: ## Test suite with coverage thresholds
	npm run coverage

lint: ## ESLint over the .mjs/.js files
	npm run lint

typecheck: ## tsc without emitting
	npm run typecheck

# `format` checks and never writes, the same as `npm run format` (the
# fleet convention: a bare name does not change files under you). `fmt`
# is the one that writes.
format: ## Check formatting without writing (= npm run format)
	npm run format:check

fmt: ## Write Prettier's formatting out (= npm run format:fix)
	npm run format:fix

fmt-check: format

build: ## dist/css/ss{,.min}.css
	npm run build

dev: ## Rebuild dist/ on change
	npm run dev

clean: ## Remove build output
	npm run clean

distclean: clean ## Remove build output and installed dependencies
	rm -rf node_modules
