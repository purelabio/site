MAKEFLAGS := --silent --always-make
PAR := $(MAKE) -j 128
TAR := target
SASS := sass --no-source-map -I . styles/main.scss:$(TAR)/styles/main.css
IMPORTMAP_FLAG = $(if $(wildcard $(1)),--importmap=$(1),)
IMPORTMAP_DENO_FLAG := $(or $(call IMPORTMAP_FLAG,importmap_override.json),$(call IMPORTMAP_FLAG,importmap.json))
DENO_RUN := deno run -A --no-check $(IMPORTMAP_DENO_FLAG)
DENO_WAT := $(DENO_RUN) --watch

ifeq ($(PROD), true)
	SASS := $(SASS) --style=compressed
else
	SASS := $(SASS) --style=expanded
endif

ifeq ($(OS), Windows_NT)
	RM = if exist "$(1)" rmdir /s /q "$(1)"
else
	RM = rm -rf "$(1)"
endif

ifeq ($(OS), Windows_NT)
	MKDIR = if not exist "$(1)" mkdir "$(1)"
else
	MKDIR = mkdir -p "$(1)"
endif

ifeq ($(OS), Windows_NT)
	CP = copy "$(1)"\* "$(2)" >nul
else
	CP = cp -r "$(1)"/* "$(2)"
endif

watch: clean
	$(PAR) styles_w srv_w live

build: clean all

all:
	$(PAR) styles pages cp

styles_w:
	$(SASS) --watch

styles:
	$(SASS)

live:
	$(DENO_RUN) scripts/cmd_live.mjs

srv_w:
	$(DENO_WAT) scripts/cmd_srv.mjs

srv:
	$(DENO_RUN) scripts/cmd_srv.mjs

pages_w:
	$(DENO_WAT) scripts/cmd_pages.mjs

pages:
	$(DENO_RUN) scripts/cmd_pages.mjs

deno:
	$(DENO_RUN) $(file)

cp:
	$(call MKDIR,$(TAR))
	$(call MKDIR,$(TAR)/images)
	$(call CP,static,$(TAR))
# 	Makes redundant copies, TODO flatten.
	$(call CP,images/images,$(TAR)/images)
	$(call CP,images,$(TAR)/images)

clean:
	$(call RM,$(TAR))

sub:
	git submodule update --init --recursive --quiet

deps:
ifeq ($(OS), Windows_NT)
	scoop install sass watchexec deno
else
	brew install -q sass/sass/sass watchexec deno
endif
	$(MAKE) sub
