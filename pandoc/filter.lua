-- Wrap content between horizontal rules in <section class="slide ..."> blocks.
-- Recognize <!-- class: foo bar --> comments and add classes to the slide
-- they appear in.
--
-- Pandoc treats unknown HTML tags like <v-click> as inline, wrapping them in
-- a <p>. Promote any paragraph that holds only a single raw HTML tag to a
-- block-level RawBlock so the tag wraps its siblings instead of self-closing.

local function class_from_comment(text)
    return string.match(text, "<!%-%-%s*class:%s*(.-)%s*%-%->")
end

local function lone_raw_html(block)
    if block.t ~= "Para" or #block.content ~= 1 then return nil end
    local inline = block.content[1]
    if inline.t == "RawInline" and inline.format == "html" then
        return inline.text
    end
    return nil
end

function Pandoc(doc)
    local promoted = {}
    for _, block in ipairs(doc.blocks) do
        local raw = lone_raw_html(block)
        if raw then
            table.insert(promoted, pandoc.RawBlock("html", raw))
        else
            table.insert(promoted, block)
        end
    end

    local result = {}
    local cur_classes = {"slide"}
    local cur_blocks = {}

    local function flush()
        if #cur_blocks > 0 then
            local class_attr = table.concat(cur_classes, " ")
            table.insert(result,
                pandoc.RawBlock("html", '<section class="' .. class_attr .. '">'))
            for _, b in ipairs(cur_blocks) do
                table.insert(result, b)
            end
            table.insert(result, pandoc.RawBlock("html", "</section>"))
        end
        cur_classes = {"slide"}
        cur_blocks = {}
    end

    for _, block in ipairs(promoted) do
        if block.t == "HorizontalRule" then
            flush()
        elseif block.t == "RawBlock" and block.format == "html" then
            local cls = class_from_comment(block.text)
            if cls then
                for c in string.gmatch(cls, "%S+") do
                    table.insert(cur_classes, c)
                end
            else
                table.insert(cur_blocks, block)
            end
        else
            table.insert(cur_blocks, block)
        end
    end
    flush()

    doc.blocks = result
    return doc
end
