import React, { useEffect, useState, useRef } from 'react';
import { getBudgetData } from '../Data/Data';
import { Chart, PieController, ArcElement, Tooltip, Legend } from 'chart.js';
import * as d3 from 'd3';

Chart.register(PieController, ArcElement, Tooltip, Legend);

function HomePage() {
    const [budgetData, setBudgetData] = useState(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getBudgetData(); 
                setBudgetData(data.myBudget);
                createChart(data.myBudget); 
                createD3Chart(data.myBudget); 
            } catch (error) {
                console.error("Error fetching budget data:", error);
            }
        };
        fetchData(); 
    }, []);

    useEffect(() => {
        if (!budgetData) return;

        const container = document.querySelector(".d3-chart-container");

        const handleResize = () => {
            createD3Chart(budgetData);
        };

        const resizeObserver = new ResizeObserver(() => {
            handleResize();
        });

        resizeObserver.observe(container);

        return () => {
            resizeObserver.unobserve(container);
            resizeObserver.disconnect();
        };
    }, [budgetData]);

    const createChart = (data) => {
        const ctx = document.getElementById('myChart').getContext('2d');

        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        chartInstance.current = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: data.map(item => item.title),
                datasets: [{
                    data: data.map(item => item.budget),
                    backgroundColor: ['#ffcd56', '#ff6384', '#36a2eb', '#fd6b19', '#4bc0c0', '#9966ff', '#ff9f40']
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        enabled: true,
                    }
                }
            }
        });
    };

    const createD3Chart = (data) => {
        const container = d3.select(".d3-chart-container");
        const containerWidth = container.node().getBoundingClientRect().width;
        const containerHeight = container.node().getBoundingClientRect().height;
        const radius = Math.min(containerWidth, containerHeight) / 2;

        d3.select("#d3Chart").selectAll("*").remove();

        const svg = d3.select("#d3Chart")
            .attr("width", containerWidth)
            .attr("height", containerHeight)
            .append("g")
            .attr("transform", `translate(${containerWidth / 2},${containerHeight / 2})`);

        svg.append("g").attr("class", "slices");
        svg.append("g").attr("class", "labels");
        svg.append("g").attr("class", "lines");

        const pie = d3.pie()
            .sort(null)
            .value(d => d.budget);

        const arc = d3.arc()
            .outerRadius(radius * 0.8)
            .innerRadius(radius * 0.4);

        const outerArc = d3.arc()
            .innerRadius(radius * 0.9)
            .outerRadius(radius * 0.9);

        const color = d3.scaleOrdinal()
            .domain(data.map(d => d.title))
            .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

        const key = d => d.data.title;

        change(data);

        function change(data) {
            const midAngle = (d) => d.startAngle + (d.endAngle - d.startAngle) / 2;

            /* ------- PIE SLICES -------*/
            let slice = svg.select(".slices").selectAll("path.slice")
                .data(pie(data), key);

            slice.exit().remove();

            slice = slice.enter()
                .append("path")
                .attr("class", "slice")
                .style("fill", d => color(d.data.title))
                .each(function(d) { 
                    this._current = { startAngle: d.startAngle, endAngle: d.startAngle };
                })
                .merge(slice);

            slice.transition()
                .duration(1000)
                .attrTween("d", function(d) {
                    const interpolate = d3.interpolate(this._current, d);
                    this._current = interpolate(1);
                    return t => arc(interpolate(t));
                });

            /* ------- TEXT LABELS -------*/
            let text = svg.select(".labels").selectAll("text")
                .data(pie(data), key);

            text.exit().remove();

            text = text.enter()
                .append("text")
                .attr("dy", ".35em")
                .each(function(d) { 
                    this._current = { startAngle: d.startAngle, endAngle: d.startAngle };
                })
                .merge(text);

            text.text(d => d.data.title)
                .transition()
                .duration(1000)
                .attrTween("transform", function(d) {
                    const interpolate = d3.interpolate(this._current, d);
                    this._current = interpolate(1);
                    return t => {
                        const d2 = interpolate(t);
                        const pos = outerArc.centroid(d2);
                        pos[0] = radius * (midAngle(d2) < Math.PI ? 1.1 : -1.1);
                        return `translate(${pos})`;
                    };
                })
                .styleTween("text-anchor", function(d) {
                    const interpolate = d3.interpolate(this._current, d);
                    this._current = interpolate(1);
                    return t => {
                        const d2 = interpolate(t);
                        return midAngle(d2) < Math.PI ? "start" : "end";
                    };
                });

            /* ------- SLICE TO TEXT POLYLINES -------*/
            let polyline = svg.select(".lines").selectAll("polyline")
                .data(pie(data), key);

            polyline.exit().remove();

            polyline = polyline.enter()
                .append("polyline")
                .each(function(d) { 
                    this._current = { startAngle: d.startAngle, endAngle: d.startAngle };
                })
                .merge(polyline);

            polyline.transition()
                .duration(1000)
                .attrTween("points", function(d) {
                    const interpolate = d3.interpolate(this._current, d);
                    this._current = interpolate(1);
                    return t => {
                        const d2 = interpolate(t);
                        const pos = outerArc.centroid(d2);
                        pos[0] = radius * (midAngle(d2) < Math.PI ? 0.95 : -0.95);
                        return [arc.centroid(d2), outerArc.centroid(d2), pos];
                    };
                });
        }
    }

    return (
        <main className="center" id="main">
            <section className="page-area">

                <article>
                    <h1>Stay on track</h1>
                    <p>
                        Do you know where you are spending your money? If you really stop to track it down,
                        you would get surprised! Proper budget management depends on real data... and this
                        app will help you with that!
                    </p>
                </article>

                <article>
                    <h1>Alerts</h1>
                    <p>
                        What if your clothing budget ended? You will get an alert. The goal is to never go over the budget.
                    </p>
                </article>

                <article>
                    <h1>Results</h1>
                    <p>
                        People who stick to a financial plan, budgeting every expense, get out of debt faster!
                        Also, they live happier lives... since they expend without guilt or fear... 
                        because they know it is all good and accounted for.
                    </p>
                </article>

                <article>
                    <h1>Free</h1>
                    <p>
                        This app is free!!! And you are the only one holding your data!
                    </p>
                </article>

                <article>
                    <h1>Stay on track</h1>
                    <p>
                        Do you know where you are spending your money? If you really stop to track it down,
                        you would get surprised! Proper budget management depends on real data... and this
                        app will help you with that!
                    </p>
                </article>

                <article>
                    <h1>Alerts</h1>
                    <p>
                        What if your clothing budget ended? You will get an alert. The goal is to never go over the budget.
                    </p>
                </article>

                <article>
                    <h1>Results</h1>
                    <p>
                        People who stick to a financial plan, budgeting every expense, get out of debt faster!
                        Also, they live happier lives... since they expend without guilt or fear... 
                        because they know it is all good and accounted for.
                    </p>
                </article>

                {/* This is a Semantic HTML Change: Replaced div with figure for chart content, and added figcaption with styling */}
                <figure>
                    <h1>Chart</h1>
                    <p>
                        {/* This is an A11y Change: aria-live is added for dynamic content updates */}
                        <canvas id="myChart" width="400" height="400" aria-live="polite"></canvas>
                    </p>
                    <figcaption>Spending chart based on your personal budget data.</figcaption>
                </figure>

                <figure>
                    <h1>D3JS Chart</h1>
                        <div className="d3-chart-container">
                        {/* This is an A11y Change: aria-live is added for dynamic content updates */}
                        <svg id="d3Chart" width="960" height="500" aria-live="polite"></svg>
                        </div>
                    <figcaption>Spending D3JS chart based on your personal budget data.</figcaption>
                </figure>

            </section>
        </main>
    );
}

export default HomePage;
