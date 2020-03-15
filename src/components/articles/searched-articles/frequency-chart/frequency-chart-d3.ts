import {Theme} from "@material-ui/core";
import * as d3 from "d3";

// TODO: clean up all any types

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

    scales: any;

    references: {
        svg: any
        bars: any,
        axisX: any,
        axisY: any,
        axisXHoverDate: any,
        axisXHoverFrequency: any,
        axisYHover: any,
        hoverDetection: any
    };

    axis: {
        x: any,
        y: any,
        xHoverDate: any,
        xHoverFrequency: any,
        yHover: any
    };

    constructor(theme: Theme, bin: number[], frequency: number[], width: number, selector: string) {
        this.dataArray = {
            bin,
            frequency
        };
        this.auxArray = {
            binDate: [],
            barTransitionDelay: []
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
        this.dimension = {
            svgWidth: 0,
            svgHeight: 0,
            m: {t: 0, r: 0, b: 0, l: 0},
            chartWidth: 0,
            chartHeight: 0,
            chartX: 0,
            chartY: 0
        };
        this.references = {
            svg: null,
            bars: null,
            axisX: null,
            axisY: null,
            axisXHoverDate: null,
            axisXHoverFrequency: null,
            axisYHover: null,
            hoverDetection: null
        };

        this.axis = {
            x: null,
            y: null,
            xHoverDate: null,
            xHoverFrequency: null,
            yHover: null
        };
        this.setHoverDetectionEventHandlers = this.setHoverDetectionEventHandlers.bind(this);
    }

    createBinDateArray() {
        this.auxArray.binDate = this.dataArray.bin.map(num => {
            const date = new Date(num);
            return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
        })
    }

    createBarTransitionDelayArray() {
        const array = [];
        let delay = this.params.TRANSITION_DELAY;
        let step = 20;
        for (let i=0; i<this.dataArray.frequency.length; i++) {
            if (this.dataArray.frequency[i] === 0) {
                array.push(delay)
            } else {
                array.push(delay+=step);
            }
        }
        this.auxArray.barTransitionDelay = array.slice();
    }

    setDimensions() {
        const svgWidth = this.params.argWidth;
        const svgHeight = Math.min(Math.round(svgWidth / 3), 200);
        const m = {t: 10, r: 30, b: 30, l: 30}; // margin
        const chartWidth = svgWidth - m.l - m.r;
        const chartHeight = svgHeight - m.t - m.b;
        const chartX = m.l;
        const chartY = m.t;

        this.dimension = {
            svgWidth,
            svgHeight,
            m,
            chartWidth,
            chartHeight,
            chartX,
            chartY
        }
    }

    setScales() {
        this.scales = {
            x: d3.scaleBand()
                .domain(this.dataArray.frequency.map((_, i) => i.toString()))
                .range([0, this.dimension.chartWidth]),
            y: d3.scaleLinear()
                .domain([0, this.params.maxFrequency])
                .range([this.dimension.chartHeight, 0])
        };
    }

    setSvg() {
        this.references.svg = d3.select(`#${this.params.selector}`).append('svg');
        this.references.svg
            .attr('width', this.dimension.svgWidth)
            .attr('height', this.dimension.svgHeight)
            .style('background', this.params.backgroundColor);

    }

    setBars() {
        this.references.bars = this.references.svg.append('g')
            .selectAll('rect').data(this.dataArray.frequency)
            .enter().append('rect');

        const barWidth = this.scales.x.bandwidth();
        const barHeight = (d: number) => this.dimension.chartHeight - this.scales.y(d);
        const barX = (d: any, i: number) => this.dimension.chartX + (this.scales.x(i.toString()) || 0);
        const barY = (d: any) => this.dimension.chartY + this.dimension.chartHeight - barHeight(d);

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
            .delay((d: any, i: any) => this.auxArray.barTransitionDelay[i])
            .duration(this.params.BAR_TRANSITION_DURATION)
            .ease(d3.easeElastic);
    }

    setAxisX() {
        this.references.axisX = this.references.svg.append('g');
        this.axis.x = d3.axisBottom(this.scales.x);
        this.axis.x
            .tickSizeOuter(0)
            .tickFormat((d: any, i: any) => this.auxArray.binDate[parseInt(d)])
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
        this.references.axisY = this.references.svg.append('g');
        this.axis.y = d3.axisLeft(this.scales.y);
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
        this.references.axisXHoverDate = this.references.svg.append('g');
        this.axis.xHoverDate = d3.axisBottom(this.scales.x);

        this.references.axisXHoverDate.style('opacity', 0)
            .style('transform', `translate(${this.dimension.chartX}px, ${this.dimension.chartHeight + this.dimension.chartY}px)`);
        this.axis.xHoverDate
            .tickFormat((d: any) => this.auxArray.binDate[parseInt(d)]);
    }

    setAxisXHoverFrequency() {
        this.references.axisXHoverFrequency = this.references.svg.append('g');
        this.axis.xHoverFrequency = d3.axisBottom(this.scales.x);

        this.references.axisXHoverFrequency.style('opacity', 0);
        this.axis.xHoverFrequency
            .tickFormat((d: any) => `${this.dataArray.frequency[parseInt(d)]}`)
            .tickSize(0)
            .tickPadding(-9);
    }

    setAxisYHover() {
        this.references.axisYHover = this.references.svg.append('g');
        this.axis.yHover = d3.axisLeft(this.scales.y);
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
        const barX = (d: any, i: number) => this.dimension.chartX + (this.scales.x(i.toString()) || 0);

        this.references.hoverDetection = this.references.svg
            .append('g')
            .selectAll('rect').data(this.dataArray.frequency)
            .enter().append('rect');

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
            .on('mouseover', (d: any, i: any) => {
                this.axis.yHover.tickValues([d]);
                this.axis.yHover(this.references.axisYHover);

                this.references.axisYHover
                    .selectAll(".tick line")
                    .style('transform', `translate(-6px, 0)`)
                    .style('color', this.params.primaryColor);
                this.references.axisYHover.selectAll(".domain").remove();
                this.references.axisYHover.style('opacity', 1);

                // const gridTextBox = this.references.hoverDetection.select<SVGTextElement>('text').node()?.getBBox();
                const gridTextBox = this.references.axisYHover.select('text').node()?.getBBox();
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

                // const hoverDateTextBox = hoverDateText.select<SVGTextElement>('text').node()?.getBBox();
                const hoverDateTextBox = this.references.axisXHoverDate.select('text').node()?.getBBox();
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

                const bar = this.references.bars.filter((d: any, index: any) => index === i);
                bar.style('fill', this.params.primaryColor);
            })
            .on('mouseout', (d: any, i: any) => {
                this.references.axisYHover.style('opacity', 0);
                this.references.axisXHoverFrequency.style('opacity', 0);
                this.references.axisXHoverDate.style('opacity', 0);

                this.references.bars.filter((d: any, index: any) => index === i)
                    .style('fill', this.params.lightColor);

            });
    }

    init() {
        this.createBinDateArray();
        this.createBarTransitionDelayArray();
        this.setDimensions();
        this.setScales();
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
        this.init();
        this.draw();
    }
}

export default FrequencyChartD3