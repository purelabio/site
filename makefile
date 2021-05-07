MAKEFLAGS := --silent --always-make
PAR := $(MAKE) -j 128
TAR := target
SASS := sass --no-source-map -I submodules styles/main.scss:$(TAR)/styles/main.css
DENO := deno run -A --import-map importmap.json --unstable --no-check

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
	$(PAR) styles-w afr srv-w

build: clean
	$(PAR) styles pages cp

styles-w:
	$(SASS) --watch

styles:
	$(SASS)

afr:
	deno run -A --unstable --no-check https://deno.land/x/afr@0.5.1/afr.ts --port 53733

srv-w:
	$(DENO) --watch scripts/cmd_srv.mjs

srv:
	$(DENO) scripts/cmd_srv.mjs

pages-w:
	$(DENO) --watch scripts/cmd_pages.mjs

pages:
	$(DENO) scripts/cmd_pages.mjs

deno:
	$(DENO) $(file)

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
