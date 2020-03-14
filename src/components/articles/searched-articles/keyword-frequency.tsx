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
    const TRANSITION_DELAY = 500;
    const BAR_TRANSITION_DURATION = 2000;

    const binDateStringArray = useMemo(() => {
        return bin.map((obj) => {
            const date = new Date(obj.ms);
            return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
        })
    }, [bin]);

    console.log(binDateStringArray);

    const delayArray = useMemo(() => {
        const array = [];
        let delay = TRANSITION_DELAY;
        let step = 20;
        for (let i=0; i<frequency.length; i++) {
            if (frequency[i] === 0) {
                array.push(delay)
            } else {
                array.push(delay+=step);
            }
        }
        return array
    }, [frequency]);

    useEffect(() => {
        if (!wrapperRef.current) return;
        console.log(bin, frequency);

        const maxFrequency = Math.max.apply(Math, frequency);
        const binLength = bin.length;

        const svgWidth = wrapperRef.current.getBoundingClientRect().width;
        const svgHeight = Math.min(Math.round(svgWidth / 3), 200);
        const m = {t: 10, r: 30, b: 30, l: 30}; // margin
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
            .delay((d, i) => delayArray[i])
            .duration(BAR_TRANSITION_DURATION)
            .ease(d3.easeElastic);


        const yAxisScale = d3.scaleLinear()
            .domain([0, maxFrequency])
            .range([chartHeight, 0]);
        const yAxis = d3.axisLeft(yAxisScale);
        const yLegends = svg.append('g');
        yAxis.tickValues([0, Math.floor(maxFrequency * 0.5), maxFrequency]);
        yLegends
            .style('transform', `translate(${chartX}px, ${svgHeight}px)`)
            .style('opacity', 0)
            .style('color', darkColor);

        const xAxisScale = d3.scaleLinear()
            .domain([0, binDateStringArray.length - 1])
            .range([0, chartWidth]);
        const xLegends = svg.append('g');
        const xAxis = d3.axisBottom(xAxisScale);
        // @ts-ignore
        xAxis.tickFormat((d, i) => binDateStringArray[d])
            .tickValues([0, Math.floor(binLength * 0.25), Math.floor(binLength * 0.5), Math.floor(binLength * 0.75), binLength - 1]);
        xLegends
            .style('transform', `translate(${-0.5*svgWidth}px, ${chartHeight + chartY}px)`)
            .style('opacity', 0)
            .style('color', darkColor);

        yLegends.transition()
            .style('opacity', 1)
            .style('transform', `translate(${chartX}px, ${chartY}px)`)
            .delay(TRANSITION_DELAY)
            .duration(1000)
            .ease(d3.easeElastic);
        xLegends.transition()
            .style('opacity', 1)
            .style('transform', `translate(${chartX}px, ${chartHeight + chartY}px)`)
            .delay(TRANSITION_DELAY)
            .duration(1000)
            .ease(d3.easeElastic);

        yAxis(yLegends);
        xAxis(xLegends);


    }, [wrapperRef]);


    return (
        <div ref={wrapperRef} className={classes.root} id={id}>

        </div>
    )
};

export default KeywordFrequency