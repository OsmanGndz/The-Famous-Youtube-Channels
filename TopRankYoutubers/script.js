let selectedNum = 5;
let type_gen = "Subscribers";

function init() {
    handleButtonTypeClick("Subscribers"); 
    selectCsv(selectedNum);
}

function selectCsv(num, element) {
    selectedNum = num;
    console.log(selectedNum);
    toggleButtonColor('.toggle-button1', element);
    drawbar(type_gen, selectedNum);
    drawPie(type_gen, selectedNum);
    drawMap(type_gen, selectedNum);
}

function handleButtonTypeClick(type,element) {
    type_gen = type
    drawbar(type, selectedNum);
    drawPie(type, selectedNum);
    drawMap(type, selectedNum);
    toggleButtonColor('.toggle-button', element); 
}

function toggleButtonColor(buttonClass, element) {
    // Remove 'btn-success' class from all buttons in the same group and add 'btn-info'
    document.querySelectorAll(buttonClass).forEach(button => {
        button.classList.remove('btn-success');
        button.classList.add('btn-info');
    });
    // Add 'btn-success' class to the clicked button and remove 'btn-info'
    element.classList.remove('btn-info');
    element.classList.add('btn-success');
}

function drawbar(type, selectedNum) {
    const width = 1020;
    const height = 420;
    const margin = { top: 30, bottom: 80, left: 120, right: 50 };

    d3.select("#bar").selectAll("*").remove();

    d3.csv(`Top_${selectedNum}_Youtuber_In_World.csv`).then(function (data) {
        data.forEach(d => {
            d[type] = +d[type];
        });

        // Veriyi büyükten küçüğe sıralama
        data.sort((a, b) => b[type] - a[type]);

        const svg = d3.select("#bar")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const x = d3.scaleBand()
            .domain(data.map(d => d.Username))
            .range([0, width - margin.left - margin.right])
            .padding(0.1);

        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => d[type])])
            .range([height - margin.bottom - margin.top, 0]);

        const tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        svg.selectAll("rect")
            .data(data)
            .enter()
            .append("rect")
            .attr("x", d => x(d.Username))
            .attr("y", d => y(d[type]))
            .attr("width", x.bandwidth())
            .attr("height", d => height - margin.top - margin.bottom - y(d[type]))
            .attr("fill", "royalblue")
            .on("mouseover", function(event, d) {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                tooltip.html(`
                    <ul>
                        <li><strong>Rank: ${d.Rank}</strong></li>
                        <li><strong>Categories: ${d.Categories}</strong></li>
                        <li><strong>Country: ${d.Country}</strong></li>
                    </ul>
                `)
                    .style("left", (event.pageX + 25) + "px")
                    .style("top", (event.pageY - 28) + "px");
                
                d3.select(this)
                    .transition()
                    .duration(200)
                    .style("opacity", 0.7);
            })
            .on("mouseout", function(event, d) {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);

                d3.select(this)
                    .transition()
                    .duration(500)
                    .style("opacity", 1);
            });

        svg.append("g")
            .attr("transform", `translate(0,${height - margin.bottom - margin.top})`)
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "rotate(-25)")
            .style("text-anchor", "end");

        svg.append("g")
            .call(d3.axisLeft(y));
            
        svg.append("text")
            .attr("x", (width - margin.left - margin.right) / 2)
            .attr("y", height - margin.bottom / 2)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .text("Youtuber"); 
            
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -(height - margin.top - margin.bottom) / 2)
            .attr("y", -margin.left / 1.5)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .text(type);
        
        svg.append("text")
            .attr("x", (width - margin.left - margin.right) / 2)
            .attr("y", -margin.top / 2)
            .attr("text-anchor", "middle")
            .style("font-size", "20px")
            .style("text-decoration", "underline")
            .text("Youtuber - " + type + " Bar Plot");    

    }).catch(function (error) {
        console.error("Veri okuma hatası:", error);
    });
}

