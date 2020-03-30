import * as d3 from "d3";

const getAccumulativeSum = (array: number[]) => {
    // TODO O(n^2)
    const result: number[] = [];
    const sumHash: {[key: string]: number} = {};
    array.forEach((num, index, arr) => {
        let i = index - 1;
        let sum = 0;
        while (i >= 0) {
            if (sumHash[i] !== undefined) {
                sum += sumHash[i];
                break
            } else {
                sum += arr[i];
                i--
            }
        }
        sumHash[index - 1] = sum;
        result.push(sum)
    });

    return result
};

export interface StackedLineChartD3Data {
    quantity: number[][],
    series: string[],
    order: string[]
}

class StackedLineChartD3 {
    readonly monthStrings = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    colors = {
        getAreaColor: (index: number) => {
            const colors = ['#003f5c', '#374c80', '#7a5195' ,'#bc5090' ,'#ef5675' ,'#ff764a' ,'#ffa600'];
            // const colors = ['#ffa600', '#ff764a', '#ef5675' ,'#bc5090' ,'#7a5195' ,'#374c80' ,'#003f5c'];
            return colors[index > colors.length - 1 ? 0 : index]
        },
        textColor: '#555',
        domainColor: 'red'
    };
    svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>;
    dimensions: {
        svgWidth: number,
        svgHeight: number,
        m: {t: number, r: number, b: number, l: number},
        chartWidth: number,
        chartHeight: number
    };
    scales: {
        y: d3.ScaleLinear<number, number>,
        x: d3.ScaleLinear<number, number>,
        xBand: d3.ScaleBand<string>
    };
    axes: {
        y: d3.Axis<number | {valueOf(): number}>,
        x: d3.Axis<number | {valueOf(): number}>,
        yAreaTitle: d3.Axis<number | {valueOf(): number}>,
        xHover: d3.Axis<number | {valueOf(): number}>,
        yHover: d3.Axis<number | {valueOf(): number}>,
    };
    references: {
        axisX: d3.Selection<SVGGElement, unknown, HTMLElement, any> | null,
        axisY: d3.Selection<SVGGElement, unknown, HTMLElement, any> | null,
        axisYAreaTitle: d3.Selection<SVGGElement, unknown, HTMLElement, any> | null,
        axisXHover: d3.Selection<SVGGElement, unknown, HTMLElement, any> | null,
        axisYHover: d3.Selection<SVGGElement, unknown, HTMLElement, any> | null,
        paths: d3.Selection<SVGPathElement, d3.Series<{ [key: string]: number; }, string>, SVGGElement, any> | null,
        detectionRects: d3.Selection<SVGRectElement, number[], SVGGElement, any> | null,
    };
    data: {
        stackData: {[key: string]: number}[],
        maxQuantity: number
    } & StackedLineChartD3Data;
    shapes: {
        stack: d3.Stack<number, {[key: string]: number}, string>,
        getArea: (t: number) => d3.Area<any>
    };


    constructor(id: string, data: StackedLineChartD3Data, width: number, height: number) {
        this.svg = d3.select(`#${id}`).append("svg");
        this.data = this.getData(data, true);
        this.dimensions = this.getDimension(width, height);
        this.scales = this.getScales();
        this.references = {
            axisX: null,
            axisY: null,
            axisYAreaTitle: null,
            axisXHover: null,
            axisYHover: null,
            paths: null,
            detectionRects: null
        };
        this.shapes = this.getShapes();
        this.axes = this.getAxes();
    }

    getData(data: StackedLineChartD3Data, convertToPercentage: boolean) {
        let maxQuantity: number;
        // percentage convert the daily quantity from absolute value to percentage of the sum of quantity in that day
        // curve can be more readable in this way
        if (convertToPercentage) {
            const percentage = data.quantity.map(arr => {
                const arrayLength = arr.length;
                const sum = arr.reduce((a, b) => a + b);
                return arr.map(num => sum === 0 ? (1 / arrayLength) : (num / sum))
            });
            data = Object.assign({}, data, {quantity: percentage});
            maxQuantity = 1;
        } else {
            const maxS = data.quantity.map(arr => arr.reduce((a, b) => a + b));
            maxQuantity = Math.max.apply(Math, maxS);
        }

        const stackData = data.quantity.map(arr => {
            const obj: {[key: string]: number} = {};
            arr.forEach((_, i) => obj[`${i}`] = _);
            return obj
        });

        return {
            ...data,
            stackData,
            maxQuantity
        }
    }

