import {Theme} from "@material-ui/core";
import * as d3 from "d3";
import getDateString from "../components/articles/searched-articles/utilities/get-date-string";

class FrequencyChartD3 {
    dataArray: {
        bin: number[],
        frequency: number[]
    };

    auxArray: {
        binDate: string[],
        barTransitionDelay: number[]
    };

    params: {
        lightColor: string,
        darkColor: string,
        primaryColor: string,
        backgroundColor: string,
        TRANSITION_DELAY: number,
        BAR_TRANSITION_DURATION: number,
        maxFrequency: number,
        binLength: number,
        argWidth: number,
        selector: string
    };

    dimension: {
        svgWidth: number,
        svgHeight: number,
        m: {t: number, r: number, b: number, l: number},
        chartWidth: number,
        chartHeight: number,
        chartX: number,
        chartY: number
    };

    scales: {
        x: d3.ScaleBand<string>,
        y: d3.ScaleLinear<number, number>
    };

    svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>;

    references: {
        svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>,
        bars: d3.Selection<SVGRectElement, number, SVGGElement, unknown>,
        axisX: d3.Selection<SVGGElement, unknown, HTMLElement, any>,
        axisY: d3.Selection<SVGGElement, unknown, HTMLElement, any>,
        axisXHoverDate: d3.Selection<SVGGElement, unknown, HTMLElement, any>,
        axisXHoverFrequency: d3.Selection<SVGGElement, unknown, HTMLElement, any>,
        axisYHover: d3.Selection<SVGGElement, unknown, HTMLElement, any>,
        hoverDetection: d3.Selection<SVGRectElement, number, SVGGElement, unknown>,
    };

    axis: {
        x: d3.Axis<string>,
        y: d3.Axis<number | {valueOf(): number;}>,
        xHoverDate: d3.Axis<string>,
        xHoverFrequency: d3.Axis<string>,
        yHover: d3.Axis<number | {valueOf(): number;}>,
    };

    constructor(theme: Theme, bin: number[], frequency: number[], width: number, selector: string) {
        this.dataArray = {
            bin,
            frequency
        };
        this.auxArray = {
            binDate: this.getBinDateArray(bin),
            barTransitionDelay: this.getBarTransitionDelayArray(500, frequency)
        };
        this.params = {
            lightColor: theme.palette.secondary.light,
            darkColor: theme.palette.secondary.dark,
            primaryColor: theme.palette.primary.light,
            backgroundColor: '#EEE',
            TRANSITION_DELAY: 500,
            BAR_TRANSITION_DURATION: 2000,
            maxFrequency: Math.max.apply(Math, this.dataArray.frequency),
            binLength: this.dataArray.bin.length,
            argWidth: width,
            selector
        };
        this.dimension = this.getDimensions(width);
        this.svg = d3.select(`#${this.params.selector}`).append('svg');
        this.references = {
            svg: this.svg,
            bars: this.svg
                .append('g')
                .selectAll('rect').data(this.dataArray.frequency)
                .enter().append('rect'),
            axisX: this.svg.append('g'),
            axisY: this.svg.append('g'),
            axisXHoverDate: this.svg.append('g'),
            axisXHoverFrequency: this.svg.append('g'),
            axisYHover: this.svg.append('g'),
            hoverDetection: this.svg
                .append('g')
                .selectAll('rect').data(this.dataArray.frequency)
                .enter().append('rect'),
        };
        this.scales = {
            x: d3.scaleBand()
                .domain(this.dataArray.frequency.map((_, i) => i.toString()))
                .range([0, this.dimension.chartWidth]),
            y: d3.scaleLinear()
                .domain([0, this.params.maxFrequency])
                .range([this.dimension.chartHeight, 0])
        };
        this.axis = {
            x: d3.axisBottom(this.scales.x),
            y: d3.axisLeft(this.scales.y),
            xHoverDate: d3.axisBottom(this.scales.x),
            xHoverFrequency: d3.axisBottom(this.scales.x),
            yHover: d3.axisLeft(this.scales.y)
        };
        this.setHoverDetectionEventHandlers = this.setHoverDetectionEventHandlers.bind(this);
    }

    getBinDateArray(binArray: number[]) {
        return binArray.map(getDateString)
    }