function drawPie(type, selectedNum) {
    const width = 620;
    const height = 440;
    const margin = { top: 20, bottom: 0, left: 0, right: 0 };
    const radius = 120;

    d3.select("#pie").selectAll("*").remove();

    d3.csv(`Top_${selectedNum}_Youtuber_In_World.csv`).then(function (data) {
        data.forEach(d => {
            d[type] = +d[type];
        });

        const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

        const pie = d3.pie()
            .value(d => d[type])
            (data);

        const svg = d3.select("#pie")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${width / 2},${height / 2})`);

        const arc = d3.arc()
            .innerRadius(0)
            .outerRadius(radius);

        const tooltip = d3.select("body").append("div")
            .attr("class", "tooltip_pie")
            .style("opacity", 0);

        const arcs = svg.selectAll("arc")
            .data(pie)
            .enter()
            .append("g")
            .attr("class", "arc")
            .on("mouseover", function(event, d) {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                tooltip.html(`
                    <ul>
                        <li><strong>${type}: ${d.data[type]}</strong></li>
                    </ul>
                `)
                    .style("left", (event.pageX + 25) + "px")
                    .style("top", (event.pageY - 28) + "px");
                
                d3.select(this)
                    .transition()
                    .duration(200)
                    .style("opacity", 0.7);
            })
            .on("mouseout", function(event, d) {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);

                d3.select(this)
                    .transition()
                    .duration(500)
                    .style("opacity", 1);
            });

        arcs.append("path")
            .attr("fill", (d, i) => colorScale(i))
            .attr("d", arc);      

        const legend = svg.selectAll(".legend")
            .data(pie)
            .enter()
            .append("g")
            .attr("class", "legend")
            .attr("transform", (d, i) => `translate(${radius + margin.left + 40},${(i * 20) - radius / 2})`);

        legend.append("rect")
            .attr("width", 15)
            .attr("height", 10)
            .attr("x", 5)
            .attr("y", -135)
            .attr("fill", (d, i) => colorScale(i));

        legend.append("text")
            .attr("x", 25)
            .attr("y", -130)
            .attr("dy", "0.35em")
            .text(d => `${d.data.Username}`);

        svg.append("text")
            .attr("x", 0)
            .attr("y", -height / 2 + margin.top)
            .attr("text-anchor", "middle")
            .style("font-size", "20px")
            .style("text-decoration", "underline")
            .text("Youtuber - " + type + " Pie Chart");

    }).catch(function (error) {
        console.error("Veri okuma hatası:", error);
    });
}

function drawMap(type, selectedNum) {
    const width = 1260;
    const height = 600;

    const countryCodes = {
        'US': 840,
        'JP': 392,
        'IN': 356,
        'KR': 410,
        'BR': 76
    };

    d3.select("#map").selectAll("*").remove();

    const svg = d3.select("#map")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    const projection = d3.geoNaturalEarth1()
        .scale(180)
        .translate([width / 2, height / 2]);

    const path = d3.geoPath()
        .projection(projection);

    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    // Renk skalası oluştur
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    d3.json("world-110m.json").then(function(world) {
        const countries = topojson.feature(world, world.objects.countries).features;

        d3.csv(`Top_${selectedNum}_Youtuber_In_World.csv`).then(function(data) {
            const countryData = {};

            data.forEach(d => {
                const countryId = countryCodes[d.Country];
                if (countryId) {
                    if (!countryData[countryId]) {
                        countryData[countryId] = {
                            details: []
                        };
                    }
                    
                    countryData[countryId].details.push(d);
                } 
            });

            console.log(countryData);

            svg.selectAll("path")
                .data(countries)
                .enter().append("path")
                .attr("d", path)
                .attr("fill", d => {
                    const country = countryData[d.id];
                    return country ? colorScale(d.id) : "lightgrey";
                })
                .attr("stroke", "white")
                .attr("stroke-width", 0.5)
                .on("mouseover", function(event, d) {
                    const country = countryData[d.id];
                    if (country) {
                        tooltip.transition()
                            .duration(200)
                            .style("opacity", .9);
                        tooltip.html(`
                            <ul>
                                ${country.details.map(detail => `
                                    <li><strong>${detail.Username}</strong></li>
                                    <li>Rank: ${detail.Rank}</li>
                                `).join('')}
                            </ul>
                        `)
                            .style("left", (event.pageX + 10) + "px")
                            .style("top", (event.pageY - 28) + "px");
                    }
                })
                .on("mouseout", function(event, d) {
                    tooltip.transition()
                        .duration(500)
                        .style("opacity", 0);
                });

        }).catch(function(error) {
            console.error("Youtuber veri okuma hatası:", error);
        });
    }).catch(function(error) {
        console.error("Harita yükleme hatası:", error);
    });

    svg.call(d3.zoom()
        .scaleExtent([1, 8])
        .on("zoom", function(event) {
            svg.selectAll("path").attr("transform", event.transform);
        }));
}


document.addEventListener("DOMContentLoaded", function(event) {
    init();
});
