import * as d3 from "d3";

export interface HeatMapData {
    count: number[],
    time: number[]
}

class HeatMapD3 {

    readonly getColor = (index: number) => {
        const colors = ['#003f5c', '#374c80', '#7a5195' ,'#bc5090' ,'#ef5675' ,'#ff764a' ,'#ffa600'];
        return colors[index > colors.length - 1 ? 0 : index]
    };
    readonly dayOfWeekStrings = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    readonly MonthStrings = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    id: string;
    params: {
        width: number,
        height: number,
        m: {t: number, r: number, b: number, l: number},
        chart: {
            width: number,
            height: number,
            x: number,
            y: number
        };
    };
    svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>;
    references: {
        xAxis: d3.Selection<SVGGElement, unknown, HTMLElement, any>,
        yAxis: d3.Selection<SVGGElement, unknown, HTMLElement, any>,
        rects: d3.Selection<SVGRectElement, {count: number, time: number}, SVGGElement, any>,
    };
    data: {
        x: number[], // # of week
        y: number[], // # of day of week
        xScaleDomain: string[],
        yScaleDomain: string[],
        data: Array<{
            count: number,
            time: number
        }>,
        maxCount: number
    };
    scales: {
        x: d3.ScaleBand<string>,
        y: d3.ScaleBand<string>,
        color: d3.ScaleQuantize<number>
    };
    axis: {
        x: d3.Axis<string>,
        y: d3.Axis<string>,
    };

    constructor(id: string, data: HeatMapData, width: number) {
        this.id = id;
        this.params = this.getParams(width);
        this.svg = d3.select(`#${id}`).append("svg");
        this.data = this.getData(data);
        this.references = this.createReferences();
        this.scales = this.getScales();
        this.axis = this.getAxis();
    }

    getParams(width: number) {
        const height = width * 0.6;
        const m = {t: 20, r: 30, b: 20, l: 30};
        const chart = {
            width: width - m.l - m.r,
            height: height - m.t - m.b,
            x: m.l,
            y: m.t
        };

        return {
            width,
            height,
            m,
            chart
        }
    };

    getScales() {
        return {
            x: d3.scaleBand()
                .domain(this.data.xScaleDomain)
                .range([0, this.params.chart.width])
                .padding(0.1),
            y: d3.scaleBand()
                .domain(this.data.yScaleDomain)
                .range([0, this.params.chart.height])
                .padding(0.1),
            color: d3.scaleQuantize()
                .domain([0, this.data.maxCount])
                .range([0, 0.25, 0.5, 0.75, 1])
        }
    }

    getAxis() {
        return {
            x: d3.axisBottom(this.scales.x),
            y: d3.axisLeft(this.scales.y)
                .tickFormat((d) => this.dayOfWeekStrings[parseInt(d)])
        }
    }

    getData(data: HeatMapData) {
        // compensate the data array with empty data first, making the first day of the data array is Sunday.
        const _data = data.time.map((_, i) => ({
            count: data.count[i],
            time: _
        }));
        const aDay = 1000 * 60 * 60 * 24;
        const firstActualData = new Date(_data[0].time);
        let compensation = firstActualData.getUTCDay();
        let time = _data[0].time;
        while (compensation > 0) {
            _data.unshift({
                count: 0,
                time
            });
            compensation--;
            time -= aDay
        }

        //
        const getY = (time: number[]) => {
            // day of week
            const firstDataDay = new Date(time[0]).getUTCDay();
            return time.map(_ => (new Date(_).getUTCDay() - firstDataDay) % 7)
        };

        const getX = (time: number[]) => {
            return time.map((_, i) => Math.floor(i / 7))
        };

        const timeArray = _data.map(_=>_.time);
        const computedX = getX(timeArray);
        const xScaleDomain = [];
        for (let i=0; i<=computedX[computedX.length - 1]; i++) {
            xScaleDomain.push(i.toString())
        }
        //
        const computedY = getY(timeArray);
        const yScaleDomain = [];
        for (let i=0; i<7; i++) {
            yScaleDomain.push(i.toString())
        }
        //
        const maxCount = Math.max.apply(Math, _data.map(_=>_.count));
        console.log(computedX, computedY);
        return {
            x: computedX,
            y: computedY,
            xScaleDomain,
            yScaleDomain,
            data: _data,
            maxCount
        }
    }

    createReferences() {
        return {
            xAxis: this.svg.append('g'),
            yAxis: this.svg.append('g'),
            rects: this.svg.append('g')
                .selectAll('rect').data(this.data.data)
                .enter().append('rect')
        }
    }

    styleSvg() {
        this.svg
            .attr("width", this.params.width)
            .attr("height", this.params.height);
    }

    styleAxisX() {
        this.axis.x(this.references.xAxis);

        this.references.xAxis
            .style('transform', `translate(${this.params.chart.x}px, ${this.params.chart.y + this.params.chart.height}px)`)
    }

    styleAxisY() {
        this.axis.y(this.references.yAxis);

        this.references.yAxis
            .style('transform', `translate(${this.params.chart.x}px, ${this.params.chart.y}px)`)
    }

    styleRects() {
        this.references.rects
            .style('fill', this.getColor(0))
            .style('opacity', (d) => this.scales.color(d.count))
            .style('transform', `translate(${this.params.chart.x}px, ${this.params.chart.y}px)`)
            .attr('width', this.scales.x.bandwidth())
            .attr('height', this.scales.y.bandwidth())
            .attr('x', (d, i) => this.scales.x(this.data.x[i].toString()) || 0)
            .attr('y', (d, i) => this.scales.y(this.data.y[i].toString()) || 0);

        console.log(this.scales.x.bandwidth(), this.scales.y.bandwidth())
    }

    main() {
        this.styleSvg();
        this.styleAxisX();
        this.styleAxisY();
        this.styleRects();
    }
}

export default HeatMapD3