    getBarTransitionDelayArray(transitionDelay: number, frequencyDataArray: number[]) {
        const array = [];
        let delay = transitionDelay;
        let step = 20;
        for (let i=0; i<frequencyDataArray.length; i++) {
            if (frequencyDataArray[i] === 0) {
                array.push(delay)
            } else {
                array.push(delay+=step);
            }
        }
        return array
    }

    getDimensions(width: number) {
        const svgWidth = width;
        const svgHeight = Math.min(Math.round(svgWidth / 3), 200);
        const m = {t: 10, r: 30, b: 30, l: 30}; // margin
        const chartWidth = svgWidth - m.l - m.r;
        const chartHeight = svgHeight - m.t - m.b;
        const chartX = m.l;
        const chartY = m.t;

        return {
            svgWidth,
            svgHeight,
            m,
            chartWidth,
            chartHeight,
            chartX,
            chartY
        }
    }

    setSvg() {
        this.references.svg
            .attr('width', this.dimension.svgWidth)
            .attr('height', this.dimension.svgHeight)
            .style('background', this.params.backgroundColor);

    }

    setBars() {
        const barWidth = this.scales.x.bandwidth();
        const barHeight = (d: number) => this.dimension.chartHeight - this.scales.y(d);
        const barX = (d: number, i: number) => this.dimension.chartX + (this.scales.x(i.toString()) || 0);
        const barY = (d: number) => this.dimension.chartY + this.dimension.chartHeight - barHeight(d);

        this.references.bars
            .style('fill', this.params.lightColor)
            .style('opacity', 0.8)
            .attr('width', barWidth)
            .attr('height', 0)
            .attr('x', barX)
            .attr('y', this.dimension.chartY + this.dimension.chartHeight);

        this.references.bars
            .transition()
            .attr('height', barHeight)
            .attr('y', barY)
            .delay((d: number, i: number) => this.auxArray.barTransitionDelay[i])
            .duration(this.params.BAR_TRANSITION_DURATION)
            .ease(d3.easeElastic);
    }

    setAxisX() {
        this.axis.x
            .tickSizeOuter(0)
            .tickFormat((d, i) => this.auxArray.binDate[parseInt(d)])
            .tickValues([0, Math.floor(this.params.binLength * 0.25), Math.floor(this.params.binLength * 0.5), Math.floor(this.params.binLength * 0.75), this.params.binLength - 1].map(_=>`${_}`));
        this.references.axisX
            .style('transform', `translate(${-0.5*this.dimension.svgWidth}px, ${this.dimension.svgHeight + this.dimension.chartY}px)`)
            .style('opacity', 0)
            .style('color', this.params.darkColor);

        this.references.axisX.transition()
            .style('opacity', 1)
            .style('transform', `translate(${this.dimension.chartX}px, ${this.dimension.chartHeight + this.dimension.chartY}px)`)
            .delay(this.params.TRANSITION_DELAY)
            .duration(1000)
            .ease(d3.easeElastic);

        this.axis.x(this.references.axisX);
    }

    setAxisY() {
        this.axis.y
            .tickSizeOuter(0)
            .tickFormat(d3.format("d"))
            .tickValues([0, Math.floor(this.params.maxFrequency * 0.5), this.params.maxFrequency]);
        this.references.axisY
            .style('transform', `translate(${this.dimension.chartX}px, ${this.dimension.chartHeight}px)`)
            .style('opacity', 0)
            .style('color', this.params.darkColor);

        this.references.axisY.transition()
            .style('opacity', 1)
            .style('transform', `translate(${this.dimension.chartX}px, ${this.dimension.chartY}px)`)
            .delay(this.params.TRANSITION_DELAY)
            .duration(1000)
            .ease(d3.easeElastic);

        this.axis.y(this.references.axisY);
    }

    setAxisXHoverDate() {
        this.references.axisXHoverDate.style('opacity', 0)
            .style('transform', `translate(${this.dimension.chartX}px, ${this.dimension.chartHeight + this.dimension.chartY}px)`);
        this.axis.xHoverDate
            .tickFormat((d) => this.auxArray.binDate[parseInt(d)]);
    }

