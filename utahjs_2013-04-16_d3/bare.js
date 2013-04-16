function update(sel) {
    sel.each(function(data) {
        var thing = d3.select(this);

        var things = thing.selectAll('p')
            .data(data)
            .enter()
            .append('p')
            .text(function(d) { return d })
            ;
    });
}

var mythings = ['foo', 'bar', 'baz', 'qux'];
d3.select('div').datum(mythings).call(update);
