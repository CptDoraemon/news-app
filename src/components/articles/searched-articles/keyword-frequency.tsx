import React, {useEffect, useRef} from "react";
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
    bin: number[],
    frequency: number[],
}

const KeywordFrequency: React.FC<KeywordFrequencyProps> = ({bin, frequency}) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const classes = useStyles();
    const theme = useTheme();
    const lightColor = theme.palette.secondary.light;

    useEffect(() => {
        if (!wrapperRef.current) return;

        const dataCount = bin.length;
        const maxFrequency = Math.max.apply(Math, frequency);

        const margin = {top: 30, right: 10, bottom: 30, left: 50};
        const svgWidth = wrapperRef.current.getBoundingClientRect().width;
        const svgHeight = 200;
        const width = svgWidth - margin.left - margin.right;
        const height = svgHeight - margin.top - margin.bottom;
        const barWidth = width / (dataCount + 1);
        const barOffset = 20;

        // const xScale = d3.scaleBand()
        //     .domain(frequency.map((_, i) => i.toString()))
        //     .range([0, width]);

        const yScale = d3.scaleLinear()
            .domain([0, maxFrequency])
            .range([0, height]);

        console.log(width);
        const chart = d3.select(`#${id}`).append('svg')
            .attr('width', width)
            .attr('height', height)
            .style('background', '#EEE')
            .selectAll('rect').data(frequency)
            .enter().append('rect')
            .style('fill', lightColor)
            .style('opacity', 0.8)
            .attr('width', barWidth)
            .attr('height', 0)
            .attr('x', function (data: any, i: number) {
                return i * (barWidth + barOffset);
            })
            .attr('y', height)
            .on('mouseover', function(data) {
                d3.select(this)
                    .style('opacity', 1)
            })

            .on('mouseout', function(data) {
                d3.select(this)
                    .style('opacity', 0.5)
            });

        chart.transition()
            .attr('height', (d: number) => yScale(d))
            .attr('y', (d: number) => height - yScale(d))
            .delay(function (data, i) {
                return i * 20;
            })
            .duration(2000)
            .ease(d3.easeElastic)

    }, [wrapperRef]);


    return (
        <div ref={wrapperRef} className={classes.root} id={id}>

        </div>
    )
};

export default KeywordFrequency