    setAxisXHoverFrequency() {
        this.references.axisXHoverFrequency.style('opacity', 0);
        this.axis.xHoverFrequency
            .tickFormat((d) => `${this.dataArray.frequency[parseInt(d)]}`)
            .tickSize(0)
            .tickPadding(-9);
    }

    setAxisYHover() {
        this.references.axisYHover.style('opacity', 0)
            .style('transform', `translate(${this.dimension.chartX}px, ${this.dimension.chartY}px)`);
        this.axis.yHover
            .tickFormat(d3.format("d"))
            .tickSizeInner(-this.dimension.chartWidth-6)
            .tickSizeOuter(0)
            .tickPadding(9);
    }

    setHoverDetection() {
        const barWidth = this.scales.x.bandwidth();
        const barX = (d: number, i: number) => this.dimension.chartX + (this.scales.x(i.toString()) || 0);

        this.references.hoverDetection
            .style('opacity', 0)
            .attr('width', barWidth)
            .attr('height', this.dimension.svgHeight)
            .attr('x', barX)
            .attr('y', 0);

        this.setHoverDetectionEventHandlers()
    }

    setHoverDetectionEventHandlers() {
        this.references.hoverDetection
            .on('mouseover', (d, i) => {
                this.axis.yHover.tickValues([d]);
                this.axis.yHover(this.references.axisYHover);

                this.references.axisYHover
                    .selectAll(".tick line")
                    .style('transform', `translate(-6px, 0)`)
                    .style('color', this.params.primaryColor);
                this.references.axisYHover.selectAll(".domain").remove();
                this.references.axisYHover.style('opacity', 1);

                const gridTextBox = this.references.axisYHover.select<SVGTextElement>('text').node()?.getBBox();
                if (gridTextBox) {
                    this.references.axisYHover.selectAll('g.tick').insert('rect',
                        ':first-child')
                        .attr('width', gridTextBox.width)
                        .attr('height', gridTextBox.height)
                        .attr('x', gridTextBox.x)
                        .attr('y', gridTextBox.y)
                        .style('fill', this.params.backgroundColor);
                }

                this.axis.xHoverDate
                    .tickValues([`${i}`]);
                this.axis.xHoverDate(this.references.axisXHoverDate);
                this.references.axisXHoverDate.selectAll(".domain").remove();
                this.references.axisXHoverDate.style('opacity', 1);

                const hoverDateTextBox = this.references.axisXHoverDate.select<SVGTextElement>('text').node()?.getBBox();
                if (hoverDateTextBox) {
                    this.references.axisXHoverDate.selectAll('g.tick').insert('rect',
                        ':first-child')
                        .attr('width', hoverDateTextBox.width*1.2)
                        .attr('height', hoverDateTextBox.height)
                        .attr('x', hoverDateTextBox.x-0.1*hoverDateTextBox.width)
                        .attr('y', hoverDateTextBox.y)
                        .style('fill', this.params.backgroundColor);
                }

                this.axis.xHoverFrequency
                    .tickValues([`${i}`]);
                this.axis.xHoverFrequency(this.references.axisXHoverFrequency);
                this.references.axisXHoverFrequency.selectAll(".domain").remove();
                this.references.axisXHoverFrequency
                    .style('transform', `translate(${this.dimension.chartX}px, ${this.scales.y(d) + this.dimension.chartY}px)`)
                    .style('opacity', 1);

                const bar = this.references.bars.filter((d, index) => index === i);
                bar.style('fill', this.params.primaryColor);
            })
            .on('mouseout', (d, i) => {
                this.references.axisYHover.style('opacity', 0);
                this.references.axisXHoverFrequency.style('opacity', 0);
                this.references.axisXHoverDate.style('opacity', 0);

                this.references.bars.filter((d, index) => index === i)
                    .style('fill', this.params.lightColor);

            })
    }

    bindSetDate(setDate: (date: number) => void) {
        this.references.hoverDetection
            .on('click', (d, i) => {
                setDate(this.dataArray.bin[i])
            })
    }

    draw() {
        this.setSvg();
        this.setBars();
        this.setAxisX();
        this.setAxisY();
        this.setAxisXHoverDate();
        this.setAxisXHoverFrequency();
        this.setAxisYHover();
        this.setHoverDetection();
    }

    main() {
        this.draw();
    }
}

export default FrequencyChartD3