import React, {useEffect, useMemo, useRef} from "react";
import * as d3 from "d3";
import {makeStyles} from "@material-ui/core";
import { useTheme } from '@material-ui/core/styles';

const id = 'keyword-frequency-chart';

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%'
    }
}));

interface KeywordFrequencyProps {
    bin: any[],
    frequency: number[],
}

const KeywordFrequency: React.FC<KeywordFrequencyProps> = ({bin, frequency}) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const classes = useStyles();
    const theme = useTheme();
    const lightColor = theme.palette.secondary.light;
    const darkColor = theme.palette.secondary.dark;

    const binDateStringArray = useMemo(() => {
        return bin.map((obj) => {
            const date = new Date(obj.ms);
            return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
        })
    }, [bin]);

    useEffect(() => {
        if (!wrapperRef.current) return;
        console.log(bin, frequency);

        const maxFrequency = Math.max.apply(Math, frequency);

        const svgWidth = wrapperRef.current.getBoundingClientRect().width;
        const svgHeight = 200;
        const m = {t: 10, r: 0, b: 30, l: 50}; // margin
        const chartWidth = svgWidth - m.l - m.r;
        const chartHeight = svgHeight - m.t - m.b;
        const chartX = m.l;
        const chartY = m.t;

        const xScale = d3.scaleBand()
            .domain(frequency.map((_, i) => i.toString()))
            .range([0, chartWidth]);

        const yScale = d3.scaleLinear()
            .domain([0, maxFrequency])
            .range([0, chartHeight]);

        const barWidth = xScale.bandwidth();
        const barHeight = (d: number) => yScale(d);
        const barX = (d: any, i: number) => chartX + (xScale(i.toString()) || 0);
        const barY = (d: any) => chartY + chartHeight - barHeight(d);

        const svg = d3.select(`#${id}`).append('svg');
        const bars = svg
            .selectAll('rect').data(frequency)
            .enter().append('rect');

        svg.attr('width', svgWidth)
            .attr('height', svgHeight)
            .style('background', '#EEE');

        bars.style('fill', lightColor)
            .style('opacity', 0.8)
            .attr('width', barWidth)
            .attr('height', 0)
            .attr('x', barX)
            .attr('y', chartY + chartHeight)
            .on('mouseover', function(data) {
                d3.select(this)
                    .style('opacity', 1)
            })
            .on('mouseout', function(data) {
                d3.select(this)
                    .style('opacity', 0.8)
            });

        bars.transition()
            .attr('height', barHeight)
            .attr('y', barY)
            .delay((d, i) => i * 20)
            .duration(2000)
            .ease(d3.easeElastic);


        const yAxisScale = d3.scaleLinear()
            .domain([0, maxFrequency])
            .range([chartHeight, 0]);
        const yAxis = d3.axisLeft(yAxisScale);
        const yLegends = svg.append('g');
        yAxis.ticks(2);
        yLegends
            .style('transform', `translate(${chartX}px, ${chartY}px)`)
            .style('color', darkColor);
        yAxis(yLegends);

        const xAxisScale = d3.scaleLinear()
            .domain([0, binDateStringArray.length - 1])
            .range([0, chartWidth]);
        const xLegends = svg.append('g');
        const xAxis = d3.axisBottom(xAxisScale);
        // @ts-ignore
        xAxis.tickFormat((d, i) => binDateStringArray[d]);
        xAxis.ticks(4);
        xLegends
            .style('transform', `translate(${chartX}px, ${chartHeight + chartY}px)`)
            .style('color', darkColor);
        xAxis(xLegends);


    }, [wrapperRef]);


    return (
        <div ref={wrapperRef} className={classes.root} id={id}>

        </div>
    )
};

export default KeywordFrequency