    getDimension(width: number, height: number) {
        const m = {t: 10, r: 150, b: 50, l: 50};
        const chartWidth = width - m.l - m.r;
        const chartHeight = height - m.t - m.b;
        return {
            svgWidth: width,
            svgHeight: height,
            m,
            chartWidth,
            chartHeight
        }
    }

    getScales() {
        const xRange = [this.dimensions.m.l, this.dimensions.m.l + this.dimensions.chartWidth];
        const x = d3.scaleLinear()
            .domain([0, this.data.series.length - 1])
            .range(xRange);
        const y = d3.scaleLinear()
            .domain([0, this.data.maxQuantity])
            .range([this.dimensions.chartHeight + this.dimensions.m.t, this.dimensions.m.t]);
        const xBand = d3.scaleBand()
            .domain(this.data.quantity.map((_, i) => `${i}`))
            // @ts-ignore
            .range(xRange);
        return {
            x,
            y,
            xBand
        }
    }

    getAxes() {
        const x = d3.axisBottom(this.scales.x)
            .tickValues([0, Math.floor(this.data.series.length * 0.25), Math.floor(this.data.series.length * 0.5), Math.floor(this.data.series.length * 0.75), this.data.series.length - 1])
            .tickFormat((d, i) => {
                const isoString = this.data.series[parseInt(`${d}`)];
                const date = new Date(isoString);
                return `${date.getUTCDate()} ${this.monthStrings[date.getUTCMonth()]}, ${date.getUTCFullYear()}`
            });
        const y = d3.axisLeft(this.scales.y)
            .tickValues([0, this.data.maxQuantity])
            .tickFormat((i) => ['0%', '100%'][parseInt(`${i}`)]);

        const lastDayQuantities = this.data.quantity[this.data.quantity.length - 1].slice();
        const yAreaTitleTickValues = getAccumulativeSum(lastDayQuantities);
        yAreaTitleTickValues.forEach((num, i , arr) => arr[i] = num + 0.5 * lastDayQuantities[i]);
        const yAreaTitle = d3.axisRight(this.scales.y)
            .tickValues(yAreaTitleTickValues)
            .tickFormat((d, i) => this.data.order[parseInt(`${i}`)]);

        [x, y, yAreaTitle].forEach(_=>{
            _
                .tickSize(0)
                .tickPadding(10)
        });

        const xHover = d3.axisBottom(this.scales.x)
            .ticks(20);
        const yHover = d3.axisLeft(this.scales.y)
            .ticks(20);
        const yHoverMoving = d3.axisLeft(this.scales.y)
            .ticks(0);
        
        return {
            x,
            y,
            yAreaTitle,
            xHover,
            yHover,
            yHoverMoving
        }
    }

    initAxes() {
        this.references.axisX = this.svg.append('g');
        this.references.axisY = this.svg.append('g');
        this.references.axisYAreaTitle = this.svg.append('g');
        this.references.axisXHover = this.svg.append('g');
        this.references.axisYHover = this.svg.append('g');

        this.axes.x(this.references.axisX);
        this.axes.y(this.references.axisY);
        this.axes.yAreaTitle(this.references.axisYAreaTitle);
        this.axes.xHover(this.references.axisXHover);
        this.axes.yHover(this.references.axisYHover);

        this.references.axisX.style('transform', `translate(0px, ${this.dimensions.m.t + this.dimensions.chartHeight}px)`);
        this.references.axisY.style('transform', `translate(${this.dimensions.m.l}px, 0px)`);
        this.references.axisYAreaTitle.style('transform', `translate(${this.dimensions.m.l + this.dimensions.chartWidth}px, 0px)`);
        this.references.axisXHover.style('transform', `translate(0px, ${this.dimensions.m.t + this.dimensions.chartHeight}px)`);

        const allAxes = [this.references.axisX, this.references.axisY, this.references.axisYAreaTitle, this.references.axisXHover, this.references.axisYHover];

        allAxes.forEach(_ => {
            _
                .selectAll('text')
                .style('font-size', '0.875rem')
                .style('font-weight', 700)
                .style('fill', this.colors.textColor)
        });
        allAxes.forEach(_ => {
            _
                .selectAll('.domain')
                .style('stroke', this.colors.domainColor)
                .attr('stroke-width', 5)
        });
        allAxes.forEach(_ => {
            _.style('opacity', 1)
        });

        this.references.axisYAreaTitle
            .selectAll('text')
            .style('fill', (d, i) => this.colors.getAreaColor(i))
            .style('text-transform', 'uppercase')
    }

