var mythings = [{'x': 1.0, 'y': 1.0}, {'x': 10.0, 'y': 1.0}];
d3.select('svg').datum(mythings).call(update);

function update(sel) {
    sel.each(function(data) {
        var main = d3.select(this)
        .append('g')
        .attr('transform', 'translate(100, 100) scale(20)');

        var circle = main.selectAll('circle')
        .data(data);

        circle
        .enter()
        .append('circle')
        .attr('r', 2.5);

        // circle
        // .enter()
        // .append('circle')
        // .attr('r', 0)
        // .transition()
        // .attr('r', 2.5);

        circle
        .attr('cx', function(d) { return d.x })
        .attr('cy', function(d) { return d.y })
        ;

        circle
        .exit()
        .remove();

        // circle
        // .exit()
        // .transition()
        // .attr('r', 0)
        // .remove();
    });
}
