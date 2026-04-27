PANDOC_DIR ?= ../pandoc
CHROME     ?= google-chrome

SOURCE = presentation.md
HTML   = presentation.html
PDF    = presentation.pdf

DEPS = $(PANDOC_DIR)/template.html \
       $(PANDOC_DIR)/filter.lua \
       $(PANDOC_DIR)/style.css \
       $(PANDOC_DIR)/slides.js

.PHONY: all pdf html clean

all: pdf

pdf: $(PDF)
	@rm -f $(HTML)

html: $(HTML)

$(HTML): $(SOURCE) $(DEPS)
	pandoc $(SOURCE) \
	    --from=markdown-citations-auto_identifiers \
	    --to=html5 \
	    --standalone \
	    --metadata=title:"$(notdir $(CURDIR))" \
	    --template=$(PANDOC_DIR)/template.html \
	    --lua-filter=$(PANDOC_DIR)/filter.lua \
	    --output=$(HTML)

$(PDF): $(HTML)
	$(CHROME) --headless --disable-gpu --no-sandbox \
	    --no-pdf-header-footer --virtual-time-budget=2000 \
	    --print-to-pdf=$(PDF) file://$(CURDIR)/$(HTML)

clean:
	rm -f $(HTML) $(PDF)