    getShapes() {
        const keys: string[] = this.data.order.map((_,i) => `${i}`);
        const stack = d3.stack()
            .keys(keys)
            .order(d3.stackOrderNone)
            .offset(d3.stackOffsetNone);

        const getArea = (t: number) => {
            return d3.area()
                .x((d, i) => {
                    return this.scales.x(i)
                })
                .y0((d) => {
                    return this.scales.y(d[0] + (this.data.maxQuantity) * (1 - t))
                })
                .y1((d) => this.scales.y(d[1] + (this.data.maxQuantity) * (1 - t)))
                // .curve(d3.curveNatural)
        };

        return {
            stack,
            getArea
        }
    }

    initSvg() {
        this.svg
            .attr('width', this.dimensions.svgWidth)
            .attr('height', this.dimensions.svgHeight)
    }

    initLineChart() {
        this.references.paths = this.svg.append('g')
            .selectAll('path')
            .data(this.shapes.stack(this.data.stackData))
            .enter()
            .append('path')
            .attr('d', (d) => this.shapes.getArea(0)(d))
            .attr('fill', (d, i) => this.colors.getAreaColor(i))
    }

    initDetectionRects() {
        this.references.detectionRects = this.svg.append('g')
            .selectAll('rect')
            .data(this.data.quantity)
            .enter()
            .append('rect')
            .attr('x', (d, i) => {
                return this.scales.xBand(i.toString()) || '0'
            })
            .attr('y', this.dimensions.m.t)
            .attr('width', this.scales.xBand.bandwidth)
            .attr('height', this.dimensions.chartHeight)
            .style('fill', '#fff')
            .style('opacity', 0)
    }

    animate() {
        if (!this.references.paths) return;

        this.references.paths.transition()
            .delay((d, i) => i * 200)
            .duration(1000)
            .attrTween('d', (d) => {
                return (t: number) => {
                    return this.shapes.getArea(t)(d) || ''
                }
            })
            .ease(d3.easeExpIn);

        setTimeout(() => {
            // this.appendMouseEventToSvg();
            this.toggleAllAxes(true)
        }, this.data.order.length * 200 + 1000 + 200)
    }

    toggleAllAxes(on: boolean) {
        const opacity = on ? 1 : 0;
        [
            this.references.axisYAreaTitle,
            this.references.axisX,
            this.references.axisY
        ].forEach(_ => {
            _?.transition()
                .duration(500)
                .style('opacity', opacity)
        })
    }

    appendMouseEventToSvg() {
        this.svg
            .on('mouseover', () => {
                this.toggleAllAxes(true)
            })
            .on('mouseleave', () => {
                this.toggleAllAxes(false)
            })
    }

    appendMouseEventToDetectionRects() {
        this.references.detectionRects
            ?.on('mouseover', function(d, i) {
                d3.select(this).style('opacity', 0.3)
             })
            .on('mouseleave', function(d, i) {
                d3.select(this).style('opacity', 0)
            })
    }

    main() {
        this.initSvg();
        this.initLineChart();
        this.initAxes();
        this.initDetectionRects();
        this.appendMouseEventToDetectionRects();
    }
}

export default StackedLineChartD3